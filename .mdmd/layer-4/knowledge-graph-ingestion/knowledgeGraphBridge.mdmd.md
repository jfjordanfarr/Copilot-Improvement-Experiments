# Knowledge Graph Bridge Service

## Metadata
- Layer: 4
- Implementation ID: IMP-211
- Code Path: [`packages/server/src/features/knowledge/knowledgeGraphBridge.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphBridge.ts)
- Exports: KnowledgeGraphBridgeLogger, KnowledgeGraphBridgeServiceOptions, KnowledgeGraphBridgeStartResult, KnowledgeGraphBridgeDisposable, KnowledgeGraphBridgeService

## Purpose
Bootstrap and supervise the ingestion stack that projects external knowledge feeds into the workspace graph.
- Discover static feed descriptors (JSON, LSIF, SCIP) and wire ingestion collaborators.
- Start feed management, checkpoint persistence, and diagnostics propagation.
- Expose healthy feed descriptors plus lifecycle hooks to the language server runtime.

## Public Symbols

### KnowledgeGraphBridgeLogger
Optional logger contract supplying `info`, `warn`, and `error` hooks reused by the bridge, ingestor, and feed manager for consistent telemetry.

### KnowledgeGraphBridgeServiceOptions
Configuration bundle accepting the graph store, storage directory, workspace root, optional logger, factory overrides, and feed definitions used during startup.

### KnowledgeGraphBridgeStartResult
Shape returned from `start()` that reports how many feeds activated, allowing callers to decide whether ingestion entered service.

### KnowledgeGraphBridgeDisposable
Handle returned by `onStatusChanged`; disposing unsubscribes listeners from feed health updates without touching other observers.

### KnowledgeGraphBridgeService
Lifecycle manager that discovers feeds, constructs `KnowledgeGraphIngestor`/`KnowledgeFeedManager`, supervises start/stop, and notifies listeners of health changes.

## Collaborators
- [`packages/server/src/features/knowledge/knowledgeFeedManager.ts`](../../../packages/server/src/features/knowledge/knowledgeFeedManager.ts) schedules snapshots, streams, and health reporting.
- [`packages/server/src/features/knowledge/knowledgeGraphIngestor.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.ts) validates payloads and applies them to the graph store.
- [`packages/server/src/features/knowledge/feedDiagnosticsGateway.ts`](../../../packages/server/src/features/knowledge/feedDiagnosticsGateway.ts) records feed health transitions that the bridge relays to observers.
- [`packages/server/src/features/knowledge/feedCheckpointStore.ts`](../../../packages/server/src/features/knowledge/feedCheckpointStore.ts) persists per-feed cursors in the configured storage directory.

## Linked Components
- [COMP-003 – Language Server Runtime](../../layer-3/language-server-architecture.mdmd.md#imp211-knowledgegraphbridgeservice)
- [COMP-005 – Knowledge Graph Ingestion](../../layer-3/knowledge-graph-ingestion.mdmd.md#imp211-knowledgegraphbridgeservice)

## Evidence
- Covered indirectly by [`packages/server/src/features/knowledge/knowledgeFeedManager.test.ts`](../../../packages/server/src/features/knowledge/knowledgeFeedManager.test.ts) and [`knowledgeGraphIngestor.test.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.test.ts), which boot the bridge via manager constructors.
- Integration suites for US5 load static feed fixtures through the bridge to confirm deterministic graph snapshots.
- Manual smoke: `npm run graph:snapshot` relies on bridge bootstrap before gathering workspace knowledge.

## Operational Notes
- Restarting `start()` after `dispose()` is idempotent; the bridge lazily re-discovers feeds and rebuilds collaborators.
- Static feed discovery slugs filenames into stable feed IDs and attaches provenance metadata for downstream audits.
- Logger child prefixes (`knowledge-feed`, `knowledge-ingestor`) simplify filtering within combined telemetry streams.

## Follow-ups
- Add focused unit coverage that injects fake factories to assert lifecycle edges and listener notification semantics.
- Extend discovery to handle remote feed descriptors and feature-flag-driven inclusion once roadmap tasks open.
