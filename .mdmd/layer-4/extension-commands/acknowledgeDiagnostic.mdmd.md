# Acknowledge Diagnostic Command (Layer 4)

## Source Mapping
- Implementation: [`packages/extension/src/commands/acknowledgeDiagnostic.ts`](../../../packages/extension/src/commands/acknowledgeDiagnostic.ts)
- Integration: [`tests/integration/us3/acknowledgeDiagnostics.test.ts`](../../../tests/integration/us3/acknowledgeDiagnostics.test.ts)
- Server contract: [`ACKNOWLEDGE_DIAGNOSTIC_REQUEST`](../../../packages/shared/src/contracts/diagnostics.ts)
- Related surfaces: [`DocDiagnosticProvider`](../extension-diagnostics/docDiagnosticProvider.mdmd.md), [`Diagnostics Tree View`](../extension-views/diagnosticsTree.mdmd.md)

## Exported Symbols
- `ACKNOWLEDGE_DIAGNOSTIC_COMMAND` — shared command id invoked by quick fixes, tree actions, and tests.
- `AcknowledgementWorkflowOptions` — optional callbacks for reacting to acknowledgement events (e.g., refreshing trees).
- `registerAcknowledgementWorkflow` — binds the command and server notification, pruning client-side diagnostics when records clear.

## Purpose
Provide a single acknowledgement workflow that dual-serves UI gestures (tree view, Problems quick fixes) and server push notifications. The command requests acknowledgement from the language server, surfaces UX feedback, and removes stale diagnostics from the client cache so users immediately see the updated state.

## Responsibilities
1. Validate incoming command context and guard against acknowledgements without persistent `recordId`s.
2. Build the acknowledgement request with the current machine id and send it to the server.
3. Handle `not_found` / `already_acknowledged` outcomes by pruning diagnostics locally and communicating status.
4. Surface success/failure toasts that inform the user who acknowledged a diagnostic and when.
5. Listen for `DIAGNOSTIC_ACKNOWLEDGED_NOTIFICATION` messages to react to acknowledgements originating from other clients.

## Error Handling
- Missing command context emits non-blocking warnings instead of throwing.
- RPC failures surface error toasts and leave local diagnostics untouched.
- URI parsing failures during pruning are caught and logged to avoid breaking the acknowledgement pipeline.

## Evidence
- [`tests/integration/us3/acknowledgeDiagnostics.test.ts`](../../../tests/integration/us3/acknowledgeDiagnostics.test.ts) verifies diagnostics disappear after acknowledgement, covering both command and tree view pathways.
