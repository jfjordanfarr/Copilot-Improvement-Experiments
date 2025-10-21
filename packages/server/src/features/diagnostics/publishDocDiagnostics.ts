import {
  Diagnostic,
  DiagnosticSeverity
} from "vscode-languageserver/node";

import type { KnowledgeArtifact } from "@copilot-improvement/shared";

import { normaliseDisplayPath, type DiagnosticSender } from "./diagnosticUtils";
import type { HysteresisController } from "./hysteresisController";
import type { RippleImpact } from "./rippleTypes";
import type { RuntimeSettings } from "../settings/settingsBridge";
import type { DocumentTrackedArtifactChange } from "../watchers/artifactWatcher";

export interface DocumentChangeContext {
  change: DocumentTrackedArtifactChange;
  artifact: KnowledgeArtifact;
  changeEventId: string;
  rippleImpacts: RippleImpact[];
}

export interface PublishDocDiagnosticsOptions {
  sender: DiagnosticSender;
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
    if (context.rippleImpacts.length === 0) {
      continue;
    }

    for (const impact of context.rippleImpacts) {
      const targetUri = impact.target.uri ?? impact.hint.targetUri;
      if (!targetUri) {
        continue;
      }

      if (
        options.hysteresis?.shouldSuppress(
          context.artifact.uri,
          targetUri,
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

      const diagnostic = createDiagnostic(context.artifact, impact);
      const existing = diagnosticsByUri.get(targetUri) ?? [];
      existing.push(diagnostic);
      diagnosticsByUri.set(targetUri, existing);
      emitted += 1;
      remaining -= 1;

      options.hysteresis?.recordEmission(
        context.artifact.uri,
        targetUri,
        context.changeEventId
      );
    }
  }

  for (const [uri, diagnostics] of diagnosticsByUri.entries()) {
    options.sender.sendDiagnostics({ uri, diagnostics });
  }

  return { emitted, suppressedByBudget, suppressedByHysteresis };
}

function createDiagnostic(sourceArtifact: KnowledgeArtifact, impact: RippleImpact): Diagnostic {
  const docPath = normaliseDisplayPath(sourceArtifact.uri);
  const targetPath = normaliseDisplayPath(impact.target.uri ?? impact.hint.targetUri ?? "");
  const relationshipLabel = impact.hint.kind ? ` (${impact.hint.kind})` : "";
  const depth = impact.hint.depth ?? 1;
  const depthLabel = depth > 1 ? ` (depth ${depth})` : "";
  const rationale = impact.hint.rationale ? ` ${impact.hint.rationale}` : "";

  return {
    severity: DiagnosticSeverity.Information,
    range: {
      start: { line: 0, character: 0 },
      end: { line: 0, character: 1 }
    },
    message: `linked documentation changed${relationshipLabel}: ${docPath} -> ${targetPath}${depthLabel}.${rationale}`.trim(),
    source: "link-aware-diagnostics",
    code: "doc-drift",
    data: {
      triggerUri: sourceArtifact.uri,
      targetUri: impact.target.uri ?? impact.hint.targetUri,
      relationshipKind: impact.hint.kind,
      confidence: impact.hint.confidence,
      depth,
      path: impact.hint.path
    }
  };
}

