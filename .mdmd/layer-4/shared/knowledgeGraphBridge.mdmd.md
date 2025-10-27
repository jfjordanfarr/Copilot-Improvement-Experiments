# Knowledge Graph Bridge Contracts (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/knowledge/knowledgeGraphBridge.ts`](../../../packages/shared/src/knowledge/knowledgeGraphBridge.ts)
- Parent design: [Knowledge Graph Ingestion Architecture](../../layer-3/knowledge-graph-ingestion.mdmd.md)

## Exported Symbols

#### ExternalArtifact
`ExternalArtifact` mirrors the artifact shape external feeds provide before the bridge upserts them into the graph store.

#### ExternalLink
`ExternalLink` captures relationship payloads imported from feeds, including optional metadata and author fields.

#### ExternalSnapshot
`ExternalSnapshot` packages a full artifact/link snapshot supplied by an external source.

#### StreamEventKind
`StreamEventKind` enumerates the incremental event types the bridge accepts (`artifact-upsert`, `artifact-remove`, `link-upsert`, `link-remove`).

#### ExternalStreamEvent
`ExternalStreamEvent` represents incremental feed events, combining event kind, sequence id, timestamps, and optional artifact/link payloads.

#### StreamCheckpoint
`StreamCheckpoint` records the last processed sequence id so feeds can resume after restarts.

#### KnowledgeGraphBridge
`KnowledgeGraphBridge` converts external snapshots and stream events into graph store mutations, maintaining alias maps to reconcile ids.

## Responsibility
Provide the shared contracts used by both the server and external tooling to exchange knowledge-feed artifacts and links, and expose the bridge helper that persists them into the graph store.

## Evidence
- Instantiated by the server-side knowledge feed controller documented in [`knowledgeFeeds.mdmd.md`](../language-server-runtime/knowledgeFeeds.mdmd.md).
