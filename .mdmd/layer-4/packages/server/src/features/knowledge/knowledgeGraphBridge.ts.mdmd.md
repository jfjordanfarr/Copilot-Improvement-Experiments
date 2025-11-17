# packages/server/src/features/knowledge/knowledgeGraphBridge.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/knowledgeGraphBridge.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-knowledgegraphbridge-ts
- Generated At: 2025-11-16T22:35:15.651Z

## Authored
### Purpose
Bootstraps knowledge feed ingestion for the workspace by discovering static feed descriptors, wiring checkpoints, and delegating updates to `KnowledgeGraphIngestor`, as introduced during the Oct 20 ingestion milestone captured in [2025-10-20 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-20.SUMMARIZED.md).

### Notes
- Hosts the feed manager, diagnostics gateway, and derived child loggers so per-feed health surfaces cleanly, incorporating the follow-up logging and discovery tweaks tracked in [2025-10-30 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-30.SUMMARIZED.md).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:15.651Z","inputHash":"c9a0104f2f8b78e3"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `KnowledgeGraphBridgeLogger`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/knowledgeGraphBridge.ts#L36)

#### `KnowledgeGraphBridgeServiceOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/knowledgeGraphBridge.ts#L42)

#### `KnowledgeGraphBridgeStartResult`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/knowledgeGraphBridge.ts#L55)

#### `KnowledgeGraphBridgeDisposable`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/knowledgeGraphBridge.ts#L59)

#### `KnowledgeGraphBridgeService`
- Type: class
- Source: [source](../../../../../../../packages/server/src/features/knowledge/knowledgeGraphBridge.ts#L63)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:crypto` - `createHash`
- `node:fs` - `fs`, `promises`
- `node:path` - `path`
- `node:url` - `pathToFileURL`
- [`feedCheckpointStore.FileFeedCheckpointStore`](./feedCheckpointStore.ts.mdmd.md#filefeedcheckpointstore)
- [`feedDiagnosticsGateway.FeedDiagnosticsGateway`](./feedDiagnosticsGateway.ts.mdmd.md#feeddiagnosticsgateway)
- [`feedDiagnosticsGateway.FeedDiagnosticsGatewayOptions`](./feedDiagnosticsGateway.ts.mdmd.md#feeddiagnosticsgatewayoptions)
- [`feedDiagnosticsGateway.FeedStatusSummary`](./feedDiagnosticsGateway.ts.mdmd.md#feedstatussummary)
- [`feedFormatDetector.parseFeedFile`](./feedFormatDetector.ts.mdmd.md#parsefeedfile)
- [`knowledgeFeedManager.BackoffOptions`](./knowledgeFeedManager.ts.mdmd.md#backoffoptions)
- [`knowledgeFeedManager.Disposable`](./knowledgeFeedManager.ts.mdmd.md#disposable)
- [`knowledgeFeedManager.FeedConfiguration`](./knowledgeFeedManager.ts.mdmd.md#feedconfiguration)
- [`knowledgeFeedManager.KnowledgeFeedManager`](./knowledgeFeedManager.ts.mdmd.md#knowledgefeedmanager)
- [`knowledgeGraphIngestor.KnowledgeGraphIngestor`](./knowledgeGraphIngestor.ts.mdmd.md#knowledgegraphingestor)
- [`knowledgeGraphIngestor.KnowledgeGraphIngestorLogger`](./knowledgeGraphIngestor.ts.mdmd.md#knowledgegraphingestorlogger)
- [`index.ArtifactLayer`](../../../../shared/src/index.ts.mdmd.md#artifactlayer)
- [`index.ExternalArtifact`](../../../../shared/src/index.ts.mdmd.md#externalartifact)
- [`index.ExternalLink`](../../../../shared/src/index.ts.mdmd.md#externallink)
- [`index.ExternalSnapshot`](../../../../shared/src/index.ts.mdmd.md#externalsnapshot)
- [`index.GraphStore`](../../../../shared/src/index.ts.mdmd.md#graphstore)
- [`index.KnowledgeFeed`](../../../../shared/src/index.ts.mdmd.md#knowledgefeed)
- [`index.KnowledgeGraphBridge`](../../../../shared/src/index.ts.mdmd.md#knowledgegraphbridge)
- [`index.LinkRelationshipKind`](../../../../shared/src/index.ts.mdmd.md#linkrelationshipkind)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [knowledgeGraphBridge.test.ts](./knowledgeGraphBridge.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
