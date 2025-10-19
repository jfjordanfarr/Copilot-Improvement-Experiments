import * as path from "path";
import process from "process";
import * as vscode from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from "vscode-languageclient/node";

import { RebindRequiredPayload } from "@copilot-improvement/shared";

import { registerOverrideLinkCommand } from "./commands/overrideLink";
import { registerDocDiagnosticProvider } from "./diagnostics/docDiagnosticProvider";
import { ensureProviderSelection } from "./onboarding/providerGate";
import { showRebindPrompt } from "./prompts/rebindPrompt";
import { ConfigService } from "./settings/configService";
import { registerFileMaintenanceWatcher } from "./watchers/fileMaintenance";

const SETTINGS_NOTIFICATION = "linkDiagnostics/settings/update";
const REBIND_NOTIFICATION = "linkDiagnostics/maintenance/rebindRequired";

let client: LanguageClient | undefined;
let configService: ConfigService | undefined;
let clientReady = false;

function hasClearFunction(value: unknown): value is { clear: () => void } {
  return typeof value === "object" && value !== null && typeof (value as { clear?: unknown }).clear === "function";
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const serverModule = context.asAbsolutePath(path.join("..", "server", "dist", "main.js"));

  configService = new ConfigService();
  context.subscriptions.push(configService);

  await ensureProviderSelection(context, configService);
  console.log("linkAwareDiagnostics configuration after onboarding", configService.settings);

  const isTestMode = context.extensionMode === vscode.ExtensionMode.Test;

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc, options: { env: process.env } },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: { env: { ...process.env, DEBUG_LINK_AWARE: "1" } }
    }
  };

  const initializationOptions = {
    storagePath: context.globalStorageUri.fsPath,
    settings: configService.settings,
    testModeOverrides: isTestMode
      ? {
          enableDiagnostics: true,
          llmProviderMode: "local-only"
        }
      : undefined
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: "file", language: "markdown" },
      { scheme: "file", language: "plaintext" },
      { scheme: "file", language: "typescript" },
      { scheme: "file", language: "javascript" },
      { scheme: "file", language: "tsx" },
      { scheme: "file", language: "jsx" }
    ],
    synchronize: {
      fileEvents: vscode.workspace.createFileSystemWatcher("**/*.{md,markdown,ts,js,tsx,jsx}")
    },
    initializationOptions,
    diagnosticCollectionName: "Link Diagnostics"
  };

  client = new LanguageClient(
    "linkAwareDiagnostics",
    "Link-Aware Diagnostics",
    serverOptions,
    clientOptions
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("linkAwareDiagnostics.isServerReady", () => {
      console.log("isServerReady invoked", clientReady);
      return clientReady;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("linkAwareDiagnostics.clearAllDiagnostics", () => {
      const diagnostics = client?.diagnostics;
      if (hasClearFunction(diagnostics)) {
        diagnostics.clear();
      }
      return true;
    })
  );

  clientReady = false;
  await client.start();
  const readyClient = client as unknown as { onReady?: () => Promise<void> };
  if (typeof readyClient.onReady === "function") {
    await readyClient.onReady();
  }
  clientReady = true;

  const activeClient = client;
  const activeConfigService = configService;
  if (!activeClient || !activeConfigService) {
    return;
  }

  context.subscriptions.push(
    activeConfigService.onDidChange(settings => {
      void activeClient.sendNotification(SETTINGS_NOTIFICATION, settings);
    })
  );

  await activeClient.sendNotification(SETTINGS_NOTIFICATION, activeConfigService.settings);

  context.subscriptions.push(
    activeClient.onNotification(REBIND_NOTIFICATION, (payload: RebindRequiredPayload) => {
      void showRebindPrompt(payload);
    })
  );

  context.subscriptions.push(registerFileMaintenanceWatcher(activeClient));
  context.subscriptions.push(registerOverrideLinkCommand(activeClient));
  context.subscriptions.push(registerDocDiagnosticProvider());

  context.subscriptions.push(
    vscode.languages.onDidChangeDiagnostics(event => {
      for (const uri of event.uris) {
        const diagnostics = vscode.languages.getDiagnostics(uri);
        if (!diagnostics.some(diagnostic => diagnostic.code === "doc-drift")) {
          continue;
        }

        const uriString = uri.toString();
        if (vscode.workspace.textDocuments.some(document => document.uri.toString() === uriString)) {
          continue;
        }

        void vscode.workspace.openTextDocument(uri).then(
          undefined,
          (error: unknown) => {
            console.warn(
              `Failed to preload document for diagnostics: ${error instanceof Error ? error.message : String(error)}`
            );
          }
        );
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("linkDiagnostics.analyzeWithAI", async () => {
      await vscode.window.showInformationMessage(
        "AI analysis is gated until provider consent is implemented."
      );
    })
  );
}

export async function deactivate(): Promise<void> {
  if (!client) {
    return;
  }

  await client.stop();
  client = undefined;
  clientReady = false;
}
