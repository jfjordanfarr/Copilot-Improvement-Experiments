# DocDiagnosticProvider (Layer 4)

## Source Mapping
- Implementation: [`packages/extension/src/diagnostics/docDiagnosticProvider.ts`](../../../packages/extension/src/diagnostics/docDiagnosticProvider.ts)
- Parent design: [Extension Surfaces Architecture](../../layer-3/extension-surfaces.mdmd.md)
- Spec references: [US1](../../../specs/001-link-aware-diagnostics/spec.md#user-story-1-developers-see-code-change-impact), [US2](../../../specs/001-link-aware-diagnostics/spec.md#user-story-2-writers-get-drift-alerts), [FR-011](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-015](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements)

## Responsibility
Registers the VS Code quick-fix surface for link-aware diagnostics. Provides context-aware actions that open the originating artifact for both documentation drift (`doc-drift`) and code ripple (`code-ripple`) diagnostics, and exposes a detail viewer so engineers can inspect ripple metadata (depth, relationship kind, confidence, path) without leaving the editor.

## Dependencies
- VS Code `languages.registerCodeActionsProvider` for Problems/Quick Fix integration
- VS Code command API for `linkDiagnostics.openLinkedArtifact` and `linkDiagnostics.viewRippleDetails`
- Workspace helper utilities (`workspace.asRelativePath`, `Uri.parse`) for path formatting
- Diagnostic payload schema emitted by the language server (`publishDocDiagnostics`, `publishCodeDiagnostics`)

## Data Contracts
- Diagnostic `data` payload consumed:
  - `triggerUri: string` – canonical file that triggered the diagnostic (required)
  - `dependentUri?: string` / `targetUri?: string` – dependent file receiving the diagnostic
  - `relationshipKind?: string` – edge type (documents, implements, depends_on, references)
  - `confidence?: number` – ripple analyzer confidence (0–1)
  - `depth?: number` – graph hop distance
  - `path?: string[]` – ordered hop URIs including intermediate artifacts
  - `changeEventId?: string` – originating change identifier (logged only)
  - `linkId?: string` (legacy) – retained for backwards compatibility
- Command arguments:
  - `linkDiagnostics.openLinkedArtifact(triggerUri: string | Uri)`
  - `linkDiagnostics.viewRippleDetails(LinkDiagnosticData)`

## Core Flow
1. **Registration** – subscribe to file-like document selectors (markdown, plaintext, TS/JS/JSX/TSX) and attach the `LinkDiagnosticCodeActionProvider`.
2. **Action discovery** – for each diagnostic matched by `doc-drift` or `code-ripple`, parse metadata, build an "open" quick fix title contextualised by relationship kind, and register command execution payload.
3. **Ripple inspection** – expose a secondary quick fix for `code-ripple` diagnostics that launches a Quick Pick listing the trigger, intermediate path, and dependent artifacts; selections open the chosen file for investigation.
4. **Command execution** – `openLinkedArtifact` opens the source document; `viewRippleDetails` renders metadata summary and handles navigation to any hop in the ripple chain.

## Failure Modes & Guards
- Missing or invalid `triggerUri` aborts quick-fix creation to avoid broken commands.
- Invalid URIs in ripple metadata are filtered out before populating quick-pick items.
- Empty metadata still surfaces user feedback via an informational message to prevent silent failures.

## Observability & UX Notes
- Quick Fix titles adapt to relationship kind (e.g., "Open linked dependency" for `depends_on`).
- Ripple summary placeholder highlights relationship, depth, confidence, and intermediate hops using relative workspace paths for readability.
- Duplicate quick-pick entries collapse to a single row to avoid noisy lists when trigger and dependent overlap.

## Testing Notes
- `packages/extension/src/diagnostics/docDiagnosticProvider.test.ts` validates relationship-aware titles, confidence formatting, and ripple summary composition.
- Integration suites (`tests/integration/us1/codeImpact.test.ts`, `tests/integration/us2/markdownDrift.test.ts`) exercise the provider implicitly by asserting quick-fix availability post-diagnostic publication.

## Follow-ups
- Add hover tooltips that surface the same ripple metadata inline with the Problems entry.
- Consider persisting the last ripple metadata view to aid acknowledgement flows planned for US3 (T042).
