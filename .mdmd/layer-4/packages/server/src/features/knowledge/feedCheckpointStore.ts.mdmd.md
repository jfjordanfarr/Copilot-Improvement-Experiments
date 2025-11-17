# packages/server/src/features/knowledge/feedCheckpointStore.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/feedCheckpointStore.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-feedcheckpointstore-ts
- Generated At: 2025-11-16T22:35:15.513Z

## Authored
### Purpose
Persists per-feed stream checkpoints on disk so ingestion can resume without replaying snapshots, matching the durability layer established in [2025-10-20 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-20.SUMMARIZED.md).

### Notes
- Sanitises filenames and validates payloads to defend against malformed checkpoint JSON before committing to disk.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:15.513Z","inputHash":"7cc17d8575664d44"}]} -->
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
- `node:fs` - `promises`
- `node:path` - `path`
- [`index.StreamCheckpoint`](../../../../shared/src/index.ts.mdmd.md#streamcheckpoint)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [knowledgeFeedManager.test.ts](./knowledgeFeedManager.test.ts.mdmd.md)
- [knowledgeGraphBridge.test.ts](./knowledgeGraphBridge.test.ts.mdmd.md)
- [knowledgeGraphIngestor.test.ts](./knowledgeGraphIngestor.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
