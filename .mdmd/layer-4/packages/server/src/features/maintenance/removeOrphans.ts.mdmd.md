# packages/server/src/features/maintenance/removeOrphans.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/maintenance/removeOrphans.ts
- Live Doc ID: LD-implementation-packages-server-src-features-maintenance-removeorphans-ts
- Generated At: 2025-11-16T22:35:16.141Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:16.141Z","inputHash":"41c3797bdc365964"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `handleArtifactDeleted`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/maintenance/removeOrphans.ts#L16)

#### `handleArtifactRenamed`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/maintenance/removeOrphans.ts#L25)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`diagnosticUtils.DiagnosticSender`](../diagnostics/diagnosticUtils.ts.mdmd.md#diagnosticsender)
- [`diagnosticUtils.normaliseDisplayPath`](../diagnostics/diagnosticUtils.ts.mdmd.md#normalisedisplaypath)
- [`uri.normalizeFileUri`](../utils/uri.ts.mdmd.md#normalizefileuri)
- [`index.GraphStore`](../../../../shared/src/index.ts.mdmd.md#graphstore)
- [`index.LinkedArtifactSummary`](../../../../shared/src/index.ts.mdmd.md#linkedartifactsummary)
- [`index.RebindImpactedArtifact`](../../../../shared/src/index.ts.mdmd.md#rebindimpactedartifact)
- [`index.RebindReason`](../../../../shared/src/index.ts.mdmd.md#rebindreason)
- [`index.RebindRequiredPayload`](../../../../shared/src/index.ts.mdmd.md#rebindrequiredpayload)
- `vscode-languageserver/node` - `Connection`, `Diagnostic`, `DiagnosticSeverity`
<!-- LIVE-DOC:END Dependencies -->
