import * as fs from "fs";
import { fileURLToPath } from "node:url";
import * as os from "os";
import * as path from "path";
import {
  Connection,
  DidChangeConfigurationNotification,
  DidChangeConfigurationParams,
  InitializeParams,
  InitializeResult,
  ProposedFeatures,
  TextDocumentChangeEvent,
  TextDocumentSyncKind,
  TextDocuments,
  TextDocumentsConfiguration,
  createConnection
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";

import {
  GraphStore,
  LinkInferenceOrchestrator,
  OVERRIDE_LINK_REQUEST,
  OverrideLinkRequest,
  OverrideLinkResponse
} from "@copilot-improvement/shared";

import { ChangeQueue, QueuedChange } from "./features/changeEvents/changeQueue";
import {
  persistInferenceResult,
  saveDocumentChange
} from "./features/changeEvents/saveDocumentChange";
import { HysteresisController } from "./features/diagnostics/hysteresisController";
import {
  publishDocDiagnostics,
  type DocumentChangeContext
} from "./features/diagnostics/publishDocDiagnostics";
import { createWorkspaceIndexProvider } from "./features/knowledge/workspaceIndexProvider";
import {
  handleArtifactDeleted,
  handleArtifactRenamed
} from "./features/maintenance/removeOrphans";
import { applyOverrideLink } from "./features/overrides/overrideLink";
import { ExtensionSettings, ProviderGuard } from "./features/settings/providerGuard";
import {
  DEFAULT_RUNTIME_SETTINGS,
  RuntimeSettings,
  deriveRuntimeSettings
} from "./features/settings/settingsBridge";
import {
  ArtifactWatcher,
  type DocumentTrackedArtifactChange,
  type CodeTrackedArtifactChange
} from "./features/watchers/artifactWatcher";

const SETTINGS_NOTIFICATION = "linkDiagnostics/settings/update";
const FILE_DELETED_NOTIFICATION = "linkDiagnostics/files/deleted";
const FILE_RENAMED_NOTIFICATION = "linkDiagnostics/files/renamed";

const connection: Connection = createConnection(ProposedFeatures.all);

const textDocumentConfig: TextDocumentsConfiguration<TextDocument> = {
  create: (uri, languageId, version, content): TextDocument =>
    TextDocument.create(uri, languageId, version, content),
  update: (document, changes, version): TextDocument =>
    TextDocument.update(document, changes, version)
};

const documents: TextDocuments<TextDocument> = new TextDocuments(textDocumentConfig);

const linkInferenceOrchestrator = new LinkInferenceOrchestrator();

let graphStore: GraphStore | null = null;
const providerGuard = new ProviderGuard(connection);
let changeQueue: ChangeQueue | null = null;
let runtimeSettings: RuntimeSettings = DEFAULT_RUNTIME_SETTINGS;
let artifactWatcher: ArtifactWatcher | null = null;
const hysteresisController = new HysteresisController();
let workspaceRootPath: string | undefined;

function extractExtensionSettings(source: unknown): ExtensionSettings | undefined {
  if (!isRecord(source)) {
    return undefined;
  }

  const sourceRecord = source;

  const base =
    "settings" in sourceRecord && isRecord(sourceRecord.settings)
      ? sourceRecord.settings
      : sourceRecord;

  if (!isRecord(base)) {
    return undefined;
  }

  const container =
    "linkAwareDiagnostics" in base && isRecord(base.linkAwareDiagnostics)
      ? base.linkAwareDiagnostics
      : base;

  if (!isRecord(container)) {
    return undefined;
  }

  const record = container;
  const settings: ExtensionSettings = {};

  if (typeof record.storagePath === "string") {
    settings.storagePath = record.storagePath;
  }

  if (typeof record.enableDiagnostics === "boolean") {
    settings.enableDiagnostics = record.enableDiagnostics;
  }

  if (typeof record.debounceMs === "number") {
    settings.debounceMs = record.debounceMs;
  }

  if (isLlmProviderMode(record.llmProviderMode)) {
    settings.llmProviderMode = record.llmProviderMode;
  }

  if (isRecord(record.noiseSuppression) && isNoiseSuppressionLevel(record.noiseSuppression.level)) {
    settings.noiseSuppression = { level: record.noiseSuppression.level };
  }

  return settings;
}

function extractTestModeOverrides(source: unknown): ExtensionSettings | undefined {
  if (!isRecord(source)) {
    return undefined;
  }

  const candidate = "testModeOverrides" in source ? source.testModeOverrides : undefined;
  if (!isRecord(candidate)) {
    return undefined;
  }

  const overrides: ExtensionSettings = {};

  if (typeof candidate.enableDiagnostics === "boolean") {
    overrides.enableDiagnostics = candidate.enableDiagnostics;
  }

  if (isLlmProviderMode(candidate.llmProviderMode)) {
    overrides.llmProviderMode = candidate.llmProviderMode;
  }

  return overrides;
}

function mergeExtensionSettings(
  base: ExtensionSettings | undefined,
  overrides: ExtensionSettings | undefined
): ExtensionSettings {
  return { ...(base ?? {}), ...(overrides ?? {}) };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isLlmProviderMode(
  value: unknown
): value is NonNullable<ExtensionSettings["llmProviderMode"]> {
  return value === "prompt" || value === "local-only" || value === "disabled";
}

function isNoiseSuppressionLevel(value: unknown): value is "low" | "medium" | "high" {
  return value === "low" || value === "medium" || value === "high";
}

connection.onInitialize((params: InitializeParams): InitializeResult => {
  connection.console.info("link-aware-diagnostics server starting up");

  const initialSettings = extractExtensionSettings(params.initializationOptions);
  const forcedSettings = mergeExtensionSettings(
    initialSettings,
    extractTestModeOverrides(params.initializationOptions)
  );
  providerGuard.apply(forcedSettings);
  workspaceRootPath = resolveWorkspaceRoot(params);

  const storageFile = resolveDatabasePath(params, providerGuard.getSettings());
  ensureDirectory(path.dirname(storageFile));
  graphStore = new GraphStore({ dbPath: storageFile });

  runtimeSettings = deriveRuntimeSettings(providerGuard.getSettings());

  changeQueue?.dispose();
  changeQueue = new ChangeQueue({
    debounceMs: runtimeSettings.debounceMs,
    onFlush: processChangeBatch
  });

  artifactWatcher = new ArtifactWatcher({
    documents,
    graphStore,
    orchestrator: linkInferenceOrchestrator,
    logger: connection.console,
    now: () => new Date()
  });

  if (workspaceRootPath) {
    artifactWatcher.setWorkspaceProviders([
      createWorkspaceIndexProvider({
        rootPath: workspaceRootPath,
        implementationGlobs: ["src"],
        logger: connection.console
      })
    ]);
  }

  connection.console.info(
    `runtime settings initialised (debounce=${runtimeSettings.debounceMs}ms, noise=${runtimeSettings.noiseSuppression.level})`
  );

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      diagnosticProvider: {
        interFileDependencies: true,
        workspaceDiagnostics: false
      }
    }
  };
});

