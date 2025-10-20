import {
  Diagnostic,
  DiagnosticSeverity
} from "vscode-languageserver/node";

import {
  GraphStore,
  KnowledgeArtifact,
  LinkRelationshipKind
} from "@copilot-improvement/shared";

import { normaliseDisplayPath, type DiagnosticSender } from "./diagnosticUtils";
import { HysteresisController } from "./hysteresisController";
import { buildCodeImpactGraph, type CodeImpactEdge } from "../dependencies/buildCodeGraph";
import type { RuntimeSettings } from "../settings/settingsBridge";
import type { CodeTrackedArtifactChange } from "../watchers/artifactWatcher";

export interface CodeChangeContext {
  change: CodeTrackedArtifactChange;
  artifact: KnowledgeArtifact;
  changeEventId: string;
}

export interface PublishCodeDiagnosticsOptions {
  sender: DiagnosticSender;
  graphStore: GraphStore;
  contexts: CodeChangeContext[];
  runtimeSettings: RuntimeSettings;
  hysteresis?: HysteresisController;
  maxDepth?: number;
  linkKinds?: LinkRelationshipKind[];
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

  const impactEdges = buildCodeImpactGraph(
    options.graphStore,
    options.contexts.map((context) => context.artifact),
    {
      maxDepth: options.maxDepth,
      linkKinds: options.linkKinds
    }
  );

  const dependentsByTrigger = new Map<string, CodeImpactEdge[]>();
  for (const edge of impactEdges) {
    if (!dependentsByTrigger.has(edge.trigger.id)) {
      dependentsByTrigger.set(edge.trigger.id, []);
    }
    dependentsByTrigger.get(edge.trigger.id)!.push(edge);
  }

  const diagnosticsByUri = new Map<string, Diagnostic[]>();
  const budget = options.runtimeSettings.noiseSuppression.maxDiagnosticsPerBatch;
  let remaining = budget;
  let emitted = 0;
  let suppressedByBudget = 0;
  let suppressedByHysteresis = 0;
  let withoutDependents = 0;

  for (const context of options.contexts) {
    const edges = dependentsByTrigger.get(context.artifact.id);
    if (!edges || edges.length === 0) {
      withoutDependents += 1;
      continue;
    }

    for (const edge of edges) {
      if (remaining <= 0) {
        suppressedByBudget += 1;
        continue;
      }

      if (
        options.hysteresis?.shouldSuppress(
          context.artifact.uri,
          edge.dependent.uri,
          options.runtimeSettings.noiseSuppression.hysteresisMs
        )
      ) {
        suppressedByHysteresis += 1;
        continue;
      }

      const diagnostic = createDiagnostic(context, edge);
      const existing = diagnosticsByUri.get(edge.dependent.uri) ?? [];
      existing.push(diagnostic);
      diagnosticsByUri.set(edge.dependent.uri, existing);
      emitted += 1;
      remaining -= 1;

      options.hysteresis?.recordEmission(context.artifact.uri, edge.dependent.uri, context.changeEventId);
    }
  }

  for (const [uri, diagnostics] of diagnosticsByUri.entries()) {
    options.sender.sendDiagnostics({ uri, diagnostics });
  }

  return { emitted, suppressedByBudget, suppressedByHysteresis, withoutDependents };
}

function createDiagnostic(context: CodeChangeContext, edge: CodeImpactEdge): Diagnostic {
  const triggerPath = normaliseDisplayPath(context.artifact.uri);
  const dependentPath = normaliseDisplayPath(edge.dependent.uri);
  const depthLabel = edge.depth > 1 ? ` (depth ${edge.depth}${describeIntermediatePath(edge.path, dependentPath)})` : "";

  return {
    severity: DiagnosticSeverity.Warning,
    range: ZERO_RANGE,
    message: `linked dependency changed in ${triggerPath}. Review ${dependentPath} for compatibility.${depthLabel}`,
    source: "link-aware-diagnostics",
    code: DIAGNOSTIC_CODE,
    data: {
      triggerUri: context.artifact.uri,
      dependentUri: edge.dependent.uri,
      linkId: edge.viaLinkId,
      linkKind: edge.viaKind,
      depth: edge.depth,
      path: edge.path.map((artifact) => artifact.uri),
      changeEventId: context.changeEventId
    }
  };
}

function describeIntermediatePath(path: KnowledgeArtifact[], dependentPath: string): string {
  if (path.length <= 1) {
    return "";
  }

  const segments = path
    .slice(0, path.length - 1)
    .map((artifact) => normaliseDisplayPath(artifact.uri))
    .filter((segment) => segment !== dependentPath);

  if (segments.length === 0) {
    return "";
  }

  return ` via ${segments.join(" -> ")}`;
}
