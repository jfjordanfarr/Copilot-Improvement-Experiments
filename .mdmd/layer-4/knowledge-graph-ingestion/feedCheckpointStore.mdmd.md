# Feed Checkpoint Store

## Metadata
- Layer: 4
- Implementation ID: IMP-208
- Code Path: [`packages/server/src/features/knowledge/feedCheckpointStore.ts`](../../../packages/server/src/features/knowledge/feedCheckpointStore.ts)
- Exports: FeedCheckpointStore, FileFeedCheckpointStore

## Purpose
Provide a persistence contract and default filesystem implementation for knowledge-feed checkpoints so ingestion can resume streaming from the last processed sequence ID after restarts or failures.
- Persist `StreamCheckpoint` payloads emitted by the ingestor after successful snapshot or stream batches.
- Return `null` when checkpoints are missing or invalid so callers can trigger snapshot rebuilds.
- Remove stored checkpoints on demand to force full reloads during destructive maintenance.

## Public Symbols

### FeedCheckpointStore
Interface defining `read`, `write`, and `clear` operations for stream checkpoints keyed by feed identifier, enabling alternative backends (SQLite, cloud KV) to plug into the ingestion runtime.

### FileFeedCheckpointStore
Filesystem-backed implementation that stores checkpoints as JSON per feed, slugifies filenames for portability, and treats missing files as cache misses during reads and clears.

## Collaborators
- [`packages/server/src/features/knowledge/knowledgeGraphIngestor.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.ts) writes checkpoints after successful snapshot/stream ingestion.
- [`packages/server/src/features/knowledge/knowledgeFeedManager.ts`](../../../packages/server/src/features/knowledge/knowledgeFeedManager.ts) reads checkpoints to resume stream workers and manages clears during restarts.
- [`packages/server/src/features/knowledge/knowledgeGraphBridge.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphBridge.ts) wires the store during workspace bootstrap.

## Linked Components
- [COMP-005 – Knowledge Graph Ingestion](../../layer-3/knowledge-graph-ingestion.mdmd.md#imp208-feedcheckpointstore)

## Evidence
- Unit coverage: [`packages/server/src/features/knowledge/knowledgeFeedManager.test.ts`](../../../packages/server/src/features/knowledge/knowledgeFeedManager.test.ts) and [`knowledgeGraphIngestor.test.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.test.ts) exercise checkpoint reads/writes through the filesystem implementation.
- Manual smoke: stopping and restarting the language server while streaming feeds confirms checkpoints persist under `.link-aware-diagnostics/` storage.

## Operational Notes
- JSON payloads are stored with indentation for human-readable audits; rotate directories if long-term history accumulation becomes an issue.
- Directory creation uses `recursive: true`, supporting nested workspace storage roots without prior setup.
- Validation ensures checkpoints include `lastSequenceId` and `updatedAt`, preventing corrupt files from silently resuming ingestion.
