# Symbol Collection Contracts (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/contracts/symbols.ts`](../../../packages/shared/src/contracts/symbols.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md)

## Exported Symbols

#### COLLECT_WORKSPACE_SYMBOLS_REQUEST
`COLLECT_WORKSPACE_SYMBOLS_REQUEST` is the LSP request id used to ask the server for workspace symbol contributions.

#### CollectWorkspaceSymbolsParams
`CollectWorkspaceSymbolsParams` contains the artifact seeds and optional seed limit used when collecting workspace symbols.

#### CollectWorkspaceSymbolsResultSummary
`CollectWorkspaceSymbolsResultSummary` describes analysis metrics (files, symbols, references, duration) returned alongside symbol results.

#### CollectWorkspaceSymbolsResult
`CollectWorkspaceSymbolsResult` wraps the workspace link contribution plus optional summary metrics for client display.

#### INSPECT_SYMBOL_NEIGHBORS_REQUEST
`INSPECT_SYMBOL_NEIGHBORS_REQUEST` identifies the request for inspecting upstream/downstream symbol neighbors.

#### InspectSymbolNeighborsParams
`InspectSymbolNeighborsParams` provides artifact identifiers, traversal limits, and link filters for neighbor inspection.

#### SymbolNeighborPath
`SymbolNeighborPath` records the ordered artifacts traversed from the origin to a neighbor.

#### SymbolNeighborNode
`SymbolNeighborNode` describes a neighbor artifact, traversal direction, link metadata, confidence, and path taken.

#### SymbolNeighborGroup
`SymbolNeighborGroup` groups neighbor nodes by link relationship kind for presentation.

#### InspectSymbolNeighborsSummary
`InspectSymbolNeighborsSummary` returns aggregate counts for the neighbor set (total neighbors, max depth reached).

#### InspectSymbolNeighborsResult
`InspectSymbolNeighborsResult` bundles the origin artifact, grouped neighbors, and the summary payload.

## Responsibility
Define the contracts that power workspace symbol collection and neighbor inspection so the extension and server can share traversal settings, outputs, and metrics.

## Evidence
- The diagnostics explorer and CLI tooling (see [`scripts/graph-tools/inspect-symbol.ts`](../../../scripts/graph-tools/inspect-symbol.ts)) rely on these types when requesting neighbor data from the server.
