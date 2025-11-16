# packages/extension/src/views/diagnosticsTree.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/views/diagnosticsTree.ts
- Live Doc ID: LD-implementation-packages-extension-src-views-diagnosticstree-ts
- Generated At: 2025-11-16T02:09:51.158Z

## Authored
### Purpose
Renders outstanding Link-Aware Diagnostics in a tree view grouped by target artifact and hooks tree interactions into existing commands.

### Notes
- Fetches diagnostic snapshots from the language server on demand, caching responses and handling concurrent refreshes gracefully.
- Builds parent nodes per target URI, sorts diagnostics by recency, and decorates leaf nodes with tooltips, icons, and navigation commands.
- Exposes helper utilities so commands can detect diagnostic nodes and forward acknowledgement payloads when triggered from the tree.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.158Z","inputHash":"ca85ed087a224173"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `TreeNode`
- Type: type
- Source: [source](../../../../../../packages/extension/src/views/diagnosticsTree.ts#L12)

#### `DiagnosticsTreeDataProvider`
- Type: class
- Source: [source](../../../../../../packages/extension/src/views/diagnosticsTree.ts#L27)

#### `isDiagnosticNode`
- Type: function
- Source: [source](../../../../../../packages/extension/src/views/diagnosticsTree.ts#L248)

#### `buildTreeAcknowledgementArgs`
- Type: function
- Source: [source](../../../../../../packages/extension/src/views/diagnosticsTree.ts#L252)

#### `DiagnosticsTreeRegistration`
- Type: interface
- Source: [source](../../../../../../packages/extension/src/views/diagnosticsTree.ts#L267)

#### `registerDiagnosticsTreeView`
- Type: function
- Source: [source](../../../../../../packages/extension/src/views/diagnosticsTree.ts#L271)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `LIST_OUTSTANDING_DIAGNOSTICS_REQUEST`, `ListOutstandingDiagnosticsResult`, `OutstandingDiagnosticSummary`
- [`acknowledgeDiagnostic.ACKNOWLEDGE_DIAGNOSTIC_COMMAND`](../commands/acknowledgeDiagnostic.ts.md#acknowledge_diagnostic_command)
- `vscode` - `vscode`
- `vscode-languageclient/node` - `LanguageClient`
<!-- LIVE-DOC:END Dependencies -->
