import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import {
  Connection,
  Diagnostic,
  DiagnosticSeverity,
  DidChangeConfigurationNotification,
  DidChangeConfigurationParams,
  InitializeParams,
  InitializeResult,
  ProposedFeatures,
  TextDocumentChangeEvent,
  TextDocumentSyncKind,
  TextDocuments,
  createConnection
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  GraphStore,
  OVERRIDE_LINK_REQUEST,
  OverrideLinkRequest,
  OverrideLinkResponse
} from "@copilot-improvement/shared";
import { v4 as uuid } from "uuid";
import { ExtensionSettings, ProviderGuard } from "./features/settings/providerGuard";
import {
  handleArtifactDeleted,
  handleArtifactRenamed
} from "./features/maintenance/removeOrphans";
import { ChangeQueue, QueuedChange } from "./features/changeEvents/changeQueue";
import {
  DEFAULT_RUNTIME_SETTINGS,
  RuntimeSettings,
  deriveRuntimeSettings
} from "./features/settings/settingsBridge";
import { applyOverrideLink } from "./features/overrides/overrideLink";

const SETTINGS_NOTIFICATION = "linkDiagnostics/settings/update";
const FILE_DELETED_NOTIFICATION = "linkDiagnostics/files/deleted";
const FILE_RENAMED_NOTIFICATION = "linkDiagnostics/files/renamed";

const connection: Connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let graphStore: GraphStore | null = null;
const providerGuard = new ProviderGuard(connection);
let changeQueue: ChangeQueue | null = null;
let runtimeSettings: RuntimeSettings = DEFAULT_RUNTIME_SETTINGS;

connection.onInitialize((params: InitializeParams): InitializeResult => {
  connection.console.info("link-aware-diagnostics server starting up");

  providerGuard.apply(params.initializationOptions?.settings as ExtensionSettings | undefined);

  const storageFile = resolveDatabasePath(params, providerGuard.getSettings());
  ensureDirectory(path.dirname(storageFile));
  graphStore = new GraphStore({ dbPath: storageFile });

  runtimeSettings = deriveRuntimeSettings(providerGuard.getSettings());

  changeQueue?.dispose();
  changeQueue = new ChangeQueue({
    debounceMs: runtimeSettings.debounceMs,
    onFlush: processChangeBatch
  });

  connection.console.info(
    `runtime settings initialised (debounce=${runtimeSettings.debounceMs}ms, noise=${runtimeSettings.noiseSuppression.level})`
  );

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      diagnosticProvider: {
        interFileDependencies: true,
        workspaceDiagnostics: true
      }
    }
  };
});

connection.onInitialized(() => {
  connection.console.info("link-aware-diagnostics server initialised");
  connection.client.register(DidChangeConfigurationNotification.type, undefined);
});

connection.onShutdown(() => {
  graphStore?.close();
  changeQueue?.dispose();
  changeQueue = null;
});

connection.onDidChangeConfiguration((change: DidChangeConfigurationParams) => {
  const settingsCandidate =
    (change.settings?.linkAwareDiagnostics ?? change.settings) as ExtensionSettings | undefined;
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
    processChangeBatch([payload]);
  }
});

documents.listen(connection);
connection.listen();

function resolveDatabasePath(params: InitializeParams, settings: ExtensionSettings): string {
  if (settings.storagePath) {
    return path.join(settings.storagePath, "link-aware-diagnostics.db");
  }

  const workspaceFolder = params.workspaceFolders?.[0]?.uri;
  if (workspaceFolder) {
    const folderPath = workspaceFolder.replace("file://", "");
    return path.join(folderPath, ".link-aware-diagnostics", "link-aware-diagnostics.db");
  }

  return path.join(os.tmpdir(), "link-aware-diagnostics", "link-aware-diagnostics.db");
}

function ensureDirectory(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function processChangeBatch(changes: QueuedChange[]): void {
  if (!graphStore) {
    return;
  }

  const timestamp = new Date().toISOString();
  let diagnosticsBudget = runtimeSettings.noiseSuppression.maxDiagnosticsPerBatch;
  let suppressedCount = 0;

  for (const change of changes) {
    graphStore.recordChangeEvent({
      id: uuid(),
      artifactId: change.uri,
      detectedAt: timestamp,
      summary: "Document saved",
      changeType: "content",
      ranges: [],
      provenance: "save"
    });

    if (!providerGuard.areDiagnosticsEnabled()) {
      continue;
    }

    if (diagnosticsBudget <= 0) {
      suppressedCount += 1;
      continue;
    }

    diagnosticsBudget -= 1;

    const diagnostic: Diagnostic = {
      severity: DiagnosticSeverity.Warning,
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 1 }
      },
      message: "Changes queued. Inference pipeline will reconcile linked artifacts once implemented.",
      source: "link-aware-diagnostics",
      code: "prototype-change"
    };

    connection.sendDiagnostics({ uri: change.uri, diagnostics: [diagnostic] });
  }

  if (suppressedCount > 0) {
    connection.console.info(
      `noise suppression level '${runtimeSettings.noiseSuppression.level}' muted ${suppressedCount} diagnostics in this batch`
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
