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

import type { HysteresisController } from "./hysteresisController";
import type { RuntimeSettings } from "../settings/settingsBridge";
import type { MarkdownDocumentChange } from "../watchers/markdownWatcher";

export interface DiagnosticSender {
  sendDiagnostics(params: { uri: string; diagnostics: Diagnostic[] }): void;
}

export interface DocumentChangeContext {
  change: MarkdownDocumentChange;
  artifact: KnowledgeArtifact;
  changeEventId: string;
}

export interface PublishDocDiagnosticsOptions {
  sender: DiagnosticSender;
  graphStore: GraphStore;
  contexts: DocumentChangeContext[];
  runtimeSettings: RuntimeSettings;
  hysteresis?: HysteresisController;
}

export interface PublishDocDiagnosticsResult {
  emitted: number;
  suppressedByBudget: number;
  suppressedByHysteresis: number;
}

export function publishDocDiagnostics(
  options: PublishDocDiagnosticsOptions
): PublishDocDiagnosticsResult {
  if (options.contexts.length === 0) {
    return { emitted: 0, suppressedByBudget: 0, suppressedByHysteresis: 0 };
  }

  const diagnosticsByUri = new Map<string, Diagnostic[]>();
  let emitted = 0;
  let suppressedByBudget = 0;
  let suppressedByHysteresis = 0;
  let remaining = options.runtimeSettings.noiseSuppression.maxDiagnosticsPerBatch;
  const hysteresisWindow = options.runtimeSettings.noiseSuppression.hysteresisMs;
  for (const context of options.contexts) {
    const linked = options.graphStore.listLinkedArtifacts(context.artifact.id);

    for (const link of linked) {
      if (!link.artifact.uri) {
        continue;
      }

      if (
        options.hysteresis?.shouldSuppress(
          context.artifact.uri,
          link.artifact.uri,
          hysteresisWindow
        )
      ) {
        suppressedByHysteresis += 1;
        continue;
      }

      if (remaining <= 0) {
        suppressedByBudget += 1;
        continue;
      }

      const diagnostic = createDiagnostic(context.artifact, link);
      const existing = diagnosticsByUri.get(link.artifact.uri) ?? [];
      existing.push(diagnostic);
      diagnosticsByUri.set(link.artifact.uri, existing);
      emitted += 1;
      remaining -= 1;

      options.hysteresis?.recordEmission(
        context.artifact.uri,
        link.artifact.uri,
        context.changeEventId
      );
    }
  }

  for (const [uri, diagnostics] of diagnosticsByUri.entries()) {
    options.sender.sendDiagnostics({ uri, diagnostics });
  }

  return { emitted, suppressedByBudget, suppressedByHysteresis };
}

function createDiagnostic(
  sourceArtifact: KnowledgeArtifact,
  link: LinkedArtifactSummary
): Diagnostic {
  const docPath = normaliseDisplayPath(sourceArtifact.uri);

  return {
    severity: DiagnosticSeverity.Information,
    range: {
      start: { line: 0, character: 0 },
      end: { line: 0, character: 1 }
    },
    message: `linked documentation changed in ${docPath}. Review linked guidance for alignment.`,
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
