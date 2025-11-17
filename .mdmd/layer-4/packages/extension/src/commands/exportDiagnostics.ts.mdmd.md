# packages/extension/src/commands/exportDiagnostics.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/commands/exportDiagnostics.ts
- Live Doc ID: LD-implementation-packages-extension-src-commands-exportdiagnostics-ts
- Generated At: 2025-11-16T22:35:14.337Z

## Authored
### Purpose
Exports outstanding diagnostics to CSV or JSON so leads can archive triage status and acknowledgements outside VS Code, completing T045 as recorded in Turn 03 of [AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-22.SUMMARIZED.md#turn-03-option-a-execution--t044t045-close-out-lines-521-1180](../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-22.SUMMARIZED.md#turn-03-option-a-execution--t044t045-close-out-lines-521-1180).

### Notes
- Implementation details (format selection, save dialog, quick pick wiring, unit coverage) are documented in [AI-Agent-Workspace/ChatHistory/2025/10/2025-10-22.md#L1460-L1545](../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-22.md#L1460-L1545); keep CSV escaping and JSON payloads aligned with that spec.
- Pending acceptance criteria still call for acknowledgement metadata in exports, as highlighted later that day - track completion against [AI-Agent-Workspace/ChatHistory/2025/10/2025-10-22.md#L2720-L3410](../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-22.md#L2720-L3410).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:14.337Z","inputHash":"83d8ad46007abd97"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `EXPORT_DIAGNOSTICS_COMMAND`
- Type: const
- Source: [source](../../../../../../packages/extension/src/commands/exportDiagnostics.ts#L11)

#### `registerExportDiagnosticsCommand`
- Type: function
- Source: [source](../../../../../../packages/extension/src/commands/exportDiagnostics.ts#L67)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs/promises` - `fs`
- `node:path` - `path`
- [`index.LIST_OUTSTANDING_DIAGNOSTICS_REQUEST`](../../../shared/src/index.ts.mdmd.md#list_outstanding_diagnostics_request)
- [`index.ListOutstandingDiagnosticsResult`](../../../shared/src/index.ts.mdmd.md#listoutstandingdiagnosticsresult)
- `vscode` - `vscode`
- `vscode-languageclient/node` - `LanguageClient`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [exportDiagnostics.test.ts](./exportDiagnostics.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
