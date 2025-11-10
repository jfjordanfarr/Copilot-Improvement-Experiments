# packages/server/src/features/diagnostics/diagnosticUtils.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/diagnostics/diagnosticUtils.ts
- Live Doc ID: LD-implementation-packages-server-src-features-diagnostics-diagnosticutils-ts
- Generated At: 2025-11-09T22:52:10.132Z

## Authored
### Purpose
Defines shared helpers for diagnostic publishing: the `DiagnosticSender` abstraction and utilities for normalising VS Code URIs into human-readable filesystem paths.

### Notes
- `normaliseDisplayPath` converts `file://` URIs into local paths via `fileURLToPath`, falling back to the original string when parsing fails so logging never throws.
- `DiagnosticSender` keeps the publisher contract minimal (URI + diagnostics array) so integration tests can substitute fakes without importing the language server connection.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:10.132Z","inputHash":"79c95342045c8796"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `DiagnosticSender`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/diagnosticUtils.ts#L5)

#### `normaliseDisplayPath`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/diagnosticUtils.ts#L9)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- `node:url` - `fileURLToPath`
- `vscode-languageserver/node` - `Diagnostic`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [publishDocDiagnostics.test.ts](./publishDocDiagnostics.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
