# packages/extension/src/commands/acknowledgeDiagnostic.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/commands/acknowledgeDiagnostic.ts
- Live Doc ID: LD-implementation-packages-extension-src-commands-acknowledgediagnostic-ts
- Generated At: 2025-11-09T22:52:09.116Z

## Authored
### Purpose
Registers the `linkDiagnostics.acknowledgeDiagnostic` command so users can clear server-tracked diagnostics from the editor once they have been addressed.

### Notes
- Validates that the selected diagnostic carries a persisted record id, falling back to toast warnings when context is missing.
- Dispatches an acknowledgement request to the language server, then prunes the matching diagnostic from the client collection and shows the resulting status to the user.
- Listens for acknowledgement notifications to keep other editors in sync and forwards successful payloads to optional workflow callbacks.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:09.116Z","inputHash":"03f9b9d513fd6b37"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ACKNOWLEDGE_DIAGNOSTIC_COMMAND`
- Type: const
- Source: [source](../../../../../../packages/extension/src/commands/acknowledgeDiagnostic.ts#L12)

#### `AcknowledgementWorkflowOptions`
- Type: interface
- Source: [source](../../../../../../packages/extension/src/commands/acknowledgeDiagnostic.ts#L20)

#### `registerAcknowledgementWorkflow`
- Type: function
- Source: [source](../../../../../../packages/extension/src/commands/acknowledgeDiagnostic.ts#L24)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `ACKNOWLEDGE_DIAGNOSTIC_REQUEST`, `AcknowledgeDiagnosticParams`, `AcknowledgeDiagnosticResult`, `DIAGNOSTIC_ACKNOWLEDGED_NOTIFICATION`, `DiagnosticAcknowledgedPayload`
- `vscode` - `vscode`
- `vscode-languageclient/node` - `LanguageClient`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [docDiagnosticProvider.test.ts](../diagnostics/docDiagnosticProvider.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
