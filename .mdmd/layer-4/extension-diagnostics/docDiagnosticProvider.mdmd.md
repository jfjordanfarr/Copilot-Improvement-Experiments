# DocDiagnosticProvider

## Metadata
- Layer: 4
- Implementation ID: IMP-101
- Code Path: [`packages/extension/src/diagnostics/docDiagnosticProvider.ts`](../../../packages/extension/src/diagnostics/docDiagnosticProvider.ts)
- Exports: OPEN_LINKED_ARTIFACT_COMMAND, VIEW_RIPPLE_DETAILS_COMMAND, registerDocDiagnosticProvider, buildOpenActionTitle, buildRippleSummary, formatConfidenceLabel

## Purpose
Register the VS Code quick-fix surface for link-aware diagnostics so engineers can open the originating artifact or inspect ripple metadata directly from Problems entries.

## Public Symbols

### OPEN_LINKED_ARTIFACT_COMMAND
Identifier reused wherever diagnostics jump back to the triggering artifact.

### VIEW_RIPPLE_DETAILS_COMMAND
Identifier that launches ripple inspection quick picks for dependent files.

### registerDocDiagnosticProvider
Binds the provider, registers commands, and wires up diagnostic selectors for markdown and code documents.

### buildOpenActionTitle
Generates relationship-aware quick fix titles (e.g., “Open linked dependency”).

### buildRippleSummary
Composes the ripple placeholder text shared between quick fixes and notifications, including depth and confidence labels.

### formatConfidenceLabel
Normalises raw confidence values into human-readable percentages for display.

## Collaborators
- VS Code `languages.registerCodeActionsProvider` and `commands.registerCommand` APIs to surface quick fixes and commands.
- Language server diagnostics publishers (`publishDocDiagnostics`, `publishCodeDiagnostics`) for payload schema.
- Ripple metadata helpers (`workspace.asRelativePath`, URI utilities) to format navigation targets.

## Linked Components
- [COMP-001 – Diagnostics Pipeline](../../layer-3/diagnostics-pipeline.mdmd.md)
- [COMP-002 – Extension Surfaces](../../layer-3/extension-surfaces.mdmd.md)

## Evidence
- Unit coverage: `packages/extension/src/diagnostics/docDiagnosticProvider.test.ts` validates action titles, summaries, and confidence formatting.
- Integration coverage: `tests/integration/us1/codeImpact.test.ts` and `tests/integration/us2/markdownDrift.test.ts` assert quick-fix availability after diagnostics publish.
- Safe-to-commit: chained runs on 2025-10-29 captured regressions when quick fix registration drifted.

## Operational Notes
- Missing or invalid `triggerUri` aborts quick-fix creation to avoid broken commands; errors surface via informational toasts.
- Duplicate ripple entries collapse to a single quick-pick row to keep UX concise.
- Future enhancement: add hover tooltips that reuse `buildRippleSummary` so metadata appears without opening the quick pick.
