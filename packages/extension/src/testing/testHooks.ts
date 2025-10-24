import * as vscode from "vscode";

type WindowMethodKey = "showQuickPick" | "showInformationMessage" | "showErrorMessage";

type WindowOverrides = Partial<Pick<typeof vscode.window, WindowMethodKey>>;

interface LinkAwareDiagnosticsTestHooks {
  window?: WindowOverrides;
}

interface GlobalWithLinkAwareHooks {
  __linkAwareDiagnosticsTestHooks?: LinkAwareDiagnosticsTestHooks;
}

const globalWithHooks = globalThis as GlobalWithLinkAwareHooks;

function getWindowOverrides(): WindowOverrides | undefined {
  return globalWithHooks.__linkAwareDiagnosticsTestHooks?.window;
}

export function resolveWindowApis(): {
  showQuickPick: typeof vscode.window.showQuickPick;
  showInformationMessage: typeof vscode.window.showInformationMessage;
  showErrorMessage: typeof vscode.window.showErrorMessage;
} {
  const overrides = getWindowOverrides();

  const showQuickPick = overrides?.showQuickPick ?? vscode.window.showQuickPick.bind(vscode.window);
  const showInformationMessage = overrides?.showInformationMessage ?? vscode.window.showInformationMessage.bind(vscode.window);
  const showErrorMessage = overrides?.showErrorMessage ?? vscode.window.showErrorMessage.bind(vscode.window);

  return {
    showQuickPick,
    showInformationMessage,
    showErrorMessage
  };
}
