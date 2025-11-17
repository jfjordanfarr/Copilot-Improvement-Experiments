# packages/server/src/features/diagnostics/diagnosticUtils.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/diagnostics/diagnosticUtils.ts
- Live Doc ID: LD-implementation-packages-server-src-features-diagnostics-diagnosticutils-ts
- Generated At: 2025-11-16T22:34:11.296Z

## Authored
### Purpose
Provides shared helpers for diagnostic publishers, including a path normaliser used throughout the Oct 17 link-aware diagnostics rollout ([2025-10-17 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-17.SUMMARIZED.md)).

### Notes
- Keeps URIs human-readable in emitted messages while leaving non-file schemes untouched for remote targets.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:11.296Z","inputHash":"0262fbfa809b693b"}]} -->
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
