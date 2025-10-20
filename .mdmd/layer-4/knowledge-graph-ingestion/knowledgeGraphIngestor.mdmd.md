# KnowledgeGraphIngestor (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/knowledge/knowledgeGraphIngestor.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.ts)
- Parent design: [Knowledge Graph Ingestion Architecture](../knowledge-graph-ingestion.mdmd.md)
- Spec references: [FR-015](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-016](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [Research §Knowledge-Graph Schema Contract](../../../specs/001-link-aware-diagnostics/research.md#knowledge-graph-schema-contract)

## Responsibility
Coordinates validation and persistence of external knowledge-graph feeds. Normalizes payloads, writes them through the shared `KnowledgeGraphBridge`, prunes stale artifacts keyed by `metadata.knowledgeFeedId`, manages per-feed checkpoints, and updates feed diagnostics.

## Dependencies
- `GraphStore` (SQLite persistence backing knowledge projections)
- `KnowledgeGraphBridge` (shared projector for snapshot and stream ingestion)
- Schema validator utilities (`assertValidSnapshot`, `assertValidStreamEvent`)
- `FeedDiagnosticsGateway` (health reporting)
- `FeedCheckpointStore` (workspace-backed JSON checkpoints)
- `Logger` abstraction shared across server features

## Data Contracts
- `KnowledgeGraphIngestorOptions`
	- `graphStore: GraphStore`
	- `bridge: KnowledgeGraphBridge`
	- `diagnostics: FeedDiagnosticsGateway`
	- `checkpoints: FeedCheckpointStore`
	- `logger: Logger`
	- `now?: () => Date`
- `ExternalSnapshot` *(from `@copilot-improvement/shared/knowledgeGraphBridge`)*
	- `artifacts: ExternalArtifact[]`
	- `links: ExternalLink[]`
	- `createdAt?: string`
- `ExternalStreamEvent`
	- `kind: StreamEventKind`
	- `sequenceId: string`
	- `detectedAt: string`
	- `artifact?: ExternalArtifact`
	- `artifactId?: string`
	- `link?: ExternalLink`
	- `linkId?: string`
- `StreamCheckpoint`
	- `lastSequenceId: string`
	- `updatedAt: string`

## Core Methods
- `ingestSnapshot(feedId: string, snapshot: ExternalSnapshot): Promise<void>`
- `ingestStreamEvent(feedId: string, event: ExternalStreamEvent): Promise<void>`
- `loadCheckpoint(feedId: string): Promise<StreamCheckpoint | null>`
- `persistCheckpoint(feedId: string, checkpoint: StreamCheckpoint): Promise<void>`
- `clearCheckpoint(feedId: string): Promise<void>`
- `withFeedLock<T>(feedId: string, work: () => Promise<T>): Promise<T>` *(guards concurrent ingestion)*

## Process Outline
1. **Validation** – assert payloads comply with schema contract before mutation.
2. **Normalization** – canonicalise artifact URIs, stamp `metadata.knowledgeFeedId`, and derive deterministic artifact/link IDs.
3. **Persistence** – forward normalized payloads to `KnowledgeGraphBridge`, record snapshot summaries, and prune artifacts whose metadata matches the feed but are absent from the payload.
4. **Checkpointing** – persist snapshot IDs and stream sequence cursors through `FeedCheckpointStore` for replay.
5. **Diagnostics** – mark the feed `healthy` or `degraded` via `FeedDiagnosticsGateway` and log structured context.
6. **Observability** – emit structured console logs and telemetry hooks consumed by the manager layer.

## Error Modes
- **Schema violation** → degrade feed status, skip persistence.
- **GraphStore failure** → log error, mark degraded, rely on manager retry policy.
- **Checkpoint write failure** → degrade feed and request snapshot rebuild on next cycle.
- **Unknown artifact/link references** → throw, degrade, and surface diagnostics.
- **Duplicate sequence IDs** → log as info and ignore to maintain idempotency.

## Observability
- Structured `knowledge.ingestor` logs for snapshot sizes, event IDs, and timings.
- Diagnostic status transitions surfaced via `FeedDiagnosticsGateway`.
- Checkpoint JSON files stored under workspace storage for auditibility and manual replay.

## Edge Cases
- Empty snapshots trigger a full prune of artifacts tagged with the feed ID to avoid drift.
- Duplicate or already processed stream cursors are ignored using the persisted checkpoint.
- Stream events carrying URIs instead of IDs map to deterministic IDs so stored links remain consistent.
- Workspace storage exhaustion bubbles descriptive errors and blocks the feed until addressed.

## Concurrency & Performance
- `withFeedLock` serializes ingestion per feed while permitting multi-feed parallelism.
- Snapshot application batches upserts through the existing SQLite transaction layer.
- Stream events reuse a per-call artifact index to avoid unnecessary database lookups.

## Testing Notes
- Snapshot ingestion without artifact IDs produces deterministic IDs and metadata tagging.
- Stream link events referencing URIs resolve to canonical IDs and refresh checkpoints.
- Validation failures surface degraded diagnostics via the gateway.

## TODO / Follow-ups
- Decide on retention and rotation policy for checkpoint history files.
- Add integration coverage for mixed snapshot and stream pipelines across multiple feeds.
