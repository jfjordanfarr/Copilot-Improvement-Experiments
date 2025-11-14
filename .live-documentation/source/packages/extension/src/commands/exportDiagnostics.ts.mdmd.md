# packages/extension/src/commands/exportDiagnostics.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/commands/exportDiagnostics.ts
- Live Doc ID: LD-implementation-packages-extension-src-commands-exportdiagnostics-ts
- Generated At: 2025-11-14T18:42:06.142Z

## Authored
### Purpose
Implements the `linkDiagnostics.exportDiagnostics` command that serializes outstanding diagnostics to a user-chosen CSV or JSON file.

### Notes
- Offers format selection via quick pick, then retrieves the latest diagnostics snapshot from the language server.
- Normalizes URIs for readability, applies format-specific serialization, and prompts for a destination using sensible workspace-aware defaults.
- Persists the export via Node FS APIs, optionally reopens the file, and reports errors through toast messaging.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.142Z","inputHash":"72f5b6971308d228"}]} -->
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
- `@copilot-improvement/shared` - `LIST_OUTSTANDING_DIAGNOSTICS_REQUEST`, `ListOutstandingDiagnosticsResult`
- `node:fs/promises` - `fs`
- `node:path` - `path`
- `vscode` - `vscode`
- `vscode-languageclient/node` - `LanguageClient`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [exportDiagnostics.test.ts](./exportDiagnostics.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
