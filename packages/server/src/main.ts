import * as fs from "fs";
import { createHash } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
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
  INSPECT_DEPENDENCIES_REQUEST,
  KnowledgeGraphBridge,
  LinkInferenceOrchestrator,
  OVERRIDE_LINK_REQUEST,
  OverrideLinkRequest,
  OverrideLinkResponse,
  type ArtifactLayer,
  type ExternalArtifact,
  type ExternalLink,
  type ExternalSnapshot,
  type InspectDependenciesParams,
  type InspectDependenciesResult,
  type LinkRelationshipKind
} from "@copilot-improvement/shared";

import { ChangeQueue, QueuedChange } from "./features/changeEvents/changeQueue";
import { saveCodeChange } from "./features/changeEvents/saveCodeChange";
import {
  persistInferenceResult,
  saveDocumentChange
} from "./features/changeEvents/saveDocumentChange";
import { inspectDependencies } from "./features/dependencies/inspectDependencies";
import { HysteresisController } from "./features/diagnostics/hysteresisController";
import {
  publishCodeDiagnostics,
  type CodeChangeContext
} from "./features/diagnostics/publishCodeDiagnostics";
import {
  publishDocDiagnostics,
  type DocumentChangeContext
} from "./features/diagnostics/publishDocDiagnostics";
import { FileFeedCheckpointStore } from "./features/knowledge/feedCheckpointStore";
import { FeedDiagnosticsGateway } from "./features/knowledge/feedDiagnosticsGateway";
import {
  KnowledgeFeedManager,
  type Disposable as KnowledgeFeedDisposable,
  type FeedConfiguration
} from "./features/knowledge/knowledgeFeedManager";
import { KnowledgeGraphIngestor } from "./features/knowledge/knowledgeGraphIngestor";
import { createSymbolBridgeProvider } from "./features/knowledge/symbolBridgeProvider";
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
let storageDirectory: string | null = null;
let knowledgeFeedManager: KnowledgeFeedManager | null = null;
let knowledgeFeedStatusDisposable: KnowledgeFeedDisposable | null = null;
let knowledgeGraphIngestor: KnowledgeGraphIngestor | null = null;

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
  storageDirectory = path.dirname(storageFile);
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

  const workspaceProviders = [];

  if (workspaceRootPath) {
    workspaceProviders.push(
      createWorkspaceIndexProvider({
        rootPath: workspaceRootPath,
        implementationGlobs: ["src"],
        logger: connection.console
      })
    );
  }

  workspaceProviders.push(
    createSymbolBridgeProvider({
      connection,
      logger: {
        info: message => connection.console.info(message),
        warn: message => connection.console.warn(message)
      },
      maxSeeds: 50
    })
  );

  artifactWatcher.setWorkspaceProviders(workspaceProviders);

  void initializeKnowledgeFeeds();

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
  void disposeKnowledgeFeeds();
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

