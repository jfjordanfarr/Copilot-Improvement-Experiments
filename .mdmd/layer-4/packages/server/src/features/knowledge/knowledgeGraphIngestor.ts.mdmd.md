# packages/server/src/features/knowledge/knowledgeGraphIngestor.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/knowledgeGraphIngestor.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-knowledgegraphingestor-ts
- Generated At: 2025-11-16T22:35:15.705Z

## Authored
### Purpose
Applies validated knowledge feed snapshots and stream events into the workspace graph, enforcing per-feed sequencing so the bridge and GraphStore stay consistent with upstream sources documented during the Oct 20 ingestion build recorded in [2025-10-20 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-20.SUMMARIZED.md).

### Notes
- Serialises feed processing via lightweight locks, prunes artifacts that disappear from provider snapshots, and normalises URIs/IDs before delegating to `KnowledgeGraphBridge`, reflecting the hardening pass called out in [2025-10-30 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-30.SUMMARIZED.md).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:15.705Z","inputHash":"410a0b824a5f63ac"}]} -->
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
- `node:crypto` - `createHash`
- [`feedCheckpointStore.FeedCheckpointStore`](./feedCheckpointStore.ts.mdmd.md#feedcheckpointstore)
- [`feedDiagnosticsGateway.FeedDiagnosticsGateway`](./feedDiagnosticsGateway.ts.mdmd.md#feeddiagnosticsgateway)
- [`feedDiagnosticsGateway.FeedHealthStatus`](./feedDiagnosticsGateway.ts.mdmd.md#feedhealthstatus)
- [`schemaValidator.assertValidSnapshot`](./schemaValidator.ts.mdmd.md#assertvalidsnapshot)
- [`schemaValidator.assertValidStreamEvent`](./schemaValidator.ts.mdmd.md#assertvalidstreamevent)
- [`uri.normalizeFileUri`](../utils/uri.ts.mdmd.md#normalizefileuri)
- [`index.ExternalArtifact`](../../../../shared/src/index.ts.mdmd.md#externalartifact)
- [`index.ExternalLink`](../../../../shared/src/index.ts.mdmd.md#externallink)
- [`index.ExternalSnapshot`](../../../../shared/src/index.ts.mdmd.md#externalsnapshot)
- [`index.ExternalStreamEvent`](../../../../shared/src/index.ts.mdmd.md#externalstreamevent)
- [`index.GraphStore`](../../../../shared/src/index.ts.mdmd.md#graphstore)
- [`index.KnowledgeGraphBridge`](../../../../shared/src/index.ts.mdmd.md#knowledgegraphbridge)
- [`index.KnowledgeSnapshot`](../../../../shared/src/index.ts.mdmd.md#knowledgesnapshot)
- [`index.StreamCheckpoint`](../../../../shared/src/index.ts.mdmd.md#streamcheckpoint)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [knowledgeFeedManager.test.ts](./knowledgeFeedManager.test.ts.mdmd.md)
- [knowledgeGraphBridge.test.ts](./knowledgeGraphBridge.test.ts.mdmd.md)
- [knowledgeGraphIngestor.test.ts](./knowledgeGraphIngestor.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
