import * as vscode from "vscode";

const DOC_DRIFT_CODE = "doc-drift";
const DEFAULT_ACTION_TITLE = "Open linked artifact";

export const OPEN_LINKED_ARTIFACT_COMMAND = "linkDiagnostics.openLinkedArtifact";

interface DocDriftDiagnosticData {
  triggerUri?: string;
  linkKind?: string;
  linkId?: string;
}

export function registerDocDiagnosticProvider(): vscode.Disposable {
  const selector: vscode.DocumentSelector = [
    { scheme: "file", language: "markdown" },
    { scheme: "file", language: "plaintext" },
    { scheme: "file", language: "typescript" },
    { scheme: "file", language: "javascript" },
    { scheme: "file", language: "tsx" },
    { scheme: "file", language: "jsx" }
  ];

  const provider = new DocDiagnosticCodeActionProvider();

  const codeActions = vscode.languages.registerCodeActionsProvider(selector, provider, {
    providedCodeActionKinds: provider.providedCodeActionKinds
  });

  const command = vscode.commands.registerCommand(
    OPEN_LINKED_ARTIFACT_COMMAND,
    async (uriLike: string | vscode.Uri) => {
      const targetUri = normaliseUri(uriLike);
      if (!targetUri) {
        void vscode.window.showWarningMessage(
          "Unable to open linked artifact because its URI is missing or invalid."
        );
        return;
      }

      try {
        const document = await vscode.workspace.openTextDocument(targetUri);
        await vscode.window.showTextDocument(document, { preview: false });
      } catch (error) {
        void vscode.window.showErrorMessage(
          `Failed to open linked artifact: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  return vscode.Disposable.from(codeActions, command);
}

class DocDiagnosticCodeActionProvider implements vscode.CodeActionProvider {
  readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

  provideCodeActions(
    _document: vscode.TextDocument,
    _range: vscode.Range,
    context: vscode.CodeActionContext
  ): vscode.CodeAction[] {
    const actions: vscode.CodeAction[] = [];

    for (const diagnostic of context.diagnostics) {
      if (!isDocDriftDiagnostic(diagnostic)) {
        continue;
      }

      const data = getDocDiagnosticData(diagnostic);
      if (!data?.triggerUri) {
        continue;
      }

      const title = buildActionTitle(data);
      const action = new vscode.CodeAction(title, vscode.CodeActionKind.QuickFix);
      action.diagnostics = [diagnostic];
      action.isPreferred = true;
      action.command = {
        title,
        command: OPEN_LINKED_ARTIFACT_COMMAND,
        arguments: [data.triggerUri]
      };

      actions.push(action);
    }

    return actions;
  }
}

function isDocDriftDiagnostic(diagnostic: vscode.Diagnostic): boolean {
  if (typeof diagnostic.code === "string") {
    return diagnostic.code === DOC_DRIFT_CODE;
  }

  if (
    diagnostic.code &&
    typeof diagnostic.code === "object" &&
    "value" in diagnostic.code &&
    typeof (diagnostic.code as { value: unknown }).value === "string"
  ) {
    return (diagnostic.code as { value: string }).value === DOC_DRIFT_CODE;
  }

  return false;
}

function getDocDiagnosticData(diagnostic: vscode.Diagnostic): DocDriftDiagnosticData | undefined {
  const candidate = diagnostic as vscode.Diagnostic & { data?: unknown };
  if (!candidate.data || typeof candidate.data !== "object") {
    return undefined;
  }

  const data = candidate.data as Record<string, unknown>;
  const triggerUri = typeof data.triggerUri === "string" ? data.triggerUri : undefined;
  const linkKind = typeof data.linkKind === "string" ? data.linkKind : undefined;
  const linkId = typeof data.linkId === "string" ? data.linkId : undefined;

  if (!triggerUri) {
    return undefined;
  }

  return { triggerUri, linkKind, linkId };
}

function buildActionTitle(data: DocDriftDiagnosticData): string {
  const kind = data.linkKind ?? "";

  switch (kind) {
    case "documents":
      return "Open linked documentation";
    case "implements":
      return "Open linked documentation";
    case "depends_on":
      return "Open linked dependency";
    case "references":
      return "Open linked reference";
    default:
      return DEFAULT_ACTION_TITLE;
  }
}

function normaliseUri(uriLike: string | vscode.Uri | undefined): vscode.Uri | undefined {
  if (!uriLike) {
    return undefined;
  }

  if (uriLike instanceof vscode.Uri) {
    return uriLike;
  }

  try {
    return vscode.Uri.parse(uriLike);
  } catch {
    return undefined;
  }
}