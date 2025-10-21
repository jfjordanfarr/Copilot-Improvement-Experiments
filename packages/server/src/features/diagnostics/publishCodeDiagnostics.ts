import {
  Diagnostic,
  DiagnosticSeverity
} from "vscode-languageserver/node";

import type { KnowledgeArtifact } from "@copilot-improvement/shared";

import { normaliseDisplayPath, type DiagnosticSender } from "./diagnosticUtils";
import type { HysteresisController } from "./hysteresisController";
import type { RippleImpact } from "./rippleTypes";
import type { RuntimeSettings } from "../settings/settingsBridge";
import type { CodeTrackedArtifactChange } from "../watchers/artifactWatcher";

export interface CodeChangeContext {
  change: CodeTrackedArtifactChange;
  artifact: KnowledgeArtifact;
  changeEventId: string;
  rippleImpacts: RippleImpact[];
}

export interface PublishCodeDiagnosticsOptions {
  sender: DiagnosticSender;
  contexts: CodeChangeContext[];
  runtimeSettings: RuntimeSettings;
  hysteresis?: HysteresisController;
}

export interface PublishCodeDiagnosticsResult {
  emitted: number;
  suppressedByBudget: number;
  suppressedByHysteresis: number;
  withoutDependents: number;
}

const DIAGNOSTIC_CODE = "code-ripple";
const ZERO_RANGE = {
  start: { line: 0, character: 0 },
  end: { line: 0, character: 1 }
};

export function publishCodeDiagnostics(
  options: PublishCodeDiagnosticsOptions
): PublishCodeDiagnosticsResult {
  if (options.contexts.length === 0) {
    return { emitted: 0, suppressedByBudget: 0, suppressedByHysteresis: 0, withoutDependents: 0 };
  }

  const diagnosticsByUri = new Map<string, Diagnostic[]>();
  const budget = options.runtimeSettings.noiseSuppression.maxDiagnosticsPerBatch;
  let remaining = budget;
  let emitted = 0;
  let suppressedByBudget = 0;
  let suppressedByHysteresis = 0;
  let withoutDependents = 0;

  for (const context of options.contexts) {
    if (context.rippleImpacts.length === 0) {
      withoutDependents += 1;
      continue;
    }

    for (const impact of context.rippleImpacts) {
      const dependentUri = impact.target.uri ?? impact.hint.targetUri;
      if (!dependentUri) {
        continue;
      }

      if (remaining <= 0) {
        suppressedByBudget += 1;
        continue;
      }

      if (
        options.hysteresis?.shouldSuppress(
          context.artifact.uri,
          dependentUri,
          options.runtimeSettings.noiseSuppression.hysteresisMs
        )
      ) {
        suppressedByHysteresis += 1;
        continue;
      }

      const diagnostic = createDiagnostic(context, impact);
      const existing = diagnosticsByUri.get(dependentUri) ?? [];
      existing.push(diagnostic);
      diagnosticsByUri.set(dependentUri, existing);
      emitted += 1;
      remaining -= 1;

      options.hysteresis?.recordEmission(context.artifact.uri, dependentUri, context.changeEventId);
    }
  }

  for (const [uri, diagnostics] of diagnosticsByUri.entries()) {
    options.sender.sendDiagnostics({ uri, diagnostics });
  }

  return { emitted, suppressedByBudget, suppressedByHysteresis, withoutDependents };
}

function createDiagnostic(context: CodeChangeContext, impact: RippleImpact): Diagnostic {
  const triggerPath = normaliseDisplayPath(context.artifact.uri);
  const dependentPath = normaliseDisplayPath(impact.target.uri ?? impact.hint.targetUri ?? "");
  const depth = impact.hint.depth ?? 1;
  const depthLabel = depth > 1 ? ` (depth ${depth}${describeIntermediatePath(impact.hint.path, dependentPath)})` : "";
  const relationshipLabel = impact.hint.kind ? ` (${impact.hint.kind})` : "";
  const rationale = impact.hint.rationale ? ` ${impact.hint.rationale}` : "";

  return {
    severity: DiagnosticSeverity.Warning,
    range: ZERO_RANGE,
    message: `linked dependency${relationshipLabel} changed in ${triggerPath}. Review ${dependentPath} for compatibility.${depthLabel}${rationale}`.trim(),
    source: "link-aware-diagnostics",
    code: DIAGNOSTIC_CODE,
    data: {
      triggerUri: context.artifact.uri,
      dependentUri: impact.target.uri ?? impact.hint.targetUri,
      relationshipKind: impact.hint.kind,
      confidence: impact.hint.confidence,
      depth,
      path: impact.hint.path,
      changeEventId: context.changeEventId
    }
  };
}

function describeIntermediatePath(path: string[] | undefined, dependentPath: string): string {
  if (!path || path.length <= 1) {
    return "";
  }

  const segments = path
    .slice(0, path.length - 1)
    .map((uri) => normaliseDisplayPath(uri))
    .filter((segment) => segment !== dependentPath);

  if (segments.length === 0) {
    return "";
  }

  return ` via ${segments.join(" -> ")}`;
}
