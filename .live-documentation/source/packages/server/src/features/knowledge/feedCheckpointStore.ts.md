# packages/server/src/features/knowledge/feedCheckpointStore.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/feedCheckpointStore.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-feedcheckpointstore-ts
- Generated At: 2025-11-16T02:09:51.315Z

## Authored
### Purpose
Persists ingestion checkpoints for knowledge feeds so resumable imports pick up from the last processed entry without re-reading the entire source.

### Notes
- Stores offsets per feed identifier, allowing multiple feeds to progress independently.
- Exposes CRUD helpers used by ingestion orchestrators to load and update checkpoint state around each batch.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.315Z","inputHash":"bf87316ce05a561e"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `FeedCheckpointStore`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/feedCheckpointStore.ts#L6)

#### `FileFeedCheckpointStore`
- Type: class
- Source: [source](../../../../../../../packages/server/src/features/knowledge/feedCheckpointStore.ts#L12)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `StreamCheckpoint`
- `node:fs` - `fs`
- `node:path` - `path`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [knowledgeFeedManager.test.ts](./knowledgeFeedManager.test.ts.md)
- [knowledgeGraphBridge.test.ts](./knowledgeGraphBridge.test.ts.md)
- [knowledgeGraphIngestor.test.ts](./knowledgeGraphIngestor.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
