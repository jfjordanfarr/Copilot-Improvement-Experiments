import * as path from "path";
import process from "process";

import * as vscode from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from "vscode-languageclient/node";
import { ensureProviderSelection } from "./onboarding/providerGate";
import { ConfigService } from "./settings/configService";
import { registerFileMaintenanceWatcher } from "./watchers/fileMaintenance";
import { showRebindPrompt } from "./prompts/rebindPrompt";
import { RebindRequiredPayload } from "@copilot-improvement/shared";
import { registerOverrideLinkCommand } from "./commands/overrideLink";

const SETTINGS_NOTIFICATION = "linkDiagnostics/settings/update";
const REBIND_NOTIFICATION = "linkDiagnostics/maintenance/rebindRequired";

let client: LanguageClient | undefined;
let configService: ConfigService | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const serverModule = context.asAbsolutePath(path.join("..", "server", "dist", "main.js"));

  configService = new ConfigService();
  context.subscriptions.push(configService);

  await ensureProviderSelection(context, configService);

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
    settings: configService.settings
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: "file", language: "markdown" },
      { scheme: "file", language: "plaintext" },
      { scheme: "file", language: "typescript" },
      { scheme: "file", language: "javascript" }
    ],
    synchronize: {
      fileEvents: vscode.workspace.createFileSystemWatcher("**/*.{md,markdown,ts,js,tsx,jsx}")
    },
    initializationOptions
  };

  client = new LanguageClient(
    "linkAwareDiagnostics",
    "Link-Aware Diagnostics",
    serverOptions,
    clientOptions
  );

  context.subscriptions.push(client.start());

  client.onReady().then(() => {
    context.subscriptions.push(
      configService!.onDidChange(settings => {
        void client?.sendNotification(SETTINGS_NOTIFICATION, settings);
      })
    );

    void client.sendNotification(SETTINGS_NOTIFICATION, configService!.settings);

    client.onNotification(REBIND_NOTIFICATION, (payload: RebindRequiredPayload) => {
      void showRebindPrompt(payload);
    });

    context.subscriptions.push(registerFileMaintenanceWatcher(client!));
    context.subscriptions.push(registerOverrideLinkCommand(client!));
  });

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
}
