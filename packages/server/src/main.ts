import * as path from "node:path";
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
  LinkInferenceOrchestrator,
  OVERRIDE_LINK_REQUEST,
  OverrideLinkRequest,
  OverrideLinkResponse,
  ACKNOWLEDGE_DIAGNOSTIC_REQUEST,
  type AcknowledgeDiagnosticParams,
  type AcknowledgeDiagnosticResult,
  DIAGNOSTIC_ACKNOWLEDGED_NOTIFICATION,
  type DiagnosticAcknowledgedPayload,
  type InspectDependenciesParams,
  type InspectDependenciesResult
} from "@copilot-improvement/shared";

import { ChangeQueue, QueuedChange } from "./features/changeEvents/changeQueue";
import { inspectDependencies } from "./features/dependencies/inspectDependencies";
import { HysteresisController } from "./features/diagnostics/hysteresisController";
import { AcknowledgementService } from "./features/diagnostics/acknowledgementService";
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
import { ArtifactWatcher } from "./features/watchers/artifactWatcher";
import { createChangeProcessor } from "./runtime/changeProcessor";
import { ensureDirectory, resolveDatabasePath, resolveWorkspaceRoot } from "./runtime/environment";
import { KnowledgeFeedController } from "./runtime/knowledgeFeeds";
import {
  extractExtensionSettings,
  extractTestModeOverrides,
  mergeExtensionSettings
} from "./runtime/settings";

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
const knowledgeFeedController = new KnowledgeFeedController({
  connection,
  now: () => new Date()
});
const hysteresisController = new HysteresisController();
let acknowledgementService: AcknowledgementService | null = null;

let changeQueue: ChangeQueue | null = null;
let runtimeSettings: RuntimeSettings = DEFAULT_RUNTIME_SETTINGS;
let artifactWatcher: ArtifactWatcher | null = null;
let workspaceRootPath: string | undefined;
let storageDirectory: string | null = null;

const changeProcessor = createChangeProcessor({
  connection,
  providerGuard,
  hysteresisController,
  initialContext: {
    graphStore: null,
    artifactWatcher: null,
    runtimeSettings,
    acknowledgements: null
  }
});
changeProcessor.updateContext({ runtimeSettings });

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
  storageDirectory = path.dirname(storageFile);
  ensureDirectory(storageDirectory);
  graphStore = new GraphStore({ dbPath: storageFile });

  runtimeSettings = deriveRuntimeSettings(providerGuard.getSettings());
  changeProcessor.updateContext({ runtimeSettings });

  acknowledgementService = new AcknowledgementService({
    graphStore,
    hysteresis: hysteresisController,
    runtimeSettings,
    logger: connection.console,
    now: () => new Date()
  });
  changeProcessor.updateContext({ acknowledgements: acknowledgementService });

  changeQueue?.dispose();
  changeQueue = new ChangeQueue({
    debounceMs: runtimeSettings.debounceMs,
    onFlush: changes => changeProcessor.process(changes)
  });

  artifactWatcher = new ArtifactWatcher({
    documents,
    graphStore,
    orchestrator: linkInferenceOrchestrator,
    logger: connection.console,
    now: () => new Date()
  });

  changeProcessor.updateContext({ graphStore, artifactWatcher });

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

  void knowledgeFeedController.initialize({
    graphStore,
    artifactWatcher,
    storageDirectory,
    workspaceRoot: workspaceRootPath
  });

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
  changeQueue?.dispose();
  changeQueue = null;

  void knowledgeFeedController.dispose();

  artifactWatcher = null;
  storageDirectory = null;

  if (graphStore) {
    graphStore.close();
    graphStore = null;
  }

  changeProcessor.updateContext({
    graphStore: null,
    artifactWatcher: null,
    acknowledgements: null
  });

  acknowledgementService = null;

  connection.console.info("link-aware-diagnostics server shutdown complete");
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

connection.onRequest(
  ACKNOWLEDGE_DIAGNOSTIC_REQUEST,
  (payload: AcknowledgeDiagnosticParams): AcknowledgeDiagnosticResult => {
    if (!acknowledgementService || !graphStore) {
      throw new Error("Acknowledgement service is not available");
    }

    const outcome = acknowledgementService.acknowledgeDiagnostic(payload);
    if (outcome.kind === "not_found") {
      return { status: "not_found" };
    }

    const record = outcome.record;
    const targetArtifact = graphStore.getArtifactById(record.artifactId ?? "");
    const triggerArtifact = graphStore.getArtifactById(record.triggerArtifactId ?? "");

    const notification: DiagnosticAcknowledgedPayload = {
      recordId: record.id,
      targetUri: targetArtifact?.uri,
      triggerUri: triggerArtifact?.uri
    };

    connection.sendNotification(DIAGNOSTIC_ACKNOWLEDGED_NOTIFICATION, notification);

    return {
      status: outcome.kind === "acknowledged" ? "acknowledged" : "already_acknowledged",
      acknowledgedAt: record.acknowledgedAt ?? record.createdAt,
      acknowledgedBy: record.acknowledgedBy,
      recordId: record.id,
      targetUri: targetArtifact?.uri,
      triggerUri: triggerArtifact?.uri
    } satisfies AcknowledgeDiagnosticResult;
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
    void changeProcessor.process([payload]);
  }
});

documents.listen(connection);
void connection.listen();

function syncRuntimeSettings(): void {
  runtimeSettings = deriveRuntimeSettings(providerGuard.getSettings());
  changeQueue?.updateDebounceWindow(runtimeSettings.debounceMs);
  changeProcessor.updateContext({ runtimeSettings });
  acknowledgementService?.updateRuntimeSettings(runtimeSettings);

  void knowledgeFeedController.initialize({
    graphStore,
    artifactWatcher,
    storageDirectory,
    workspaceRoot: workspaceRootPath
  });

  connection.console.info(
    `runtime settings updated (debounce=${runtimeSettings.debounceMs}ms, noise=${runtimeSettings.noiseSuppression.level})`
  );
}