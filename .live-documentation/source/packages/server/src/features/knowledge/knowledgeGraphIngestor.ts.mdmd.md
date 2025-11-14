# packages/server/src/features/knowledge/knowledgeGraphIngestor.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/knowledgeGraphIngestor.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-knowledgegraphingestor-ts
- Generated At: 2025-11-14T18:42:06.416Z

## Authored
### Purpose
Coordinates ingestion of knowledge feed snapshots and stream events into the graph store via the bridge, ensuring artifacts, links, and checkpoints stay consistent.

### Notes
- Serialises per-feed work with an async lock to prevent concurrent writes from trampling checkpoints or graph state.
- Normalises URIs, synthesises stable IDs, and merges feed metadata before delegating to the bridge, pruning stale artifacts afterwards.
- Reports health through `FeedDiagnosticsGateway` and persists checkpoints so stream replay can resume after restarts.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.416Z","inputHash":"4c13aceb03145184"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `KnowledgeGraphIngestorLogger`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.ts#L22)

#### `KnowledgeGraphIngestorOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.ts#L28)

#### `SnapshotIngestResult`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.ts#L37)

#### `StreamIngestResult`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.ts#L43)

#### `KnowledgeGraphIngestor`
- Type: class
- Source: [source](../../../../../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.ts#L49)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `ExternalArtifact`, `ExternalLink`, `ExternalSnapshot`, `ExternalStreamEvent`, `GraphStore`, `KnowledgeGraphBridge`, `KnowledgeSnapshot`, `StreamCheckpoint`
- `node:crypto` - `createHash`
- [`feedCheckpointStore.FeedCheckpointStore`](./feedCheckpointStore.ts.mdmd.md#feedcheckpointstore)
- [`feedDiagnosticsGateway.FeedDiagnosticsGateway`](./feedDiagnosticsGateway.ts.mdmd.md#feeddiagnosticsgateway)
- [`feedDiagnosticsGateway.FeedHealthStatus`](./feedDiagnosticsGateway.ts.mdmd.md#feedhealthstatus)
- [`schemaValidator.assertValidSnapshot`](./schemaValidator.ts.mdmd.md#assertvalidsnapshot)
- [`schemaValidator.assertValidStreamEvent`](./schemaValidator.ts.mdmd.md#assertvalidstreamevent)
- [`uri.normalizeFileUri`](../utils/uri.ts.mdmd.md#normalizefileuri)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [knowledgeFeedManager.test.ts](./knowledgeFeedManager.test.ts.mdmd.md)
- [knowledgeGraphBridge.test.ts](./knowledgeGraphBridge.test.ts.mdmd.md)
- [knowledgeGraphIngestor.test.ts](./knowledgeGraphIngestor.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
