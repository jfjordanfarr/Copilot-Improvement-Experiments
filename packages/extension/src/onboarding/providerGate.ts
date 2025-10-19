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

  const applySelection = async (
    mode: ProviderChoice["mode"],
    enableDiagnostics: boolean
  ): Promise<void> => {
    const config = vscode.workspace.getConfiguration("linkAwareDiagnostics");
    await Promise.all([
      config.update("llmProviderMode", mode, vscode.ConfigurationTarget.Workspace),
      config.update("enableDiagnostics", enableDiagnostics, vscode.ConfigurationTarget.Workspace)
    ]);
    await context.globalState.update(ONBOARDED_KEY, true);
    configService.refresh();
  };

  const forcedMode = process.env.LINK_AWARE_PROVIDER_MODE as
    | "prompt"
    | "local-only"
    | "disabled"
    | undefined;

  if (context.extensionMode === vscode.ExtensionMode.Test) {
    const mode = forcedMode ?? "local-only";
    await applySelection(mode, mode !== "disabled");
    return;
  }

  if (forcedMode) {
    await applySelection(forcedMode, forcedMode !== "disabled");
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

  await applySelection(selection.mode, selection.enableDiagnostics);

  if (selection.mode === "disabled") {
    await vscode.window.showInformationMessage(
      "You can enable diagnostics later from the Link-Aware Diagnostics settings."
    );
  }
}
