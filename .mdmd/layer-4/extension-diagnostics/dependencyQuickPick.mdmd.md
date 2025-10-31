# Dependency Quick Pick

## Metadata
- Layer: 4
- Implementation ID: IMP-107
- Code Path: [`packages/extension/src/diagnostics/dependencyQuickPick.ts`](../../../packages/extension/src/diagnostics/dependencyQuickPick.ts)
- Exports: registerDependencyQuickPick, DependencyQuickPickController, describeEdgePath, InspectDependenciesResultValidator

## Purpose
Power the `linkDiagnostics.inspectDependencies` command so users can explore downstream ripple targets via a VS Code quick pick backed by the dependency inspection LSP request.

## Public Symbols

### registerDependencyQuickPick
Registers the command handler, wires dependency validation, and returns a disposable for extension activation.

### DependencyQuickPickController
Encapsulates command logic—target detection, request dispatch, result presentation—so unit tests and future surfaces can reuse the workflow.

### describeEdgePath
Formats transitive dependency paths (for example, `via docs/api.md → src/service.ts`) into quick-pick detail strings.

### InspectDependenciesResultValidator
Zod schema that defends the client against malformed `INSPECT_DEPENDENCIES_REQUEST` responses before rendering UI.

## Responsibilities
- Resolve the inspection target from command arguments or active editor and bail gracefully when nothing is selected.
- Issue `INSPECT_DEPENDENCIES_REQUEST`, validate payloads, and surface empty results with informational toasts instead of empty pickers.
- Present workspace-relative labels with relationship detail and open the selected document once chosen.
- Handle errors with actionable `showErrorMessage` notifications and avoid crashing command execution.

## Collaborators
- [`packages/shared/src/contracts/dependencies.ts`](../../../packages/shared/src/contracts/dependencies.ts) supplies inspection request/response contracts.
- Diagnostics tree view ([Diagnostics Tree](../extension-views/diagnosticsTree.mdmd.md)) links into the same dependency narratives for consistent UX.
- VS Code `window.showQuickPick` and `workspace.openTextDocument` APIs deliver the UX scaffolding.

## Linked Components
- [COMP-002 – Extension Surfaces](../../layer-3/extension-surfaces.mdmd.md)
- [COMP-001 – Diagnostics Pipeline](../../layer-3/diagnostics-pipeline.mdmd.md)

## Evidence
- Unit tests: [`packages/extension/src/diagnostics/dependencyQuickPick.test.ts`](../../../packages/extension/src/diagnostics/dependencyQuickPick.test.ts) cover happy paths, validation failures, and formatting helpers.
- Integration coverage: dependency exploration exercised via CLI equivalents (`inspectSymbolNeighbors`) and extension smoke tests.

## Operational Notes
- Observability currently delegated to VS Code toasts; consider telemetry once adoption metrics require visibility.
- Shared validator ensures tooling surfaces (extension, CLI) remain consistent when contracts evolve.