connection.onInitialized(() => {
  connection.console.info("link-aware-diagnostics server initialised");
  void connection.client.register(DidChangeConfigurationNotification.type, undefined);
});

connection.onShutdown(() => {
  graphStore?.close();
  changeQueue?.dispose();
  changeQueue = null;
  artifactWatcher = null;
});

connection.onDidChangeConfiguration((change: DidChangeConfigurationParams) => {
  const settingsCandidate = extractExtensionSettings(change.settings);
  providerGuard.apply(settingsCandidate);
  syncRuntimeSettings();
  connection.console.info("settings updated");
});

connection.onNotification(SETTINGS_NOTIFICATION, (settings: ExtensionSettings) => {
  providerGuard.apply(settings);
  syncRuntimeSettings();
  connection.console.info("settings forwarded from client");
});

connection.onNotification(FILE_DELETED_NOTIFICATION, (payload: { uri: string }) => {
  connection.console.info(`received delete notification for ${payload.uri}`);
  if (!graphStore) {
    return;
  }

  handleArtifactDeleted(connection, graphStore, payload.uri);
});

connection.onNotification(
  FILE_RENAMED_NOTIFICATION,
  (payload: { oldUri: string; newUri: string }) => {
    connection.console.info(`received rename notification ${payload.oldUri} -> ${payload.newUri}`);
    if (!graphStore) {
      return;
    }

    handleArtifactRenamed(connection, graphStore, payload.oldUri, payload.newUri);
  }
);

