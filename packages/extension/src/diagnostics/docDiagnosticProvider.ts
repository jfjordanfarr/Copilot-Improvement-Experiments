import * as vscode from "vscode";

import { ACKNOWLEDGE_DIAGNOSTIC_COMMAND } from "../commands/acknowledgeDiagnostic";

const DOC_DRIFT_CODE = "doc-drift";
const CODE_RIPPLE_CODE = "code-ripple";
const DEFAULT_ACTION_TITLE = "Open linked artifact";

export const OPEN_LINKED_ARTIFACT_COMMAND = "linkDiagnostics.openLinkedArtifact";
export const VIEW_RIPPLE_DETAILS_COMMAND = "linkDiagnostics.viewRippleDetails";

interface LinkDiagnosticData {
  triggerUri?: string;
  dependentUri?: string;
  relationshipKind?: string;
  confidence?: number;
  depth?: number;
  path?: string[];
  changeEventId?: string;
  linkKind?: string;
  linkId?: string;
  recordId?: string;
  targetArtifactId?: string;
  triggerArtifactId?: string;
}

interface RippleDetailQuickPickItem extends vscode.QuickPickItem {
  target?: vscode.Uri;
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

  const provider = new LinkDiagnosticCodeActionProvider();

  const codeActions = vscode.languages.registerCodeActionsProvider(selector, provider, {
    providedCodeActionKinds: provider.providedCodeActionKinds
  });

