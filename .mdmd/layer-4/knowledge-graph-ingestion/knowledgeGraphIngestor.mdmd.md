# Knowledge Graph Ingestor

## Metadata
- Layer: 4
- Implementation ID: IMP-205
- Code Path: [`packages/server/src/features/knowledge/knowledgeGraphIngestor.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.ts)
- Exports: KnowledgeGraphIngestor, KnowledgeGraphIngestorOptions, KnowledgeGraphIngestorLogger, SnapshotIngestResult, StreamIngestResult

## Purpose
Validate, normalise, and persist knowledge-feed snapshots and stream events into the workspace graph while maintaining per-feed checkpoints and diagnostics so external intelligence remains trustworthy.

## Public Symbols

### KnowledgeGraphIngestor
Coordinates feed ingestion: validates payloads, applies normalisation (URI canonicalisation, feed metadata tagging), persists results via `KnowledgeGraphBridge`, prunes stale artifacts, and updates diagnostics/checkpoints.

### KnowledgeGraphIngestorOptions
Configuration contract bundling the graph store, bridge, checkpoint store, diagnostics gateway, optional logger, and clock overrides used for deterministic testing.

### KnowledgeGraphIngestorLogger
Optional logging surface (info/warn/error) to capture ingestion progress, prunes, and failure details without binding to a concrete logger.

### SnapshotIngestResult
Return type from `ingestSnapshot` exposing the feed identifier, normalised snapshot, and persisted `KnowledgeSnapshot` for observability and audit.

### StreamIngestResult
Return type from `ingestStreamEvent` including the feed identifier, normalised stream event, and resulting checkpoint written to storage.

## Responsibilities
- Enforce schema correctness via `assertValidSnapshot`/`assertValidStreamEvent` before mutating the graph.
- Normalise artifacts and links (canonical URIs, deterministic IDs, feed metadata) to keep graph entries consistent across runs.
- Apply snapshots and stream events through `KnowledgeGraphBridge`, pruning feed-owned artifacts absent from payloads to avoid drift.
- Maintain checkpoints per feed so duplicate stream events are ignored and resyncs resume from the correct cursor.
- Publish feed health updates to diagnostics, logging structured context for operators.

## Collaborators
- [`packages/server/src/features/knowledge/feedCheckpointStore.ts`](../../../packages/server/src/features/knowledge/feedCheckpointStore.ts) persists last-seen snapshot/stream cursors.
- [`packages/server/src/features/knowledge/feedDiagnosticsGateway.ts`](../../../packages/server/src/features/knowledge/feedDiagnosticsGateway.ts) records healthy/degraded status with optional details.
- [`packages/server/src/features/knowledge/schemaValidator.ts`](../../../packages/server/src/features/knowledge/schemaValidator.ts) enforces payload contracts before persistence.
- [`packages/shared/src/knowledge/knowledgeGraphBridge.ts`](../../../packages/shared/src/knowledge/knowledgeGraphBridge.ts) applies snapshots/events to the SQLite-backed graph store.

## Linked Components
- [COMP-005 – Knowledge Graph Ingestion](../../layer-3/knowledge-graph-ingestion.mdmd.md#imp205-knowledgegraphingestor)
- [COMP-003 – Language Server Runtime](../../layer-3/language-server-architecture.mdmd.md#imp205-knowledgegraphingestor)

## Evidence
- Unit tests: [`packages/server/src/features/knowledge/knowledgeGraphIngestor.test.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.test.ts) (pending) cover snapshot pruning, stream idempotency, and diagnostics updates.
- Integration coverage: US5 ingestion suites exercise snapshot + stream flows using LSIF fixtures.
- Manual verification: `npm run graph:snapshot` and benchmark rebuild suites rely on this ingestor to produce deterministic artifacts/links.

## Operational Notes
- Feed-level locks prevent concurrent mutations per feed while allowing multi-feed parallelism.
- Pruning logs the number of removed artifacts so drift is observable during feed refreshes.
- Duplicate stream events return early using persisted checkpoints, favouring idempotency over repeated writes.
- Failure paths re-throw after diagnostics updates to trigger manager backoff behavior.
