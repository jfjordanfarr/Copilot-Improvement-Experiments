# Symbol Neighbor Traversal (Layer 4)

**Created:** 2025-10-23  
**Last Edited:** 2025-10-23

## Source Mapping
- Implementation: [`packages/server/src/features/dependencies/symbolNeighbors.ts`](../../../packages/server/src/features/dependencies/symbolNeighbors.ts)
- Primary contract: [`INSPECT_SYMBOL_NEIGHBORS_REQUEST` in `packages/shared/src/contracts/symbols.ts`](../../../packages/shared/src/contracts/symbols.ts)
- Parent designs: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)
- Spec references: [T063](../../../specs/001-link-aware-diagnostics/tasks.md), [T064](../../../specs/001-link-aware-diagnostics/tasks.md), [T065](../../../specs/001-link-aware-diagnostics/tasks.md)

## Exported Symbols

#### InspectSymbolNeighborsOptions
`InspectSymbolNeighborsOptions` bundles the `GraphStore` handle plus optional `artifactId`, `artifactUri`, traversal depth, result limits, and relationship filters so callers can tailor how much of the neighborhood to explore.

#### inspectSymbolNeighbors
`inspectSymbolNeighbors` walks the knowledge graph breadth-first around the origin artifact, returning an `InspectSymbolNeighborsResult` that groups neighbors by link kind and reports summary metrics for the dependency inspector.

## Purpose
This module computes the transitive neighborhood around a knowledge artifact so Copilot can answer "what else does this symbol touch?" without forcing the extension to materialise the graph client-side. It exists to provide a canonical, server-side traversal that powers dependency-aware diagnostics and upcoming symbol-inspection commands.

## Responsibilities
1. Resolve the requested artifact by identifier or URI and normalise its URI for stable comparisons.
2. Perform a breadth-first search across `GraphStore` links, respecting hop depth, result count, and optional relationship-kind filters.
3. Group discovered neighbors by relationship kind, ordering each group by confidence then traversal depth so the UI can prioritise the strongest links.
4. Capture traversal metadata (direction, via link id/kind, path) that downstream consumers surface for traceability.
5. Return a deterministic summary (`totalNeighbors`, `maxDepthReached`) to drive quick-pick messaging and diagnostics copy.

## Public Interfaces
- `inspectSymbolNeighbors(options: InspectSymbolNeighborsOptions): InspectSymbolNeighborsResult`
  - **Options**: `graphStore`, target `artifactId` **or** `artifactUri`, optional `maxDepth`, `maxResults`, and `linkKinds` filter.
  - **Result**: origin artifact details (when found), grouped neighbors (`SymbolNeighborGroup[]`), and traversal summary.
- Internal helpers:
  - `updateNeighbor` refreshes stored neighbor nodes when a shorter path or higher-confidence edge is discovered.
  - `buildGroups` materialises sorted `SymbolNeighborGroup` collections for response consumption.

## Key Collaborators
- `GraphStore.listLinkedArtifacts` is the sole graph data source; traversal logic assumes the new `confidence` column is present in each `LinkedArtifactSummary`.
- `normalizeFileUri` guarantees path comparisons remain stable across Windows/Linux URI variants.
- `@copilot-improvement/shared` contracts define the shape consumed by the VS Code extension and integration tests.

## Failure & Guard Rails
- Missing origin artifacts short-circuit with an empty response instead of throwing, allowing UI to show "no data" states gracefully.
- Queue growth is bounded by `maxResults` to keep traversal latency predictable.
- Duplicate neighbor ids are deduplicated while preserving the highest-confidence, shallowest path.

## Testing
- Unit suite: [`packages/server/src/features/dependencies/symbolNeighbors.test.ts`](../../../packages/server/src/features/dependencies/symbolNeighbors.test.ts)
  - Covers grouping and ordering by confidence, maximum hop enforcement, and relationship-kind filtering.
  - Uses the in-memory `GraphStore` to exercise real persistence queries while keeping tests hermetic.
- Integration coverage: [`tests/integration/us4/inspectSymbolNeighbors.test.ts`](../../../tests/integration/us4/inspectSymbolNeighbors.test.ts) verifies the LSP command surfaces sane messaging with the live language client.

## Rationale
Without this abstraction, every caller would need to reimplement BFS over the knowledge graph and keep contract types in sync. Centralising the traversal avoids duplicated logic, enforces consistent ordering semantics, and positions us to add cross-feature telemetry in one place. The file is therefore justified as the authoritative implementation of symbol-neighbor exploration.
