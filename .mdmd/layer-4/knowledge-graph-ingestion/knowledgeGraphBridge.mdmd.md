# KnowledgeGraphBridgeService (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/knowledge/knowledgeGraphBridge.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphBridge.ts)
- Collaborators: `KnowledgeFeedManager`, `KnowledgeGraphIngestor`, `FeedDiagnosticsGateway`, `FileFeedCheckpointStore`
- Parent design: [Knowledge Graph Ingestion Architecture](../../layer-3/knowledge-graph-ingestion.mdmd.md)
- Spec references: [FR-015](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-016](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T040](../../../specs/001-link-aware-diagnostics/tasks.md)

## Exported Symbols

### `KnowledgeGraphBridgeLogger`
Optional logger contract injected for structured logging. Supplies `info`, `warn`, and `error` hooks reused across child components.

### `KnowledgeGraphBridgeServiceOptions`
Constructor bundle providing the graph store, storage directory, workspace root, logger, factories, and configuration overrides needed to wire ingestion.

### `KnowledgeGraphBridgeStartResult`
Return shape from `start`, reporting how many feeds were configured. Helps callers decide whether ingestion activated.

### `KnowledgeGraphBridgeDisposable`
Disposable handle returned by `onStatusChanged`, allowing listeners to unsubscribe from bridge-level status notifications.

### `KnowledgeGraphBridgeService`
Facade class that discovers feed configurations, constructs ingestion infrastructure, manages lifecycle, and forwards health updates to listeners.

## Responsibility
Coordinates discovery, ingestion, and health tracking for external knowledge feeds. Orchestrates snapshot/stream processing, checkpoint persistence, and diagnostics reporting so the runtime can blend static descriptors with workspace-inferred links.

## Startup Flow
1. Resolve workspace root and discover feed configurations (`data/knowledge-feeds/*.json`) unless explicit configs are injected by tests.
2. Ensure the storage directory contains a `knowledge-feeds/` subfolder for checkpoints.
3. Construct `KnowledgeGraphIngestor`, `KnowledgeFeedManager`, and supporting gateways, wiring logger prefixes for observability.
4. Start feed manager, subscribe to status changes, and notify listeners (UI + diagnostics) once feeds are healthy or degraded.

## Behaviour
- Exposes `start()` / `dispose()` lifecycle that can be invoked by the runtime bootstrap; restart attempts are idempotent.
- Provides `getHealthyFeeds()` for diagnostics and UI surfaces to display active feeds.
- Broadcasts feed status updates to listeners via `onStatusChanged`, allowing extension telemetry to react without tight coupling.
- Falls back gracefully when no workspace root is available, skipping ingestion while keeping inference-only mode operational.

## Implementation Notes
- Uses factory hooks (`bridgeFactory`, `checkpointStoreFactory`) to facilitate unit tests and future storage implementations.
- Static feed discovery derives stable IDs from filenames, mapping artifact/link aliases (id/path/uri) into canonical URIs.
- Applies backoff strategies and diagnostics wiring defined by `KnowledgeFeedManager`/`FeedDiagnosticsGateway` to avoid hot-looping failing feeds.
- Logs via injected `KnowledgeGraphBridgeLogger`, defaulting to console when absent.

## Failure Handling
- Wraps `stop()` calls in try/catch to prevent asynchronous teardown errors from crashing the server.
- Captures filesystem errors during feed discovery and reports them through diagnostics + console warnings.
- Notifies listeners with `undefined` summaries when ingestion is skipped or disposed so UI clears stale state.

## Testing
- Covered indirectly through unit suites for feed manager/ingestor plus integration tests that seed static JSON feeds (US5 transform pipeline).
- Additional targeted unit tests can inject mock factories to assert lifecycle behaviour; tracked as a medium-priority enhancement.

## Follow-ups
- Persist listener diagnostics across restarts once acknowledgement UX requires continuity.
- Extend discovery to support remote descriptors (e.g., LSIF endpoints) and dynamic feature toggles when roadmap T05x opens.
