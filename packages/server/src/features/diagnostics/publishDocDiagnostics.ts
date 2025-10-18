import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  Diagnostic,
  DiagnosticSeverity
} from "vscode-languageserver/node";

import {
  GraphStore,
  KnowledgeArtifact,
  LinkedArtifactSummary
} from "@copilot-improvement/shared";

import type { RuntimeSettings } from "../settings/settingsBridge";
import type { MarkdownDocumentChange } from "../watchers/markdownWatcher";

export interface DiagnosticSender {
  sendDiagnostics(params: { uri: string; diagnostics: Diagnostic[] }): void;
}

export interface DocumentChangeContext {
  change: MarkdownDocumentChange;
  artifact: KnowledgeArtifact;
}

export interface PublishDocDiagnosticsOptions {
  sender: DiagnosticSender;
  graphStore: GraphStore;
  contexts: DocumentChangeContext[];
  runtimeSettings: RuntimeSettings;
}

export interface PublishDocDiagnosticsResult {
  emitted: number;
  suppressed: number;
}

export function publishDocDiagnostics(
  options: PublishDocDiagnosticsOptions
): PublishDocDiagnosticsResult {
  if (options.contexts.length === 0) {
    return { emitted: 0, suppressed: 0 };
  }

  const diagnosticsByUri = new Map<string, Diagnostic[]>();
  let emitted = 0;
  let suppressed = 0;
  let remaining = options.runtimeSettings.noiseSuppression.maxDiagnosticsPerBatch;

  for (const context of options.contexts) {
    const linked = options.graphStore
      .listLinkedArtifacts(context.artifact.id)
      .filter(link => link.direction === "outgoing");

    for (const link of linked) {
      if (!link.artifact.uri) {
        continue;
      }

      if (remaining <= 0) {
        suppressed += 1;
        continue;
      }

      const diagnostic = createDiagnostic(context.artifact, link);
      const existing = diagnosticsByUri.get(link.artifact.uri) ?? [];
      existing.push(diagnostic);
      diagnosticsByUri.set(link.artifact.uri, existing);
      emitted += 1;
      remaining -= 1;
    }
  }

  for (const [uri, diagnostics] of diagnosticsByUri.entries()) {
    options.sender.sendDiagnostics({ uri, diagnostics });
  }

  return { emitted, suppressed };
}

function createDiagnostic(
  sourceArtifact: KnowledgeArtifact,
  link: LinkedArtifactSummary
): Diagnostic {
  const docPath = normaliseDisplayPath(sourceArtifact.uri);

  return {
    severity: DiagnosticSeverity.Warning,
    range: {
      start: { line: 0, character: 0 },
      end: { line: 0, character: 1 }
    },
    message: `Documentation change detected in ${docPath}. Review linked guidance for alignment.`,
    source: "link-aware-diagnostics",
    code: "doc-drift",
    data: {
      triggerUri: sourceArtifact.uri,
      linkId: link.linkId,
      linkKind: link.kind
    }
  };
}

function normaliseDisplayPath(uri: string): string {
  if (!uri.startsWith("file://")) {
    return uri;
  }

  try {
    return path.normalize(fileURLToPath(uri));
  } catch {
    return uri;
  }
}
