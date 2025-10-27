# Diagnostics Tree View (Layer 4)

## Source Mapping
- Implementation: [`packages/extension/src/views/diagnosticsTree.ts`](../../../packages/extension/src/views/diagnosticsTree.ts)
- Commands: [`linkDiagnostics.refreshDiagnosticsTree`, `linkDiagnostics.acknowledgeDiagnosticFromTree`](../../../packages/extension/src/views/diagnosticsTree.ts)
- Shared contract: [`ListOutstandingDiagnosticsResult`](../../../packages/shared/src/contracts/diagnostics.ts)
- Related server doc: [PublishDocDiagnostics](../server-diagnostics/publishDocDiagnostics.mdmd.md)

## Exported Symbols
- `TreeNode` — discriminated union representing tree targets and individual diagnostics.
- `DiagnosticsTreeDataProvider` — VS Code tree provider and refreshable snapshot cache.
- `isDiagnosticNode` — type guard used by commands before acknowledging diagnostics.
- `buildTreeAcknowledgementArgs` — command helper that extracts acknowledgement payloads from nodes.
- `DiagnosticsTreeRegistration` — disposable handle exposing the provider instance.
- `registerDiagnosticsTreeView` — activation entry point that binds the provider and commands.

## Responsibility
Render outstanding diagnostics in a tree view grouped by target artifact. Allows users to open files with unresolved issues, acknowledge individual diagnostics, review AI-generated assessments, and refresh the snapshot pulled from the language server.

## Key Concepts
- **DiagnosticsTreeDataProvider**: Implements `TreeDataProvider` with lazy snapshot fetching, grouping, and sorting logic.
- **Target vs. diagnostic nodes**: Top-level nodes represent artifacts; their children represent individual unresolved diagnostics.
- **Snapshot caching**: Avoids repeated RPC calls by caching the last response and supporting manual refresh.
- **LLM assessments**: Diagnostic nodes render AI summaries, confidence scores, and recommended actions sourced from `OutstandingDiagnosticSummary.llmAssessment` when present.

## Public API
- `registerDiagnosticsTreeView(client): DiagnosticsTreeRegistration`
- `DiagnosticsTreeDataProvider.refresh(): Promise<void>`
- `buildTreeAcknowledgementArgs(node)` helper for command plumbing.

## Internal Flow
1. Register the tree provider, view, and associated commands (refresh + acknowledge) during extension activation.
2. On first expansion or refresh, request `LIST_OUTSTANDING_DIAGNOSTICS_REQUEST` from the language client and cache the result.
3. Build target nodes by grouping diagnostics by target URI/ID, sorting both groups and diagnostics for stable display.
4. Generate diagnostic node items with severity icons, timestamps, triggers, tooltips (including AI summaries), and open-file commands.
5. When acknowledge command executes, forward node details to `linkDiagnostics.acknowledgeDiagnostic` with associated URIs.

## Error Handling
- If snapshot retrieval fails, provider logs an error message and supplies an empty snapshot to avoid breaking the view.
- UI gracefully handles empty snapshots by displaying no nodes and offering refresh.
- Acknowledge command validates node type before executing downstream commands, warning users when nothing is selected.

## Observability Hooks
- Uses user notifications (`showErrorMessage`, `showWarningMessage`) for retrieval failures and acknowledgement misuse.
- Node tooltips summarize context, including change event IDs, related link identifiers, and AI assessment snippets to aid manual investigation.

## Integration Notes
- Tree view ID `linkDiagnostics.diagnosticsTree` matches package contributions to surface view in VS Code Activity Bar.
- Acknowledge command integrates with server acknowledgement service, ensuring UI actions update drift tracking.
- Snapshot builder sorts newest diagnostics first within each target to highlight recent issues.
