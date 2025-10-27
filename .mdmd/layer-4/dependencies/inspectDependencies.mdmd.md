# inspectDependencies (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/dependencies/inspectDependencies.ts`](../../../packages/server/src/features/dependencies/inspectDependencies.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)
- Spec references: [FR-007](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T024](../../../specs/001-link-aware-diagnostics/tasks.md)

## Exported Symbols

#### InspectDependenciesOptions
`InspectDependenciesOptions` carries the `GraphStore`, canonical workspace URI, and optional traversal overrides (`maxDepth`, `linkKinds`) so callers can tailor the dependency neighbourhood they want to analyse.

#### inspectDependencies
`inspectDependencies` normalises the requested URI, resolves the trigger artifact, invokes `buildCodeImpactGraph`, and returns an `InspectDependenciesResult` summarising dependents and maximum depth for the extension UI.

## Responsibility
Serve the `INSPECT_DEPENDENCIES_REQUEST` handler by normalising the requested URI, locating the corresponding artifact in the `GraphStore`, invoking `buildCodeImpactGraph`, and projecting the results into the shared `InspectDependenciesResult` contract consumed by the extension's dependency quick pick.

## Execution Flow
1. **Normalise URI** – canonicalise the incoming path via `normalizeFileUri` to avoid duplicate lookups caused by path casing or scheme differences.
2. **Resolve Trigger** – fetch the `KnowledgeArtifact` from the graph store by canonical URI (fallback to raw URI).
3. **Traverse** – call `buildCodeImpactGraph` with optional depth/kind overrides supplied through `InspectDependenciesOptions`.
4. **Project** – map `CodeImpactEdge` entries into `DependencyGraphEdge` payloads (`dependent`, `viaKind`, `viaLinkId`, `depth`, `path`).
5. **Summarise** – compute `totalDependents` and `maxDepthReached` for quick pick messaging.
6. **Return** – when no artifact exists, return `{ trigger: undefined, edges: [], summary: {0,0} }`.

## Runtime Settings Hooks
- Respects `maxDepth`/`linkKinds` overrides passed in from runtime settings (defaults derived in `settingsBridge.ts`).
- Maintains URI normalisation so diagnostics + quick pick share identical artifact identities.

## Error Handling
- Missing artifacts yield an empty response instead of throwing, allowing the extension to show a user-friendly "No dependency information" message.
- Paths normalised even when the graph lacks the artifact, ensuring downstream logs use consistent URIs for debugging.

## Testing
- Unit coverage should stub `GraphStore` to return canned artifacts and ensure depth + summary computations behave as expected (coverage pending, tracked under T024).
- Integration suites (US1) exercise end-to-end flow by calling into the command and inspecting ripple metadata.

## Follow-ups
- Extend summary to include relationship-kind breakdown once acknowledgement dashboards land.
- Allow batching multiple trigger URIs to support bulk inspections from future UI affordances.
