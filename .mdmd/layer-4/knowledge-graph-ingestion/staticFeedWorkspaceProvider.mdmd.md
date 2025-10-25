# StaticFeedWorkspaceProvider (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/knowledge/staticFeedWorkspaceProvider.ts`](../../../packages/server/src/features/knowledge/staticFeedWorkspaceProvider.ts)
- Parent design: [Knowledge Graph Ingestion Architecture](../knowledge-graph-ingestion.mdmd.md)
- Data inputs: `data/knowledge-feeds/*.json`

## Responsibility
Expose a workspace-scope fallback provider that seeds the knowledge graph with statically defined artifacts and links when external feeds are unavailable. Reads JSON fixtures from `data/knowledge-feeds/` and produces `WorkspaceLinkContribution` objects for the link inference orchestrator.

## Key Concepts
- **Artifact seeds**: Minimal descriptors (URI, layer, language) used to bootstrap the graph.
- **Evidence links**: Relationships inferred from the static feed; tagged with `workspace-static-feed` as the creator and a rationale referencing the source file.
- **Alias map**: Tracks URIs by id/path hints so link endpoints can resolve even when the JSON references artifacts by different keys.

## Public API
- `createStaticFeedWorkspaceProvider(options): WorkspaceLinkProvider`

## Internal Flow
1. Compute the `data/knowledge-feeds` directory relative to `rootPath` and collect `.json` entries when present.
2. For each file, parse artifacts and links, validating object shapes before use.
3. Resolve artifact URIs using explicit `uri`, filesystem `path`, or by warning when targets do not exist.
4. Build evidences by resolving link endpoints via alias lookup or fallback `file://` URIs, applying a default confidence of `0.95` when unspecified.
5. Deduplicate seeds by URI and return them alongside accumulated evidences.

## Error Handling
- Missing directories or files yield empty contributions without logging noise.
- Per-file parsing errors and missing artifact paths log warnings (via optional logger) but continue processing remaining files.
- Links missing resolvable endpoints are skipped silently, ensuring partial data does not block ingestion.

## Observability Hooks
- Optional logger emits warnings for unreadable files and missing artifact paths, helping operators maintain static feed fixtures.

## Integration Notes
- Acts as a workspace provider ID `workspace-static-feed`, enabling tests and runtime wiring to distinguish fallback contributions.
- Complements dynamic feeds managed by `KnowledgeFeedManager`; when external feeds fail, this provider still supplies baseline graph edges.
- JSON schema for static feeds remains intentionally permissive; additional validation can be layered by reusing `SchemaValidator` if requirements tighten.
