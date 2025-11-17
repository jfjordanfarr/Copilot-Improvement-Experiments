# packages/extension/src/diagnostics/docDiagnosticProvider.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/diagnostics/docDiagnosticProvider.ts
- Live Doc ID: LD-implementation-packages-extension-src-diagnostics-docdiagnosticprovider-ts
- Generated At: 2025-11-16T22:34:10.812Z

## Authored
### Purpose
Registers the Problems-view diagnostic source that translates server ripple payloads into VS Code diagnostics with “open linked artifact” quick fixes, completing T032 per [AI-Agent-Workspace/ChatHistory/2025/10/2025-10-17.md#L1288-L1332](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-17.md#L1288-L1332) and the follow-up metadata pass in [AI-Agent-Workspace/ChatHistory/2025/10/2025-10-21.md#L1238-L1276](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-21.md#L1238-L1276).

### Notes
- Oct 21 added the acknowledgement quick fix and plumbed record/target/trigger IDs so the command can dismiss drift in-place; see [AI-Agent-Workspace/ChatHistory/2025/10/2025-10-21.md#L3608-L3666](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-21.md#L3608-L3666).
- Unit tests (`docDiagnosticProvider.test.ts`) landed with that change set, and the same run verified Problems actions end-to-end via `npm run test:integration`, recorded at [AI-Agent-Workspace/ChatHistory/2025/10/2025-10-21.md#L1238-L1276](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-21.md#L1238-L1276).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:10.812Z","inputHash":"30d694bdcbdcf16a"}]} -->
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