connection.onRequest(
  INSPECT_DEPENDENCIES_REQUEST,
  (payload: InspectDependenciesParams): InspectDependenciesResult => {
    if (!graphStore) {
      throw new Error("Graph store is not initialised");
    }

    const result = inspectDependencies({
      graphStore,
      uri: payload.uri,
      maxDepth: payload.maxDepth,
      linkKinds: payload.linkKinds
    });

    connection.console.info(
      `inspected dependencies for ${payload.uri} -> ${result.summary.totalDependents} dependents (max depth ${result.summary.maxDepthReached})`
    );

    return result;
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

  for (const context of documentContexts) {
    const linked = graphStore.listLinkedArtifacts(context.artifact.id);
    if (linked.length === 0) {
      connection.console.info(
        `no links found for ${context.artifact.uri} (${context.artifact.id}); diagnostics will not emit`
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

function syncRuntimeSettings(): void {
  runtimeSettings = deriveRuntimeSettings(providerGuard.getSettings());
  changeQueue?.updateDebounceWindow(runtimeSettings.debounceMs);
  connection.console.info(
    `runtime settings updated (debounce=${runtimeSettings.debounceMs}ms, noise=${runtimeSettings.noiseSuppression.level})`
  );
}

async function initializeKnowledgeFeeds(): Promise<void> {
  if (!graphStore || !artifactWatcher) {
    connection.console.warn("knowledge feeds skipped: graph or watcher not initialised");
    return;
  }

  await disposeKnowledgeFeeds();

  if (!storageDirectory) {
    connection.console.warn("knowledge feeds skipped: storage directory unavailable");
    return;
  }

  try {
    const diagnostics = new FeedDiagnosticsGateway({
      logger: {
        info: message => connection.console.info(message),
        warn: message => connection.console.warn(message),
        error: message => connection.console.error(message)
      }
    });

    const checkpointDir = path.join(storageDirectory, "knowledge-feeds");
    ensureDirectory(checkpointDir);

    knowledgeGraphIngestor = new KnowledgeGraphIngestor({
      graphStore,
      bridge: new KnowledgeGraphBridge(graphStore),
      checkpoints: new FileFeedCheckpointStore(checkpointDir),
      diagnostics,
      logger: {
        info: message => connection.console.info(`[knowledge-ingestor] ${message}`),
        warn: message => connection.console.warn(`[knowledge-ingestor] ${message}`),
        error: message => connection.console.error(`[knowledge-ingestor] ${message}`)
      }
    });

    const feedConfigs = await loadKnowledgeFeedConfigurations();

    if (feedConfigs.length === 0) {
      connection.console.info("no knowledge feeds discovered; continuing with workspace providers only");
      artifactWatcher.setKnowledgeFeeds([]);
      return;
    }

    knowledgeFeedManager = new KnowledgeFeedManager({
      feeds: feedConfigs,
      ingestor: knowledgeGraphIngestor,
      diagnostics,
      logger: {
        info: message => connection.console.info(`[knowledge-feed] ${message}`),
        warn: message => connection.console.warn(`[knowledge-feed] ${message}`),
        error: message => connection.console.error(`[knowledge-feed] ${message}`)
      },
      backoff: {
        initialMs: 1_000,
        multiplier: 4,
        maxMs: 120_000
      }
    });

    knowledgeFeedStatusDisposable = knowledgeFeedManager.onStatusChanged(summary => {
      if (artifactWatcher && knowledgeFeedManager) {
        artifactWatcher.setKnowledgeFeeds(knowledgeFeedManager.getHealthyFeeds());
      }

      if (summary) {
        const detail = summary.message ? ` (${summary.message})` : "";
        connection.console.info(
          `[knowledge-feed] status changed: ${summary.feedId} -> ${summary.status}${detail}`
        );
      }
    });

    await knowledgeFeedManager.start();
    artifactWatcher.setKnowledgeFeeds(knowledgeFeedManager.getHealthyFeeds());
    connection.console.info(`initialised ${feedConfigs.length} knowledge feed(s)`);
  } catch (error) {
    connection.console.error(`knowledge feed initialisation failed: ${describeError(error)}`);
    await disposeKnowledgeFeeds();
  }
}

async function disposeKnowledgeFeeds(): Promise<void> {
  knowledgeFeedStatusDisposable?.dispose();
  knowledgeFeedStatusDisposable = null;

  if (knowledgeFeedManager) {
    try {
      await knowledgeFeedManager.stop();
    } catch (error) {
      connection.console.error(`failed to stop knowledge feed manager: ${describeError(error)}`);
    }
  }

  knowledgeFeedManager = null;
  knowledgeGraphIngestor = null;

  if (artifactWatcher) {
    artifactWatcher.setKnowledgeFeeds([]);
  }
}

async function loadKnowledgeFeedConfigurations(): Promise<FeedConfiguration[]> {
  const rootPath = workspaceRootPath;

  if (!rootPath) {
    connection.console.warn("knowledge feed discovery skipped: workspace root unavailable");
    return [];
  }

  const descriptors = await discoverStaticFeedDescriptors(rootPath);
  return descriptors.map(descriptor => createStaticFeedConfiguration(descriptor, rootPath));
}

interface StaticFeedDescriptor {
  id: string;
  label: string;
  filePath: string;
  metadata?: Record<string, unknown>;
}

interface StaticFeedArtifactConfig {
  id?: string;
  path?: string;
  uri?: string;
  layer?: ArtifactLayer;
  language?: string;
  owner?: string;
  metadata?: Record<string, unknown>;
}

interface StaticFeedLinkConfig {
  id?: string;
  sourceId?: string;
  sourcePath?: string;
  sourceUri?: string;
  targetId?: string;
  targetPath?: string;
  targetUri?: string;
  kind?: LinkRelationshipKind;
  confidence?: number;
  createdAt?: string;
  createdBy?: string;
  metadata?: Record<string, unknown>;
}

function isStaticFeedArtifactConfig(candidate: unknown): candidate is StaticFeedArtifactConfig {
  return isPlainObject(candidate);
}

function isStaticFeedLinkConfig(candidate: unknown): candidate is StaticFeedLinkConfig {
  return isPlainObject(candidate);
}

const ARTIFACT_LAYER_VALUES = new Set(["vision", "requirements", "architecture", "implementation", "code"]);
const LINK_KIND_VALUES = new Set(["documents", "implements", "depends_on", "references"]);

function isArtifactLayerValue(value: unknown): value is ArtifactLayer {
  return typeof value === "string" && ARTIFACT_LAYER_VALUES.has(value);
}

function isLinkRelationshipKindValue(value: unknown): value is LinkRelationshipKind {
  return typeof value === "string" && LINK_KIND_VALUES.has(value);
}

async function discoverStaticFeedDescriptors(workspaceRoot: string): Promise<StaticFeedDescriptor[]> {
  const staticFeedDir = path.join(workspaceRoot, "data", "knowledge-feeds");

  try {
    const stats = await fs.promises.stat(staticFeedDir);
    if (!stats.isDirectory()) {
      return [];
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      connection.console.error(
        `failed to inspect knowledge feed directory ${staticFeedDir}: ${describeError(error)}`
      );
    }
    return [];
  }

  const entries = await fs.promises.readdir(staticFeedDir, { withFileTypes: true });
  const descriptors: StaticFeedDescriptor[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) {
      continue;
    }

    const filePath = path.join(staticFeedDir, entry.name);

    try {
      const raw = await readStaticFeedFile(filePath);
      const id = typeof raw.id === "string" && raw.id.length > 0 ? raw.id : deriveFeedId(entry.name);
      const label = typeof raw.label === "string" && raw.label.length > 0 ? raw.label : id;
      const metadata = isPlainObject(raw.metadata) ? raw.metadata : undefined;

      descriptors.push({ id, label, filePath, metadata });
    } catch (error) {
      connection.console.error(`failed to parse knowledge feed ${entry.name}: ${describeError(error)}`);
    }
  }

  return descriptors;
}

function createStaticFeedConfiguration(
  descriptor: StaticFeedDescriptor,
  workspaceRoot: string
): FeedConfiguration {
  const relativeFile = path.relative(workspaceRoot, descriptor.filePath);
  const metadata = {
    ...(descriptor.metadata ?? {}),
    source: "static-json",
    file: relativeFile
  } satisfies Record<string, unknown>;

  return {
    id: descriptor.id,
    metadata,
    snapshot: {
      label: descriptor.label,
      load: async () => readStaticFeedSnapshot(descriptor, workspaceRoot)
    }
  } satisfies FeedConfiguration;
}

async function readStaticFeedSnapshot(
  descriptor: StaticFeedDescriptor,
  workspaceRoot: string
): Promise<ExternalSnapshot | null> {
  const raw = await readStaticFeedFile(descriptor.filePath);

  const artifactsConfig = Array.isArray(raw.artifacts)
    ? raw.artifacts.filter(isStaticFeedArtifactConfig)
    : [];
  const linksConfig = Array.isArray(raw.links) ? raw.links.filter(isStaticFeedLinkConfig) : [];

  const artifacts: ExternalArtifact[] = [];
  const artifactAliasMap = new Map<string, { uri: string; id?: string }>();

  for (const artifactConfig of artifactsConfig) {
    if (!artifactConfig) {
      continue;
    }

    if (!isArtifactLayerValue(artifactConfig.layer)) {
      throw new Error("artifact layer must be specified for knowledge feed snapshot");
    }
    const layer = artifactConfig.layer;
    const uri = resolveArtifactUri(workspaceRoot, artifactConfig);

    const artifactId = deriveStaticArtifactId(descriptor.id, artifactConfig.id, uri);

    const artifact: ExternalArtifact = {
      id: artifactId,
      uri,
      layer,
      language: typeof artifactConfig.language === "string" ? artifactConfig.language : undefined,
      owner: typeof artifactConfig.owner === "string" ? artifactConfig.owner : undefined,
      metadata: isPlainObject(artifactConfig.metadata) ? artifactConfig.metadata : undefined
    };

    artifacts.push(artifact);

    artifactAliasMap.set(uri, { uri, id: artifactId });
    artifactAliasMap.set(artifactId, { uri, id: artifactId });

    if (typeof artifactConfig.id === "string" && artifactConfig.id.length > 0) {
      artifactAliasMap.set(artifactConfig.id, { uri, id: artifactId });
    }

    if (typeof artifactConfig.path === "string" && artifactConfig.path.length > 0) {
      artifactAliasMap.set(normalisePathKey(artifactConfig.path), { uri, id: artifactId });
    }
  }

  const links: ExternalLink[] = [];

  for (const linkConfig of linksConfig) {
    if (!linkConfig) {
      continue;
    }

    if (!isLinkRelationshipKindValue(linkConfig.kind)) {
      throw new Error("link kind must be specified for knowledge feed snapshot");
    }
    const kind = linkConfig.kind;

    const sourceId = resolveLinkEndpoint(linkConfig.sourceId, linkConfig.sourcePath, linkConfig.sourceUri, artifactAliasMap, workspaceRoot);
    const targetId = resolveLinkEndpoint(linkConfig.targetId, linkConfig.targetPath, linkConfig.targetUri, artifactAliasMap, workspaceRoot);

    const link: ExternalLink = {
      id: typeof linkConfig.id === "string" ? linkConfig.id : undefined,
      sourceId,
      targetId,
      kind,
      confidence: typeof linkConfig.confidence === "number" ? linkConfig.confidence : undefined,
      createdAt: typeof linkConfig.createdAt === "string" ? linkConfig.createdAt : undefined,
      createdBy: typeof linkConfig.createdBy === "string" ? linkConfig.createdBy : undefined,
      metadata: isPlainObject(linkConfig.metadata) ? linkConfig.metadata : undefined
    };

    links.push(link);
  }

  const snapshotId = typeof raw.id === "string" && raw.id.length > 0 ? raw.id : descriptor.id;
  const createdAt = typeof raw.createdAt === "string" ? raw.createdAt : new Date().toISOString();

  const metadata = isPlainObject(raw.metadata) ? raw.metadata : undefined;

  return {
    id: snapshotId,
    label: descriptor.label,
    createdAt,
    artifacts,
    links,
    metadata
  } satisfies ExternalSnapshot;
}

async function readStaticFeedFile(filePath: string): Promise<Record<string, unknown>> {
  const contents = await fs.promises.readFile(filePath, "utf8");
  const parsed: unknown = JSON.parse(contents);
  if (!isPlainObject(parsed)) {
    throw new Error("knowledge feed configuration must be a JSON object");
  }
  return parsed;
}

function deriveFeedId(fileName: string): string {
  return fileName.replace(/\.json$/i, "");
}

function deriveStaticArtifactId(feedId: string, configuredId: string | undefined, uri: string): string {
  if (configuredId && configuredId.length > 0) {
    return configuredId;
  }

  const hash = createHash("sha1").update(`${feedId}:${uri}`).digest("hex").slice(0, 12);
  return `static-${feedId}-${hash}`;
}

function resolveArtifactUri(
  workspaceRoot: string,
  artifactConfig: StaticFeedArtifactConfig
): string {
  if (typeof artifactConfig.uri === "string" && artifactConfig.uri.length > 0) {
    return artifactConfig.uri;
  }

  if (typeof artifactConfig.path !== "string" || artifactConfig.path.length === 0) {
    throw new Error("artifact configuration must include either 'uri' or 'path'");
  }

  const candidatePath = path.isAbsolute(artifactConfig.path)
    ? artifactConfig.path
    : path.join(workspaceRoot, artifactConfig.path);

  if (!fs.existsSync(candidatePath)) {
    connection.console.warn(`knowledge feed artifact path missing: ${candidatePath}`);
  }

  return pathToFileURL(candidatePath).toString();
}

function resolveLinkEndpoint(
  id: string | undefined,
  pathCandidate: string | undefined,
  uriCandidate: string | undefined,
  aliasMap: Map<string, { uri: string; id?: string }>,
  workspaceRoot: string
): string {
  const aliases = [id, uriCandidate, pathCandidate].filter(
    (candidate): candidate is string => typeof candidate === "string" && candidate.length > 0
  );

  for (const alias of aliases) {
    const normalised = normalisePathKey(alias);
    const entry = aliasMap.get(normalised) ?? aliasMap.get(alias);
    if (entry) {
      return entry.id ?? entry.uri;
    }

    if (alias.startsWith("file://")) {
      return alias;
    }
  }

  if (pathCandidate) {
    const absolutePath = path.isAbsolute(pathCandidate)
      ? pathCandidate
      : path.join(workspaceRoot, pathCandidate);
    return pathToFileURL(absolutePath).toString();
  }

  if (uriCandidate) {
    return uriCandidate;
  }

  if (id) {
    return id;
  }

  throw new Error("link endpoint must specify an artifact reference");
}

function normalisePathKey(candidate: string): string {
  if (candidate.startsWith("file://")) {
    return candidate;
  }
  return path.normalize(candidate).replace(/\\/g, "/");
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  return String(error);
}
