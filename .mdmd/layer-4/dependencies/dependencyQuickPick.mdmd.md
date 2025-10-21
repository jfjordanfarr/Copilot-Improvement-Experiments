# Dependency Quick Pick (Layer 4)

## Source Mapping
- Implementation: [`packages/extension/src/diagnostics/dependencyQuickPick.ts`](../../../packages/extension/src/diagnostics/dependencyQuickPick.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Extension Surfaces Architecture](../../layer-3/extension-surfaces.mdmd.md)
- Spec references: [FR-007](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T024](../../../specs/001-link-aware-diagnostics/tasks.md)

## Responsibility
Surface an interactive Quick Pick that lists downstream artifacts affected by the currently opened file. Bridges the language client's `INSPECT_DEPENDENCIES_REQUEST` to VS Code navigation so implementers can jump directly to ripple targets without waiting for diagnostics.

## Command Surface
- Registers `linkDiagnostics.inspectDependencies` during extension activation.
- Accepts an explicit `vscode.Uri`/`string` argument or falls back to the active editor's document.
- Displays a modal Quick Pick whose entries open the dependent file when selected.

## Request / Response Contract
- Sends `InspectDependenciesParams { uri: string }` to the language server via `LanguageClient.sendRequest`.
- Validates the response with `InspectDependenciesResultSchema` (zod) to guard against contract drift.
- Expected payload fields:
  - `trigger: KnowledgeArtifact | undefined`
  - `edges: { dependent, viaLinkId, viaKind, depth, path[] }[]`
  - `summary: { totalDependents, maxDepthReached }`

## UX Behaviour
1. Resolve target URI; prompt user if none is available.
2. Fetch dependency graph; on failure, show `showErrorMessage` with details.
3. If no trigger or zero edges, show informational messages explaining the absence of data.
4. Populate Quick Pick rows with relative workspace paths, relationship kind, depth, and optional path detail (`via A → B`).
5. Opening a selection loads the dependent document in a non-preview editor.

## Error Handling
- `sendRequest` exceptions and schema violations surface as user-facing error toasts.
- Invalid URI inputs short-circuit with a friendly tip to open a file first.
- File open failures (missing/permission) show a dedicated toast but keep the quick pick responsive.

## Testing
- Unit tests should stub `LanguageClient` to return canned dependency graphs, asserting Quick Pick formatting and selection handling. (Coverage pending; tracked in T024 follow-up.)
- Integration suites (US1) implicitly exercise the command by verifying ripple metadata is inspectable post-diagnostic.

## Follow-ups
- Cache the last inspection result to allow back navigation or compare deltas.
- Add multi-select export (copy to clipboard) once acknowledgement workflows require sharing ripple summaries.
