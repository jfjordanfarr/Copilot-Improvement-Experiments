import type { Connection } from "vscode-languageserver/node";

import type { GraphStore, KnowledgeArtifact } from "@copilot-improvement/shared";

import { describeError } from "./environment";
import type { LlmIngestionManager } from "./llmIngestion";
import type { QueuedChange } from "../features/changeEvents/changeQueue";
import { saveCodeChange } from "../features/changeEvents/saveCodeChange";
import { persistInferenceResult, saveDocumentChange } from "../features/changeEvents/saveDocumentChange";
import type { AcknowledgementService } from "../features/diagnostics/acknowledgementService";
import type { DiagnosticSender } from "../features/diagnostics/diagnosticUtils";
import type { HysteresisController } from "../features/diagnostics/hysteresisController";
import { publishCodeDiagnostics, type CodeChangeContext } from "../features/diagnostics/publishCodeDiagnostics";
import { publishDocDiagnostics, type DocumentChangeContext } from "../features/diagnostics/publishDocDiagnostics";
import type { RippleImpact } from "../features/diagnostics/rippleTypes";
import { RippleAnalyzer } from "../features/knowledge/rippleAnalyzer";
import type { ProviderGuard } from "../features/settings/providerGuard";
import type { RuntimeSettings } from "../features/settings/settingsBridge";
import { normalizeFileUri } from "../features/utils/uri";
import {
  ArtifactWatcher,
  type CodeTrackedArtifactChange,
  type DocumentTrackedArtifactChange
} from "../features/watchers/artifactWatcher";

export interface ChangeProcessorContext {
  graphStore: GraphStore | null;
  artifactWatcher: ArtifactWatcher | null;
  runtimeSettings: RuntimeSettings;
  acknowledgements: AcknowledgementService | null;
  llmIngestionManager: LlmIngestionManager | null;
}

export interface ChangeProcessor {
  process(changes: QueuedChange[]): Promise<void>;
  updateContext(update: Partial<ChangeProcessorContext>): void;
}

export interface ChangeProcessorOptions {
  connection: Connection;
  providerGuard: ProviderGuard;
  hysteresisController: HysteresisController;
  initialContext: ChangeProcessorContext;
  llmIngestionManager?: LlmIngestionManager | null;
  diagnosticSender: DiagnosticSender;
}

