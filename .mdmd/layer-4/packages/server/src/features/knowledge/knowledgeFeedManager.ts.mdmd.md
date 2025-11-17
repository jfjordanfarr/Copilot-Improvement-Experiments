# packages/server/src/features/knowledge/knowledgeFeedManager.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/knowledgeFeedManager.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-knowledgefeedmanager-ts
- Generated At: 2025-11-16T22:35:15.592Z

## Authored
### Purpose
Coordinates snapshot bootstraps and stream consumption for each configured knowledge feed, applying backoff and health reporting so the ingestion stack remains resilient, as implemented during the Oct 20 feed-orchestration work noted in [2025-10-20 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-20.SUMMARIZED.md).

### Notes
- Maintains per-feed abort controllers, exponential backoff, and listener notifications, preserving the durability guarantees tightened in [2025-10-30 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-30.SUMMARIZED.md) when we hardened degraded-feed recovery.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:15.592Z","inputHash":"ffebdc66bd2e8f90"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `Disposable`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/knowledgeFeedManager.ts#L17)

#### `KnowledgeFeedManagerLogger`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/knowledgeFeedManager.ts#L21)

#### `FeedSnapshotSource`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/knowledgeFeedManager.ts#L27)

#### `FeedStreamSource`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/knowledgeFeedManager.ts#L32)

#### `FeedConfiguration`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/knowledgeFeedManager.ts#L37)

#### `BackoffOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/knowledgeFeedManager.ts#L44)

#### `KnowledgeFeedManagerOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/knowledgeFeedManager.ts#L50)

#### `KnowledgeFeedManager`
- Type: class
- Source: [source](../../../../../../../packages/server/src/features/knowledge/knowledgeFeedManager.ts#L140)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:timers/promises` - `setTimeout`
- [`feedDiagnosticsGateway.FeedDiagnosticsGateway`](./feedDiagnosticsGateway.ts.mdmd.md#feeddiagnosticsgateway)
- [`feedDiagnosticsGateway.FeedStatusSummary`](./feedDiagnosticsGateway.ts.mdmd.md#feedstatussummary)
- [`knowledgeGraphIngestor.KnowledgeGraphIngestor`](./knowledgeGraphIngestor.ts.mdmd.md#knowledgegraphingestor)
- [`knowledgeGraphIngestor.SnapshotIngestResult`](./knowledgeGraphIngestor.ts.mdmd.md#snapshotingestresult)
- [`knowledgeGraphIngestor.StreamIngestResult`](./knowledgeGraphIngestor.ts.mdmd.md#streamingestresult)
- [`index.ExternalSnapshot`](../../../../shared/src/index.ts.mdmd.md#externalsnapshot)
- [`index.ExternalStreamEvent`](../../../../shared/src/index.ts.mdmd.md#externalstreamevent)
- [`index.KnowledgeFeed`](../../../../shared/src/index.ts.mdmd.md#knowledgefeed)
- [`index.KnowledgeFeedSnapshotSource`](../../../../shared/src/index.ts.mdmd.md#knowledgefeedsnapshotsource)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [knowledgeFeedManager.test.ts](./knowledgeFeedManager.test.ts.mdmd.md)
- [knowledgeGraphBridge.test.ts](./knowledgeGraphBridge.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
