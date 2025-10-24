# Symbols Contracts (Layer 4)

**Created:** 2025-10-20 *(from git history)*  
**Last Edited:** 2025-10-23

## Source Mapping
- Implementation: [`packages/shared/src/contracts/symbols.ts`](../../../packages/shared/src/contracts/symbols.ts)
- Parent designs: [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md), [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md)
- Spec references: [FR-007](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T024](../../../specs/001-link-aware-diagnostics/tasks.md), [T063–T066](../../../specs/001-link-aware-diagnostics/tasks.md)

## Purpose
This file defines the language-server <-> extension contracts for symbol collection and inspection. It exists so both sides share a single TypeScript source of truth for request identifiers, payload shapes, and result summaries, preventing drift between client/ server implementations.

## Public Interfaces
- `COLLECT_WORKSPACE_SYMBOLS_REQUEST` and supporting params/results for seeding the knowledge graph.
- **New:** `INSPECT_SYMBOL_NEIGHBORS_REQUEST` powering symbol-neighbor traversal.
  - `InspectSymbolNeighborsParams` exposes `artifactId`, optional `maxDepth`, `maxResults`, and `linkKinds` filters.
  - Response types include `SymbolNeighborNode`, `SymbolNeighborGroup`, and `InspectSymbolNeighborsSummary`, all reused by server handlers and extension UI.
- Shared path helpers: `SymbolNeighborPath` wraps ordered artifact hops for UI presentation.

## Key Collaborators
- Server implementation: [`symbolNeighbors.ts`](../../../packages/server/src/features/dependencies/symbolNeighbors.ts) returns data adhering to these contracts.
- Future extension command (T066) and diagnostics surfaces consume the same types for Quick Pick rendering.
- Validation layers (e.g., `zod` schemas in the extension) rely on these interfaces to mirror expected shapes.

## Recent Changes
- Added `INSPECT_SYMBOL_NEIGHBORS_REQUEST` along with neighbor node/group/summary types so server traversal can return grouped, confidence-ranked neighbors.
- Re-exporting the file through `packages/shared/src/index.ts` ensures both server and extension import identical types.

## Testing
- Indirect coverage: [`symbolNeighbors.test.ts`](../../../packages/server/src/features/dependencies/symbolNeighbors.test.ts) imports these interfaces to enforce structural compatibility during traversal.
- Contract validation tests are still pending; once the LSP route and extension command are wired, add schema assertions in the extension (`packages/extension/src/diagnostics/**`) and integration coverage under `tests/integration/us4` (tracked via T066).

## Rationale
Storing request/response contracts in a shared package prevents the language client, language server, and supporting tooling from diverging. The neighbor inspection addition is a prerequisite for the upcoming server router and command wiring tasks; without codifying the payload shapes here, we would risk brittle string constants and duplicated interface definitions across packages.