export function createChangeProcessor({
  connection,
  providerGuard,
  hysteresisController,
  initialContext,
  llmIngestionManager = null,
  diagnosticSender
}: ChangeProcessorOptions): ChangeProcessor {
  const context: ChangeProcessorContext = {
    ...initialContext,
    llmIngestionManager: initialContext.llmIngestionManager ?? llmIngestionManager ?? null
  };

  function updateContext(update: Partial<ChangeProcessorContext>): void {
    Object.assign(context, update);
  }

  async function process(changes: QueuedChange[]): Promise<void> {
    const { graphStore, artifactWatcher, acknowledgements, llmIngestionManager: ingestionManager } = context;
    const runtimeSettings: RuntimeSettings = context.runtimeSettings;
    const rippleSettings: RuntimeSettings["ripple"] = runtimeSettings.ripple;

    if (!graphStore) {
      return;
    }

    if (!artifactWatcher) {
      connection.console.warn("artifact watcher not initialised; skipping change batch");
      return;
    }

    let watcherResult: Awaited<ReturnType<ArtifactWatcher["processChanges"]>> | null = null;

    try {
      watcherResult = await artifactWatcher.processChanges(changes);
      if (watcherResult.orchestratorError) {
        connection.console.error(
          `artifact watcher reported inference failure: ${describeError(watcherResult.orchestratorError)}`
        );
      }
    } catch (error) {
      connection.console.error(`artifact watcher processing threw: ${describeError(error)}`);
      return;
    }

    if (!watcherResult || watcherResult.processed.length === 0) {
      if (watcherResult?.skipped.length) {
        connection.console.info(
          `artifact watcher skipped ${watcherResult.skipped.length} change(s) due to missing content`
        );
      }
      return;
    }

    if (watcherResult.inference) {
      try {
        const linkSummary = watcherResult.inference.links.map(
          link => `${link.sourceId}->${link.targetId} [${link.kind}]`
        );
        connection.console.info(
          `inference produced ${watcherResult.inference.links.length} persisted link(s): ${linkSummary.join(",")}`
        );
        persistInferenceResult(graphStore, watcherResult.inference);
      } catch (error) {
        connection.console.error(`failed to persist inference results: ${describeError(error)}`);
      }
    }

    const nowFactory = () => new Date();
    const documentContexts: DocumentChangeContext[] = [];
    const codeContexts: CodeChangeContext[] = [];
  const llmQueue = new Map<string, string>();

    const processedDocuments = watcherResult.processed.filter(
      (change): change is DocumentTrackedArtifactChange => change.category === "document"
    );
    const processedCode = watcherResult.processed.filter(
      (change): change is CodeTrackedArtifactChange => change.category === "code"
    );

    type RippleKind = RuntimeSettings["ripple"]["allowedKinds"][number];

    const rippleAnalyzer = new RippleAnalyzer({
      graphStore,
      maxDepth: rippleSettings.maxDepth,
      maxResults: rippleSettings.maxResults,
      allowedKinds: rippleSettings.allowedKinds,
      logger: {
        info: message => connection.console.info(message),
        warn: message => connection.console.warn(message),
        error: message => connection.console.error(message)
      }
    });

    const resolveArtifactByUri = (uri: string): KnowledgeArtifact | null => {
      const canonical = normalizeFileUri(uri);
      return (
        graphStore.getArtifactByUri(canonical) ??
        graphStore.getArtifactByUri(uri) ??
        null
      );
    };

    const buildRippleImpacts = (
      source: KnowledgeArtifact,
      allowedKinds: ReadonlyArray<RippleKind>,
      predicate?: (target: KnowledgeArtifact) => boolean
    ): RippleImpact[] => {
      const hints = rippleAnalyzer.generateHintsForArtifact(source, {
        maxDepth: rippleSettings.maxDepth,
        maxResults: rippleSettings.maxResults,
        allowedKinds: Array.from(allowedKinds)
      });

      const seen = new Set<string>();
      const impacts: RippleImpact[] = [];

      for (const hint of hints) {
        const targetUri = hint.targetUri;
        if (!targetUri) {
          continue;
        }

        const target = resolveArtifactByUri(targetUri);
        if (!target) {
          continue;
        }

        const canonicalTarget: KnowledgeArtifact = {
          ...target,
          uri: normalizeFileUri(target.uri)
        };

        if (predicate && !predicate(canonicalTarget)) {
          continue;
        }

        const identifier = canonicalTarget.id ?? canonicalTarget.uri;
        if (seen.has(identifier)) {
          continue;
        }

        seen.add(identifier);
        impacts.push({ target: canonicalTarget, hint });
      }

      return impacts;
    };

    for (const processed of processedDocuments) {
      try {
        const persisted = saveDocumentChange({ graphStore, change: processed, now: nowFactory });
        const rippleImpacts = buildRippleImpacts(
          persisted.artifact,
          rippleSettings.documentKinds
        );
        // Instrumentation: log ripple targets for document-driven ripples to help debug multi-hop chains
        if (rippleImpacts.length > 0) {
          const details = rippleImpacts
            .slice(0, 10)
            .map(imp => `${normalizeFileUri(imp.target.uri)}[${imp.hint.kind} d=${imp.hint.depth}]`)
            .join(", ");
          connection.console.info(
            `ripple(debug) document ${normalizeFileUri(persisted.artifact.uri)} -> ${rippleImpacts.length} target(s): ${details}`
          );
        } else {
          connection.console.info(
            `ripple(debug) document ${normalizeFileUri(persisted.artifact.uri)} produced no ripple targets`
          );
        }
        documentContexts.push({
          change: processed,
          artifact: persisted.artifact,
          changeEventId: persisted.changeEventId,
          rippleImpacts
        });
        if (persisted.artifact.id) {
          llmQueue.set(persisted.artifact.id, "document-change");
        }
        connection.console.info(
          `document change persisted for ${persisted.artifact.uri}; ripple impacts=${rippleImpacts.length}`
        );
      } catch (error) {
        connection.console.error(
          `failed to persist document change for ${processed.uri}: ${describeError(error)}`
        );
      }
    }

    for (const processed of processedCode) {
      try {
        const persisted = saveCodeChange({ graphStore, change: processed, now: nowFactory });
        const rippleImpacts = buildRippleImpacts(
          persisted.artifact,
          rippleSettings.codeKinds,
          target => target.layer === "code"
        );
        codeContexts.push({
          change: processed,
          artifact: persisted.artifact,
          changeEventId: persisted.changeEventId,
          rippleImpacts
        });
        if (persisted.artifact.id) {
          llmQueue.set(persisted.artifact.id, "code-change");
        }
        connection.console.info(
          `code change persisted for ${persisted.artifact.uri}; ripple impacts=${rippleImpacts.length}`
        );
      } catch (error) {
        connection.console.error(
          `failed to persist code change for ${processed.uri}: ${describeError(error)}`
        );
      }
    }

    if (!providerGuard.areDiagnosticsEnabled()) {
      connection.console.info("diagnostics disabled via provider guard; skipping publication");
      return;
    }

    if (documentContexts.length === 0 && codeContexts.length === 0) {
      connection.console.info("no relevant contexts available for diagnostics publication");
      return;
    }

    const docDiagnosticsResult =
      documentContexts.length > 0
        ? publishDocDiagnostics({
            sender: diagnosticSender,
            contexts: documentContexts,
            runtimeSettings,
            hysteresis: hysteresisController,
            acknowledgements: acknowledgements ?? undefined
          })
        : null;

    if (docDiagnosticsResult?.suppressedByBudget) {
      connection.console.info(
        `noise suppression level '${runtimeSettings.noiseSuppression.level}' muted ${docDiagnosticsResult.suppressedByBudget} documentation diagnostic(s) in this batch`
      );
    }

    if (docDiagnosticsResult) {
      const { byConfidence, byDepth, byTargetLimit, byChangeLimit } = docDiagnosticsResult.noiseFilter;
      const suppressedByFilter = byConfidence + byDepth + byTargetLimit + byChangeLimit;
      if (suppressedByFilter > 0) {
        connection.console.info(
          `noise filter trimmed ${suppressedByFilter} documentation ripple(s) (confidence=${byConfidence}, depth=${byDepth}, perTarget=${byTargetLimit}, perChange=${byChangeLimit})`
        );
      }
    }

    if (docDiagnosticsResult?.suppressedByHysteresis) {
      connection.console.info(
        `hysteresis controller suppressed ${docDiagnosticsResult.suppressedByHysteresis} documentation diagnostic(s) to prevent ricochet`
      );
    }

    if (docDiagnosticsResult?.suppressedByAcknowledgement) {
      connection.console.info(
        `acknowledgement service suppressed ${docDiagnosticsResult.suppressedByAcknowledgement} documentation diagnostic(s)`
      );
    }

    if (documentContexts.length > 0) {
      connection.console.info(
        `published ${docDiagnosticsResult?.emitted ?? 0} documentation diagnostic(s) for ${documentContexts.length} document change(s)`
      );
    }

    const remainingBudget = Math.max(
      0,
      runtimeSettings.noiseSuppression.maxDiagnosticsPerBatch - (docDiagnosticsResult?.emitted ?? 0)
    );
    const codeRuntimeSettings: RuntimeSettings = {
      ...runtimeSettings,
      noiseSuppression: {
        ...runtimeSettings.noiseSuppression,
        maxDiagnosticsPerBatch: remainingBudget
      }
    };

    const codeDiagnosticsResult =
      codeContexts.length > 0
        ? publishCodeDiagnostics({
            sender: diagnosticSender,
            contexts: codeContexts,
            runtimeSettings: codeRuntimeSettings,
            hysteresis: hysteresisController,
            acknowledgements: acknowledgements ?? undefined
          })
        : null;

    if (codeDiagnosticsResult?.suppressedByBudget) {
      connection.console.info(
        `noise suppression level '${runtimeSettings.noiseSuppression.level}' muted ${codeDiagnosticsResult.suppressedByBudget} code diagnostic(s) in this batch`
      );
    }

    if (codeDiagnosticsResult) {
      const { byConfidence, byDepth, byTargetLimit, byChangeLimit } = codeDiagnosticsResult.noiseFilter;
      const suppressedByFilter = byConfidence + byDepth + byTargetLimit + byChangeLimit;
      if (suppressedByFilter > 0) {
        connection.console.info(
          `noise filter trimmed ${suppressedByFilter} code ripple(s) (confidence=${byConfidence}, depth=${byDepth}, perTarget=${byTargetLimit}, perChange=${byChangeLimit})`
        );
      }
    }

    if (codeDiagnosticsResult?.suppressedByHysteresis) {
      connection.console.info(
        `hysteresis controller suppressed ${codeDiagnosticsResult.suppressedByHysteresis} code diagnostic(s) to prevent ricochet`
      );
    }

    if (codeDiagnosticsResult?.suppressedByAcknowledgement) {
      connection.console.info(
        `acknowledgement service suppressed ${codeDiagnosticsResult.suppressedByAcknowledgement} code diagnostic(s)`
      );
    }

    if (codeDiagnosticsResult?.withoutDependents) {
      connection.console.info(
        `${codeDiagnosticsResult.withoutDependents} code change(s) had no dependents in graph`
      );
    }

    if (codeContexts.length > 0) {
      connection.console.info(
        `published ${codeDiagnosticsResult?.emitted ?? 0} code diagnostic(s) for ${codeContexts.length} code change(s)`
      );
    }

    if (watcherResult.skipped.length > 0) {
      connection.console.info(
        `artifact watcher skipped ${watcherResult.skipped.length} change(s) due to missing content`
      );
    }

    if (ingestionManager && llmQueue.size > 0) {
      for (const [artifactId, reason] of llmQueue.entries()) {
        ingestionManager.enqueue([artifactId], reason);
      }
    }
  }

  return {
    process,
    updateContext
  };
}
