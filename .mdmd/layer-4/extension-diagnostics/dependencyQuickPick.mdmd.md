# Dependency Quick Pick (Layer 4)

## Source Mapping
- Implementation: [`packages/extension/src/diagnostics/dependencyQuickPick.ts`](../../../packages/extension/src/diagnostics/dependencyQuickPick.ts)
- Tests: [`packages/extension/src/diagnostics/dependencyQuickPick.test.ts`](../../../packages/extension/src/diagnostics/dependencyQuickPick.test.ts)
- Server contract: [`INSPECT_DEPENDENCIES_REQUEST`](../../../packages/shared/src/contracts/dependencies.ts)
- Related UI: [Diagnostics Tree](../extension-views/diagnosticsTree.mdmd.md)

## Responsibility
Provide the `linkDiagnostics.inspectDependencies` command that displays downstream artifacts impacted by a selected file. Presents a quick pick listing dependents surfaced by the server’s dependency inspection endpoint and opens the chosen artifact in the editor.

## Key Concepts
- **DependencyQuickPickController**: Encapsulates the command handler logic and validation, enabling reuse and testing.
- **Zod validation**: `InspectDependenciesResultSchema` hardens the client against malformed server responses before presenting data.
- **Edge description**: `describeEdgePath` summarizes transitive chains (e.g., `via docs/api.md → src/service.ts`) to contextualize deeper dependencies.

## Exported Symbols

#### registerDependencyQuickPick
The `registerDependencyQuickPick` function instantiates the controller and binds the VS Code command identifier.

#### DependencyQuickPickController
The `DependencyQuickPickController` class exposes the show workflow for reuse in tests and other command surfaces.

#### describeEdgePath
The `describeEdgePath` helper summarizes transitive dependency paths for quick-pick detail strings.

#### InspectDependenciesResultValidator
The `InspectDependenciesResultValidator` schema allows downstream consumers to validate dependency inspection payloads.

## Internal Flow
1. Resolve the target URI from command arguments or the active editor; surface an info toast when nothing is selected.
2. Issue `INSPECT_DEPENDENCIES_REQUEST` to the language client and validate the payload via Zod schemas.
3. Handle empty results with informational messages to avoid displaying empty quick picks.
4. Transform edges into quick pick items with relative path labels, detail strings for transitive paths, and open the selected document.
5. Report any request/IO errors with actionable messages.

## Error Handling
- Gracefully handles cancellations (no selection) by returning early with no toast.
- Exceptions from request, schema validation, or document open render descriptive error notifications to the user.

## Observability Hooks
- Relies on VS Code to display info/error notifications; no custom telemetry yet.

## Integration Notes
- Quick pick formatting relies on workspace-relative paths so teams operating in large repos can identify files quickly.
- Schema validation shares `KnowledgeArtifactSchema` and `LinkRelationshipKindSchema`, keeping the client in sync with shared contracts.
- Tests exercise happy paths, validation failures, and helper formatting to guard against regressions in UI presentation.
