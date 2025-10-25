# FeedCheckpointStore (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/knowledge/feedCheckpointStore.ts`](../../../packages/server/src/features/knowledge/feedCheckpointStore.ts)
- Collaborators: [`knowledgeGraphBridge.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphBridge.ts) (factory wiring), [`knowledgeFeedManager.ts`](../../../packages/server/src/features/knowledge/knowledgeFeedManager.ts) (snapshot + stream lifecycle)
- Tests: [`knowledgeFeedManager.test.ts`](../../../packages/server/src/features/knowledge/knowledgeFeedManager.test.ts), [`knowledgeGraphIngestor.test.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.test.ts)
- Parent design: [Knowledge Graph Ingestion Architecture](../../layer-3/knowledge-graph-ingestion.mdmd.md)

## Responsibility
Persist and retrieve stream checkpoints for external knowledge feeds so ingestion can resume after restarts or backoff delays without replaying the full snapshot. The default `FileFeedCheckpointStore` records checkpoints on disk, scoped per feed.

## Key Concepts
- **StreamCheckpoint**: Shared contract containing `lastSequenceId` and `updatedAt`, describing the most recently applied stream event.
- **Checkpoint directory**: Base folder provided by runtime wiring; filenames are derived from feed IDs via a safe slug to prevent filesystem conflicts.
- **Validation guard**: Ensures deserialized checkpoints include the required properties before handing them back to callers.

## Public API
- `read(feedId: string): Promise<StreamCheckpoint | null>`
- `write(feedId: string, checkpoint: StreamCheckpoint): Promise<void>`
- `clear(feedId: string): Promise<void>`

## Internal Flow
1. Resolve a deterministic file path using the provided feed ID (`replace(/[^a-z0-9-_]/gi, "_")`).
2. For `read`, attempt to load and parse JSON from disk, returning `null` when the file is missing or fails validation.
3. For `write`, ensure the parent directory exists, stringify the checkpoint with indentation for auditability, and write atomically to disk.
4. For `clear`, remove the checkpoint file, ignoring `ENOENT` so idempotent clears do not surface as errors.

## Error Handling
- Missing files during `read` or `clear` are treated as soft misses and return without error, letting callers treat absence as “no checkpoint yet”.
- Any other filesystem failure surfaces to the caller, allowing the manager to degrade the feed and emit diagnostics.

## Observability Hooks
- No direct logging; upstream components instrument failures when the promises reject. Callers wrap these operations to emit status via `FeedDiagnosticsGateway`.

## Integration Notes
- `KnowledgeGraphBridge` creates a store per workspace to hydrate `KnowledgeGraphIngestor` stream processing.
- Tests simulate end-to-end usage by wiring the store into ingestion flows, ensuring checkpoints survive across process restarts.
- Implementations for remote stores (e.g., SQLite or KV-backed) can satisfy the same interface to support multi-instance deployments.