  const openCommand = vscode.commands.registerCommand(
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

  const rippleDetailsCommand = vscode.commands.registerCommand(
    VIEW_RIPPLE_DETAILS_COMMAND,
    async (raw: unknown) => {
      if (!raw || typeof raw !== "object") {
        void vscode.window.showInformationMessage("Ripple metadata is unavailable for this diagnostic.");
        return;
      }

      const candidate = raw as LinkDiagnosticData;
      const summary = buildRippleSummary(candidate, formatUriForDisplay);
      const items = buildRippleQuickPickItems(candidate, formatUriForDisplay);

      if (items.length === 0) {
        void vscode.window.showInformationMessage(summary);
        return;
      }

      const selection = await vscode.window.showQuickPick(items, {
        placeHolder: summary,
        matchOnDescription: true,
        matchOnDetail: true
      });

      if (!selection?.target) {
        return;
      }

      try {
        const document = await vscode.workspace.openTextDocument(selection.target);
        await vscode.window.showTextDocument(document, { preview: false });
      } catch (error) {
        void vscode.window.showErrorMessage(
          `Failed to open ${selection.target.toString()}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  return vscode.Disposable.from(codeActions, openCommand, rippleDetailsCommand);
}

class LinkDiagnosticCodeActionProvider implements vscode.CodeActionProvider {
  readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

  provideCodeActions(
    _document: vscode.TextDocument,
    _range: vscode.Range,
    context: vscode.CodeActionContext
  ): vscode.CodeAction[] {
    const actions: vscode.CodeAction[] = [];

    for (const diagnostic of context.diagnostics) {
      if (!isSupportedDiagnostic(diagnostic)) {
        continue;
      }

      const data = getLinkDiagnosticData(diagnostic);
      if (!data?.triggerUri) {
        continue;
      }

      const openTitle = buildOpenActionTitle(data.relationshipKind ?? data.linkKind);
      const openAction = new vscode.CodeAction(openTitle, vscode.CodeActionKind.QuickFix);
      openAction.diagnostics = [diagnostic];
      openAction.isPreferred = true;
      openAction.command = {
        title: openTitle,
        command: OPEN_LINKED_ARTIFACT_COMMAND,
        arguments: [data.triggerUri]
      };
      actions.push(openAction);

      if (data.recordId) {
        const acknowledgeAction = new vscode.CodeAction(
          "Acknowledge diagnostic",
          vscode.CodeActionKind.QuickFix
        );
        acknowledgeAction.diagnostics = [diagnostic];
        acknowledgeAction.command = {
          title: "Acknowledge diagnostic",
          command: ACKNOWLEDGE_DIAGNOSTIC_COMMAND,
          arguments: [
            {
              diagnostic,
              data,
              uri: _document.uri
            }
          ]
        };
        actions.push(acknowledgeAction);
      }

      if (isCodeRippleDiagnostic(diagnostic)) {
        const detailAction = new vscode.CodeAction("View ripple details", vscode.CodeActionKind.QuickFix);
        detailAction.diagnostics = [diagnostic];
        detailAction.command = {
          title: "View ripple details",
          command: VIEW_RIPPLE_DETAILS_COMMAND,
          arguments: [data]
        };
        actions.push(detailAction);
      }
    }

    return actions;
  }
}

function isSupportedDiagnostic(diagnostic: vscode.Diagnostic): boolean {
  return isDocDriftDiagnostic(diagnostic) || isCodeRippleDiagnostic(diagnostic);
}

function isDocDriftDiagnostic(diagnostic: vscode.Diagnostic): boolean {
  return matchesCode(diagnostic, DOC_DRIFT_CODE);
}

function isCodeRippleDiagnostic(diagnostic: vscode.Diagnostic): boolean {
  return matchesCode(diagnostic, CODE_RIPPLE_CODE);
}

function matchesCode(diagnostic: vscode.Diagnostic, expected: string): boolean {
  if (typeof diagnostic.code === "string") {
    return diagnostic.code === expected;
  }

  if (
    diagnostic.code &&
    typeof diagnostic.code === "object" &&
    "value" in diagnostic.code &&
    typeof (diagnostic.code as { value: unknown }).value === "string"
  ) {
    return (diagnostic.code as { value: string }).value === expected;
  }

  return false;
}

function getLinkDiagnosticData(diagnostic: vscode.Diagnostic): LinkDiagnosticData | undefined {
  const candidate = diagnostic as vscode.Diagnostic & { data?: unknown };
  if (!candidate.data || typeof candidate.data !== "object") {
    return undefined;
  }

  const data = candidate.data as Record<string, unknown>;
  const triggerUri = typeof data.triggerUri === "string" ? data.triggerUri : undefined;
  const dependentUri = typeof data.dependentUri === "string"
    ? data.dependentUri
    : typeof data.targetUri === "string"
      ? data.targetUri
      : undefined;
  const relationshipKind = typeof data.relationshipKind === "string"
    ? data.relationshipKind
    : typeof data.linkKind === "string"
      ? data.linkKind
      : undefined;
  const confidence = parseNumericValue(data.confidence);
  const depth = parseNumericValue(data.depth);
  const changeEventId = typeof data.changeEventId === "string" ? data.changeEventId : undefined;
  const path = Array.isArray(data.path)
    ? (data.path.filter((segment): segment is string => typeof segment === "string" && segment.length > 0))
    : undefined;
  const linkId = typeof data.linkId === "string" ? data.linkId : undefined;
  const linkKind = typeof data.linkKind === "string" ? data.linkKind : undefined;
  const recordId = typeof data.recordId === "string" ? data.recordId : undefined;
  const targetArtifactId = typeof data.targetArtifactId === "string" ? data.targetArtifactId : undefined;
  const triggerArtifactId = typeof data.triggerArtifactId === "string" ? data.triggerArtifactId : undefined;

  if (!triggerUri) {
    return undefined;
  }

  return {
    triggerUri,
    dependentUri,
    relationshipKind,
    confidence,
    depth,
    path,
    changeEventId,
    linkKind,
    linkId,
    recordId,
    targetArtifactId,
    triggerArtifactId
  };
}

function parseNumericValue(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return undefined;
}

export function buildOpenActionTitle(kind: string | undefined): string {
  switch (kind) {
    case "documents":
      return "Open linked documentation";
    case "implements":
      return "Open linked implementation";
    case "depends_on":
      return "Open linked dependency";
    case "references":
      return "Open linked reference";
    case "includes":
      return "Open included file";
    default:
      return DEFAULT_ACTION_TITLE;
  }
}

export function buildRippleSummary(
  data: LinkDiagnosticData,
  format: (uri: string) => string
): string {
  const parts: string[] = [];

  if (data.relationshipKind) {
    parts.push(`relationship ${data.relationshipKind}`);
  }

  if (typeof data.depth === "number") {
    parts.push(`depth ${data.depth}`);
  }

  if (typeof data.confidence === "number") {
    parts.push(`confidence ${formatConfidenceLabel(data.confidence)}`);
  }

  if (Array.isArray(data.path) && data.path.length > 1) {
    const formattedPath = data.path
      .map((segment) => format(segment))
      .filter((segment) => segment.length > 0);
    if (formattedPath.length > 1) {
      parts.push(`path ${formattedPath.slice(0, -1).join(" → ")}`);
    }
  }

  return parts.length > 0 ? parts.join(" · ") : "No ripple metadata available";
}

export function formatConfidenceLabel(confidence: number): string {
  if (!Number.isFinite(confidence)) {
    return "unknown";
  }

  return `${Math.round(confidence * 100)}%`;
}

function buildRippleQuickPickItems(
  data: LinkDiagnosticData,
  format: (uri: string) => string
): RippleDetailQuickPickItem[] {
  const items: RippleDetailQuickPickItem[] = [];

  if (data.triggerUri) {
    const trigger = normaliseUri(data.triggerUri);
    if (trigger) {
      items.push({
        label: format(data.triggerUri),
        description: "Changed artifact",
        detail: "Open the file that triggered this ripple",
        target: trigger
      });
    }
  }

  if (Array.isArray(data.path)) {
    data.path.forEach((segment, index) => {
      const uri = normaliseUri(segment);
      if (!uri) {
        return;
      }

      const label = format(segment);
      const rank = index + 1;
      const isTerminal = index === data.path!.length - 1;
      items.push({
        label,
        description: isTerminal ? "Affected artifact" : `Intermediate hop ${rank}`,
        detail: isTerminal ? "Currently showing diagnostics here" : "Part of ripple chain",
        target: uri
      });
    });
  }

  if (data.dependentUri) {
    const dependent = normaliseUri(data.dependentUri);
    if (dependent) {
      items.push({
        label: format(data.dependentUri),
        description: "Dependent artifact",
        detail: "Open the file receiving this diagnostic",
        target: dependent
      });
    }
  }

  return dedupeQuickPickItems(items);
}

function dedupeQuickPickItems(items: RippleDetailQuickPickItem[]): RippleDetailQuickPickItem[] {
  const seen = new Set<string>();
  const results: RippleDetailQuickPickItem[] = [];

  for (const item of items) {
    const key = item.label;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    results.push(item);
  }

  return results;
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

function formatUriForDisplay(uri: string): string {
  try {
    const parsed = vscode.Uri.parse(uri);
    const relative = vscode.workspace.asRelativePath(parsed, false);
    return relative.length > 0 ? relative : parsed.fsPath || parsed.toString();
  } catch {
    return uri;
  }
}