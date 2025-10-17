import * as vscode from "vscode";

import { ConfigService } from "../settings/configService";

const ONBOARDED_KEY = "linkDiagnostics.providerOnboarded";

interface ProviderChoice {
  label: string;
  mode: "prompt" | "local-only" | "disabled";
  enableDiagnostics: boolean;
}

export async function ensureProviderSelection(
  context: vscode.ExtensionContext,
  configService: ConfigService
): Promise<void> {
  if (context.globalState.get<boolean>(ONBOARDED_KEY)) {
    return;
  }

  const quickPickItems: ProviderChoice[] = [
    {
      label: "Enable diagnostics with local provider",
      mode: "local-only",
      enableDiagnostics: true
    },
    {
      label: "Prompt me to choose a provider each time",
      mode: "prompt",
      enableDiagnostics: true
    },
    {
      label: "Keep diagnostics disabled",
      mode: "disabled",
      enableDiagnostics: false
    }
  ];

  const selection = await vscode.window.showQuickPick(quickPickItems, {
    placeHolder: "Select how Link-Aware Diagnostics should use language models",
    ignoreFocusOut: true
  });

  if (!selection) {
    void vscode.window.showWarningMessage(
      "Diagnostics remain disabled until you choose how to handle LLM providers."
    );
    return;
  }

  const config = vscode.workspace.getConfiguration("linkAwareDiagnostics");
  await Promise.all([
    config.update("llmProviderMode", selection.mode, vscode.ConfigurationTarget.Workspace),
    config.update(
      "enableDiagnostics",
      selection.enableDiagnostics,
      vscode.ConfigurationTarget.Workspace
    )
  ]);

  if (selection.mode === "disabled") {
    await vscode.window.showInformationMessage(
      "You can enable diagnostics later from the Link-Aware Diagnostics settings."
    );
  }

  await context.globalState.update(ONBOARDED_KEY, true);

  configService.refresh();
}
