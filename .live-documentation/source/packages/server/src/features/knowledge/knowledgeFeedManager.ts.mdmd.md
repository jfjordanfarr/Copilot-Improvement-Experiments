# packages/server/src/features/knowledge/knowledgeFeedManager.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/knowledgeFeedManager.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-knowledgefeedmanager-ts
- Generated At: 2025-11-14T18:42:06.395Z

## Authored
### Purpose
Coordinates registration, scheduling, and monitoring of knowledge feeds, orchestrating ingestion runs and checkpoint persistence.

### Notes
- Maintains feed registry metadata (source URIs, schedule info) and hands off to orchestrators for parsing and storage.
- Records run outcomes and emits telemetry via the diagnostics gateway so operators can track feed health.

#### FeedDisposable
Alias consumed by `KnowledgeGraphBridgeService` for readability; maps directly to the exported [`Disposable`](#disposable) interface.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.395Z","inputHash":"ba457388129df5c6"}]} -->
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
- `@copilot-improvement/shared` - `ExternalSnapshot`, `ExternalStreamEvent`, `KnowledgeFeed`, `KnowledgeFeedSnapshotSource`
- `node:timers/promises` - `sleepTimeout`
- [`feedDiagnosticsGateway.FeedDiagnosticsGateway`](./feedDiagnosticsGateway.ts.mdmd.md#feeddiagnosticsgateway)
- [`feedDiagnosticsGateway.FeedStatusSummary`](./feedDiagnosticsGateway.ts.mdmd.md#feedstatussummary)
- [`knowledgeGraphIngestor.KnowledgeGraphIngestor`](./knowledgeGraphIngestor.ts.mdmd.md#knowledgegraphingestor)
- [`knowledgeGraphIngestor.SnapshotIngestResult`](./knowledgeGraphIngestor.ts.mdmd.md#snapshotingestresult)
- [`knowledgeGraphIngestor.StreamIngestResult`](./knowledgeGraphIngestor.ts.mdmd.md#streamingestresult)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [knowledgeFeedManager.test.ts](./knowledgeFeedManager.test.ts.mdmd.md)
- [knowledgeGraphBridge.test.ts](./knowledgeGraphBridge.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
