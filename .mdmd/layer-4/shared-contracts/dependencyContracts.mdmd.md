# Dependency Inspection Contracts (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/contracts/dependencies.ts`](../../../packages/shared/src/contracts/dependencies.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md)

## Exported Symbols

#### INSPECT_DEPENDENCIES_REQUEST
`INSPECT_DEPENDENCIES_REQUEST` is the LSP request identifier the extension uses to ask the server for dependency graph data.

#### InspectDependenciesParams
`InspectDependenciesParams` specifies the artifact URI and optional traversal constraints (max depth, link kinds) for dependency inspection.

#### DependencyGraphEdge
`DependencyGraphEdge` represents a single dependent node, including the traversed path, the link used, and the depth.

#### InspectDependenciesSummary
`InspectDependenciesSummary` captures aggregate metrics for the inspection (total dependents discovered and the deepest traversal).

#### InspectDependenciesResult
`InspectDependenciesResult` returns the trigger artifact (if resolved), the discovered dependency edges, and the summary payload consumed by the client.

## Responsibility
Define the request/response payloads for the dependency inspection feature so the extension and server share a stable contract when surfacing ripple information to developers.

## Evidence
- Exercised by the extension’s dependency quick pick (see [`packages/extension/src/diagnostics/dependencyQuickPick.ts`](../../../packages/extension/src/diagnostics/dependencyQuickPick.ts)), which relies on the summary and edge data to render ripple impact lists.