connection.onRequest(
  OVERRIDE_LINK_REQUEST,
  (payload: OverrideLinkRequest): OverrideLinkResponse => {
    if (!graphStore) {
      throw new Error("Graph store is not initialised");
    }

    try {
      const result = applyOverrideLink(graphStore, payload);
      connection.console.info(
        `override link recorded for ${payload.source.uri} -> ${payload.target.uri}`
      );
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      connection.console.error(`failed to apply link override: ${message}`);
      throw error;
    }
  }
);

documents.onDidSave((event: TextDocumentChangeEvent<TextDocument>) => {
  const payload: QueuedChange = {
    uri: event.document.uri,
    languageId: event.document.languageId,
    version: event.document.version
  };

  if (changeQueue) {
    changeQueue.enqueue(payload);
  } else {
    void processChangeBatch([payload]);
  }
});

documents.listen(connection);
void connection.listen();

function resolveDatabasePath(params: InitializeParams, settings: ExtensionSettings): string {
  if (settings.storagePath) {
    return path.join(settings.storagePath, "link-aware-diagnostics.db");
  }

  const workspaceFolder = params.workspaceFolders?.[0]?.uri;
  if (workspaceFolder) {
    const folderPath = fileUriToPath(workspaceFolder);
    return path.join(folderPath, ".link-aware-diagnostics", "link-aware-diagnostics.db");
  }

  return path.join(os.tmpdir(), "link-aware-diagnostics", "link-aware-diagnostics.db");
}

function resolveWorkspaceRoot(params: InitializeParams): string | undefined {
  if (params.workspaceFolders?.length) {
    return fileUriToPath(params.workspaceFolders[0].uri);
  }

  if (typeof params.rootUri === "string") {
    return fileUriToPath(params.rootUri);
  }

  if (typeof params.rootPath === "string") {
    return path.resolve(params.rootPath);
  }

  return undefined;
}

function fileUriToPath(candidate: string): string {
  try {
    if (candidate.startsWith("file://")) {
      return fileURLToPath(candidate);
    }
  } catch {
    // fall through to path resolution
  }

  return path.resolve(candidate);
}

function ensureDirectory(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function processChangeBatch(changes: QueuedChange[]): Promise<void> {
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
      const linkSummary = watcherResult.inference.links.map(link => `${link.sourceId}->${link.targetId} [${link.kind}]`);
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

  if (!providerGuard.areDiagnosticsEnabled()) {
    connection.console.info("diagnostics disabled via provider guard; skipping publication");
    return;
  }

  if (documentContexts.length === 0 && processedCode.length === 0) {
    connection.console.info("no relevant contexts available for diagnostics publication");
    return;
  }

  if (documentContexts.length === 0) {
    connection.console.info("no document contexts available for diagnostics publication");
  }

  for (const context of documentContexts) {
    const linked = graphStore.listLinkedArtifacts(context.artifact.id);
    if (linked.length === 0) {
      connection.console.info(
        `no links found for ${context.artifact.uri} (${context.artifact.id}); diagnostics will not emit`
      );
    }
  }

  const diagnosticsResult = publishDocDiagnostics({
    sender: {
      sendDiagnostics: params => {
        void connection.sendDiagnostics(params);
      }
    },
    graphStore,
    contexts: documentContexts,
    runtimeSettings,
    hysteresis: hysteresisController
  });

  if (watcherResult.skipped.length > 0) {
    connection.console.info(
      `artifact watcher skipped ${watcherResult.skipped.length} change(s) due to missing content`
    );
  }

  if (diagnosticsResult.suppressedByBudget > 0) {
    connection.console.info(
      `noise suppression level '${runtimeSettings.noiseSuppression.level}' muted ${diagnosticsResult.suppressedByBudget} diagnostics in this batch`
    );
  }

  if (diagnosticsResult.suppressedByHysteresis > 0) {
    connection.console.info(
      `hysteresis controller suppressed ${diagnosticsResult.suppressedByHysteresis} diagnostic(s) to prevent ricochet`
    );
  }

  if (documentContexts.length > 0) {
    connection.console.info(
      `published ${diagnosticsResult.emitted} diagnostic(s) for ${documentContexts.length} document change(s)`
    );
  }
}

function syncRuntimeSettings(): void {
  runtimeSettings = deriveRuntimeSettings(providerGuard.getSettings());
  changeQueue?.updateDebounceWindow(runtimeSettings.debounceMs);
  connection.console.info(
    `runtime settings updated (debounce=${runtimeSettings.debounceMs}ms, noise=${runtimeSettings.noiseSuppression.level})`
  );
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  return String(error);
}
