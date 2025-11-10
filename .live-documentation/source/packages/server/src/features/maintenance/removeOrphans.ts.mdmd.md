# packages/server/src/features/maintenance/removeOrphans.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/maintenance/removeOrphans.ts
- Live Doc ID: LD-implementation-packages-server-src-features-maintenance-removeorphans-ts
- Generated At: 2025-11-09T22:52:11.100Z

## Authored
### Purpose
Removes deleted or renamed artifacts from the graph and notifies clients so dependent documents can rebind their links.

### Notes
- Normalises URIs, drops the artifact from `GraphStore`, and emits diagnostics that explain which links lost their targets.
- Sends `rebindRequired` notifications listing impacted artifacts to drive VS Code fixups.
- Shares the same flow for deletions and renames, adding the new URI when available for richer guidance.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:11.100Z","inputHash":"d00cc3f1df8667af"}]} -->
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
- `@copilot-improvement/shared` - `GraphStore`, `LinkedArtifactSummary`, `RebindImpactedArtifact`, `RebindReason`, `RebindRequiredPayload`
- [`diagnosticUtils.DiagnosticSender`](../diagnostics/diagnosticUtils.ts.mdmd.md#diagnosticsender)
- [`diagnosticUtils.normaliseDisplayPath`](../diagnostics/diagnosticUtils.ts.mdmd.md#normalisedisplaypath)
- [`uri.normalizeFileUri`](../utils/uri.ts.mdmd.md#normalizefileuri)
- `vscode-languageserver/node` - `Connection`, `Diagnostic`, `DiagnosticSeverity`
<!-- LIVE-DOC:END Dependencies -->
