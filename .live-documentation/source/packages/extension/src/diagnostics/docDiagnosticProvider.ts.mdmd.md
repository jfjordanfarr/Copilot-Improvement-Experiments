# packages/extension/src/diagnostics/docDiagnosticProvider.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/diagnostics/docDiagnosticProvider.ts
- Live Doc ID: LD-implementation-packages-extension-src-diagnostics-docdiagnosticprovider-ts
- Generated At: 2025-11-09T22:52:09.594Z

## Authored
### Purpose
Supplies quick fixes and commands for link-aware diagnostics so maintainers can navigate, acknowledge, and inspect ripple metadata from within VS Code.

### Notes
- Registers commands that open linked artifacts, display ripple chains, and acknowledge diagnostics by forwarding context to the language server.
- Provides a code action provider that filters supported drift/ripple diagnostics, builds actionable quick fixes, and reuses metadata embedded in diagnostic data payloads.
- Derives friendly labels, deduplicated pick items, and summaries while handling malformed URIs or missing metadata with user-facing warnings.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:09.594Z","inputHash":"f59c2f99acb2b991"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `OPEN_LINKED_ARTIFACT_COMMAND`
- Type: const
- Source: [source](../../../../../../packages/extension/src/diagnostics/docDiagnosticProvider.ts#L9)

#### `VIEW_RIPPLE_DETAILS_COMMAND`
- Type: const
- Source: [source](../../../../../../packages/extension/src/diagnostics/docDiagnosticProvider.ts#L10)

#### `registerDocDiagnosticProvider`
- Type: function
- Source: [source](../../../../../../packages/extension/src/diagnostics/docDiagnosticProvider.ts#L31)

#### `buildOpenActionTitle`
- Type: function
- Source: [source](../../../../../../packages/extension/src/diagnostics/docDiagnosticProvider.ts#L264)

#### `buildRippleSummary`
- Type: function
- Source: [source](../../../../../../packages/extension/src/diagnostics/docDiagnosticProvider.ts#L281)

#### `formatConfidenceLabel`
- Type: function
- Source: [source](../../../../../../packages/extension/src/diagnostics/docDiagnosticProvider.ts#L311)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`acknowledgeDiagnostic.ACKNOWLEDGE_DIAGNOSTIC_COMMAND`](../commands/acknowledgeDiagnostic.ts.mdmd.md#acknowledge_diagnostic_command)
- `vscode` - `vscode`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [docDiagnosticProvider.test.ts](./docDiagnosticProvider.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
