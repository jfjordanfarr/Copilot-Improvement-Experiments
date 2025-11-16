# packages/server/src/features/knowledge/knowledgeGraphBridge.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/knowledgeGraphBridge.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-knowledgegraphbridge-ts
- Generated At: 2025-11-16T02:09:51.360Z

## Authored
### Purpose
Acts as the adapter between external knowledge feeds and the internal graph store, translating feed entities into workspace artifacts and relationships.

### Notes
- Normalises URIs and metadata before insertion to maintain graph consistency regardless of feed format.
- Exposes helper utilities for building link relationships so downstream diagnostics can rely on uniform edge structures.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.360Z","inputHash":"2f5ada8ac6ec799b"}]} -->
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
- `@copilot-improvement/shared` - `ArtifactLayer`, `ExternalArtifact`, `ExternalLink`, `ExternalSnapshot`, `GraphStore`, `KnowledgeFeed`, `LinkRelationshipKind`, `SharedKnowledgeGraphBridge`
- `node:crypto` - `createHash`
- `node:fs` - `fs`, `fsp`
- `node:path` - `path`
- `node:url` - `pathToFileURL`
- [`feedCheckpointStore.FileFeedCheckpointStore`](./feedCheckpointStore.ts.md#filefeedcheckpointstore)
- [`feedDiagnosticsGateway.FeedDiagnosticsGateway`](./feedDiagnosticsGateway.ts.md#feeddiagnosticsgateway)
- [`feedDiagnosticsGateway.FeedDiagnosticsGatewayOptions`](./feedDiagnosticsGateway.ts.md#feeddiagnosticsgatewayoptions)
- [`feedDiagnosticsGateway.FeedStatusSummary`](./feedDiagnosticsGateway.ts.md#feedstatussummary)
- [`feedFormatDetector.parseFeedFile`](./feedFormatDetector.ts.md#parsefeedfile)
- [`knowledgeFeedManager.BackoffOptions`](./knowledgeFeedManager.ts.md#backoffoptions)
- [`knowledgeFeedManager.FeedConfiguration`](./knowledgeFeedManager.ts.md#feedconfiguration)
- [`knowledgeFeedManager.FeedDisposable`](./knowledgeFeedManager.ts.md#feeddisposable)
- [`knowledgeFeedManager.KnowledgeFeedManager`](./knowledgeFeedManager.ts.md#knowledgefeedmanager)
- [`knowledgeGraphIngestor.KnowledgeGraphIngestor`](./knowledgeGraphIngestor.ts.md#knowledgegraphingestor)
- [`knowledgeGraphIngestor.KnowledgeGraphIngestorLogger`](./knowledgeGraphIngestor.ts.md#knowledgegraphingestorlogger)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [knowledgeGraphBridge.test.ts](./knowledgeGraphBridge.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
