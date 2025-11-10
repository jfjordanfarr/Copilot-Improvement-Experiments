# packages/server/src/features/knowledge/knowledgeGraphBridge.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/knowledgeGraphBridge.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-knowledgegraphbridge-ts
- Generated At: 2025-11-09T22:52:10.637Z

## Authored
### Purpose
Acts as the adapter between external knowledge feeds and the internal graph store, translating feed entities into workspace artifacts and relationships.

### Notes
- Normalises URIs and metadata before insertion to maintain graph consistency regardless of feed format.
- Exposes helper utilities for building link relationships so downstream diagnostics can rely on uniform edge structures.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:10.637Z","inputHash":"578fe0c0d514e2cc"}]} -->
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
- [`feedCheckpointStore.FileFeedCheckpointStore`](./feedCheckpointStore.ts.mdmd.md#filefeedcheckpointstore)
- [`feedDiagnosticsGateway.FeedDiagnosticsGateway`](./feedDiagnosticsGateway.ts.mdmd.md#feeddiagnosticsgateway)
- [`feedDiagnosticsGateway.FeedDiagnosticsGatewayOptions`](./feedDiagnosticsGateway.ts.mdmd.md#feeddiagnosticsgatewayoptions)
- [`feedDiagnosticsGateway.FeedStatusSummary`](./feedDiagnosticsGateway.ts.mdmd.md#feedstatussummary)
- [`feedFormatDetector.parseFeedFile`](./feedFormatDetector.ts.mdmd.md#parsefeedfile)
- [`knowledgeFeedManager.BackoffOptions`](./knowledgeFeedManager.ts.mdmd.md#backoffoptions)
- [`knowledgeFeedManager.FeedConfiguration`](./knowledgeFeedManager.ts.mdmd.md#feedconfiguration)
- [`knowledgeFeedManager.FeedDisposable`](./knowledgeFeedManager.ts.mdmd.md#feeddisposable)
- [`knowledgeFeedManager.KnowledgeFeedManager`](./knowledgeFeedManager.ts.mdmd.md#knowledgefeedmanager)
- [`knowledgeGraphIngestor.KnowledgeGraphIngestor`](./knowledgeGraphIngestor.ts.mdmd.md#knowledgegraphingestor)
- [`knowledgeGraphIngestor.KnowledgeGraphIngestorLogger`](./knowledgeGraphIngestor.ts.mdmd.md#knowledgegraphingestorlogger)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [knowledgeGraphBridge.test.ts](./knowledgeGraphBridge.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
