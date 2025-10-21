import type { Connection } from "vscode-languageserver/node";

import type { GraphStore } from "@copilot-improvement/shared";

import { describeError } from "./environment";
import type { QueuedChange } from "../features/changeEvents/changeQueue";
import { saveCodeChange } from "../features/changeEvents/saveCodeChange";
import { persistInferenceResult, saveDocumentChange } from "../features/changeEvents/saveDocumentChange";
import type { HysteresisController } from "../features/diagnostics/hysteresisController";
import { publishCodeDiagnostics, type CodeChangeContext } from "../features/diagnostics/publishCodeDiagnostics";
import { publishDocDiagnostics, type DocumentChangeContext } from "../features/diagnostics/publishDocDiagnostics";
import type { ProviderGuard } from "../features/settings/providerGuard";
import type { RuntimeSettings } from "../features/settings/settingsBridge";
import {
  ArtifactWatcher,
  type CodeTrackedArtifactChange,
  type DocumentTrackedArtifactChange
} from "../features/watchers/artifactWatcher";

export interface ChangeProcessorContext {
  graphStore: GraphStore | null;
  artifactWatcher: ArtifactWatcher | null;
  runtimeSettings: RuntimeSettings;
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
}

export function createChangeProcessor({
  connection,
  providerGuard,
  hysteresisController,
  initialContext
}: ChangeProcessorOptions): ChangeProcessor {
  const context: ChangeProcessorContext = { ...initialContext };

  function updateContext(update: Partial<ChangeProcessorContext>): void {
    Object.assign(context, update);
  }

  async function process(changes: QueuedChange[]): Promise<void> {
    const { graphStore, artifactWatcher, runtimeSettings } = context;

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
    const processedDocuments = watcherResult.processed.filter(
      (change): change is DocumentTrackedArtifactChange => change.category === "document"
    );
    const processedCode = watcherResult.processed.filter(
      (change): change is CodeTrackedArtifactChange => change.category === "code"
    );

    for (const processed of processedDocuments) {
      try {
        const persisted = saveDocumentChange({ graphStore, change: processed, now: nowFactory });
        documentContexts.push({
          change: processed,
          artifact: persisted.artifact,
          changeEventId: persisted.changeEventId
        });
      } catch (error) {
        connection.console.error(
          `failed to persist document change for ${processed.uri}: ${describeError(error)}`
        );
      }
    }

    for (const processed of processedCode) {
      try {
        const persisted = saveCodeChange({ graphStore, change: processed, now: nowFactory });
        codeContexts.push({
          change: processed,
          artifact: persisted.artifact,
          changeEventId: persisted.changeEventId
        });
        const linked = graphStore.listLinkedArtifacts(persisted.artifact.id);
        connection.console.info(
          `code change persisted for ${persisted.artifact.uri} (${persisted.artifact.id}); dependents: ${linked
            .filter(link => link.direction === "incoming")
            .map(link => `${link.artifact.uri}[${link.kind}]`)
            .join(",")}`
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

    for (const contextItem of documentContexts) {
      const linked = graphStore.listLinkedArtifacts(contextItem.artifact.id);
      if (linked.length === 0) {
        connection.console.info(
          `no links found for ${contextItem.artifact.uri} (${contextItem.artifact.id}); diagnostics will not emit`
        );
      }
    }

    if (documentContexts.length === 0) {
      connection.console.info("no document contexts available for diagnostics publication");
    }

    const docDiagnosticsResult =
      documentContexts.length > 0
        ? publishDocDiagnostics({
            sender: {
              sendDiagnostics: params => {
                void connection.sendDiagnostics(params);
              }
            },
            graphStore,
            contexts: documentContexts,
            runtimeSettings,
            hysteresis: hysteresisController
          })
        : null;

    if (docDiagnosticsResult?.suppressedByBudget) {
      connection.console.info(
        `noise suppression level '${runtimeSettings.noiseSuppression.level}' muted ${docDiagnosticsResult.suppressedByBudget} documentation diagnostic(s) in this batch`
      );
    }

    if (docDiagnosticsResult?.suppressedByHysteresis) {
      connection.console.info(
        `hysteresis controller suppressed ${docDiagnosticsResult.suppressedByHysteresis} documentation diagnostic(s) to prevent ricochet`
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
            sender: {
              sendDiagnostics: params => {
                void connection.sendDiagnostics(params);
              }
            },
            graphStore,
            contexts: codeContexts,
            runtimeSettings: codeRuntimeSettings,
            hysteresis: hysteresisController,
            linkKinds: ["depends_on"]
          })
        : null;

    if (codeDiagnosticsResult?.suppressedByBudget) {
      connection.console.info(
        `noise suppression level '${runtimeSettings.noiseSuppression.level}' muted ${codeDiagnosticsResult.suppressedByBudget} code diagnostic(s) in this batch`
      );
    }

    if (codeDiagnosticsResult?.suppressedByHysteresis) {
      connection.console.info(
        `hysteresis controller suppressed ${codeDiagnosticsResult.suppressedByHysteresis} code diagnostic(s) to prevent ricochet`
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
  }

  return {
    process,
    updateContext
  };
}
