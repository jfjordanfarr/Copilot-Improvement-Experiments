# packages/server/src/features/live-docs/evidenceBridge.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/live-docs/evidenceBridge.ts
- Live Doc ID: LD-implementation-packages-server-src-features-live-docs-evidencebridge-ts
- Generated At: 2025-11-16T22:35:15.952Z

## Authored
### Purpose
Loads coverage summaries, targets manifests, and evidence waivers into structured maps so the Live Doc generator can annotate each implementation and test with observed evidence.

### Notes
- Built alongside the coverage ingestion push captured in [2025-11-08 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-08.SUMMARIZED.md).
- Subsequent safe-to-commit runs (see [2025-11-10 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-10.SUMMARIZED.md)) validated the manifest search paths and motivated the logger guidance.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:15.952Z","inputHash":"16b703ddf6959d7c"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `EvidenceKind`
- Type: type
- Source: [source](../../../../../../../packages/server/src/features/live-docs/evidenceBridge.ts#L7)

#### `CoverageRatio`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/live-docs/evidenceBridge.ts#L9)

#### `CoverageSummary`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/live-docs/evidenceBridge.ts#L15)

#### `ImplementationEvidenceItem`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/live-docs/evidenceBridge.ts#L22)

#### `TestEvidenceItem`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/live-docs/evidenceBridge.ts#L30)

#### `EvidenceSnapshot`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/live-docs/evidenceBridge.ts#L37)

#### `loadEvidenceSnapshot`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/live-docs/evidenceBridge.ts#L52)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `glob` - `glob`
- `node:fs/promises` - `fs`
- `node:path` - `path`
- [`pathUtils.normalizeWorkspacePath`](../../../../shared/src/tooling/pathUtils.ts.mdmd.md#normalizeworkspacepath)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [generator.test.ts](./generator.test.ts.mdmd.md)
- [renderPublicSymbolLines.test.ts](./renderPublicSymbolLines.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
