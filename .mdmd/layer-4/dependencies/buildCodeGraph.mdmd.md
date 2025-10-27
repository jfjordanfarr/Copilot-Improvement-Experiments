# buildCodeImpactGraph (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/dependencies/buildCodeGraph.ts`](../../../packages/server/src/features/dependencies/buildCodeGraph.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)
- Spec references: [FR-007](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T025](../../../specs/001-link-aware-diagnostics/tasks.md)

## Exported Symbols

#### CodeImpactEdge
`CodeImpactEdge` captures each trigger→dependent hop discovered during traversal, preserving the originating artifact, the dependent, link metadata, depth, and the accumulated path so downstream tooling can render ripple chains.

#### BuildCodeGraphOptions
The `BuildCodeGraphOptions` interface configures traversal bounds via the maxDepth and linkKinds fields, allowing callers to widen relationship kinds or explore deeper dependency radii when UX affordances permit.

#### buildCodeImpactGraph
The `buildCodeImpactGraph` function performs a breadth-first walk over the knowledge graph, returning `CodeImpactEdge[]` that respect depth limits, deduplicate trigger/dependent pairs, and mirror the caller-supplied trigger metadata.

## Responsibility
Traverse the knowledge graph outward from one or more trigger artifacts to compute a breadth-first set of code impact edges. These edges power the dependency inspector and ripple diagnostics by describing how a saved artifact influences downstream dependents.

## Algorithm Overview
- Input: `GraphStore`, seed `KnowledgeArtifact[]`, optional `{ maxDepth, linkKinds }`.
- Initialises a BFS queue seeded with each trigger (depth 0, empty path) and tracks visited trigger→dependent pairs to prevent duplicates.
- For each dequeued artifact, fetches linked artifacts via `graphStore.listLinkedArtifacts(id)` and filters to *incoming* edges whose `kind` is permitted (defaults to `depends_on`).
- Each accepted edge raises depth by 1, appends the dependent to the traversal path, and emits a `CodeImpactEdge` containing trigger, dependent, link metadata, depth, and path.
- Enqueues the dependent for further exploration until `maxDepth` is reached.

## Defaults & Configuration
- `DEFAULT_MAX_DEPTH = 3` keeps ripple exploration bounded for interactivity.
- `DEFAULT_LINK_KINDS = ["depends_on"]` focuses on code dependencies; callers can widen the set for documentation views.
- `composeVisitKey(triggerId, dependentId)` prevents infinite cycles in strongly connected graphs.

## Output Shape
`CodeImpactEdge` includes:
- `trigger: KnowledgeArtifact` (re-hydrated to the canonical seed object when possible)
- `dependent: KnowledgeArtifact`
- `viaLinkId: string`
- `viaKind: LinkRelationshipKind`
- `depth: number`
- `path: KnowledgeArtifact[]` (ordered, final element = dependent)

## Implementation Notes
- Returns clones referencing the original trigger objects to preserve metadata the `GraphStore` might not yet have (e.g., first-run artifacts).
- Skips self-referential edges (`dependent.id === trigger.id`).
- BFS ordering ensures shallower paths appear first, supporting quick-pick UX that favours immediate neighbours.

## Testing
- Unit tests should mock `GraphStore.listLinkedArtifacts` to assert depth limiting, duplicate suppression, and multi-seed traversal (coverage pending; track under T025).
- Integration suites (US1, US5) indirectly exercise the builder when the dependency inspector and ripple diagnostics request graph data.

## Follow-ups
- Expose optional callback for traversal telemetry (edge count, depth distribution) to aid tuning.
- Support edge-weight filtering if future heuristics require confidence thresholds beyond relationship kind.
