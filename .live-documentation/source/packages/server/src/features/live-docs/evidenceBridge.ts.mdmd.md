# packages/server/src/features/live-docs/evidenceBridge.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/live-docs/evidenceBridge.ts
- Live Doc ID: LD-implementation-packages-server-src-features-live-docs-evidencebridge-ts
- Generated At: 2025-11-14T18:42:06.486Z

## Authored
### Purpose
Aggregates coverage reports, target manifests, and waivers into the evidence snapshot consumed by Live Docs generation.

### Notes
- Normalises target/test paths and merges suite metadata so Live Docs can cite which tests cover a given source file.
- Scans coverage-summary JSON outputs from multiple tools, coalescing ratios and inferring evidence kinds from filenames.
- Allows manual waivers to append documentation when automated evidence is unavailable, keeping diagnostics transparent.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.486Z","inputHash":"eec280c0faf00a1c"}]} -->
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
- `@copilot-improvement/shared/tooling/pathUtils` - `normalizeWorkspacePath`
- `glob` - `glob`
- `node:fs/promises` - `fs`
- `node:path` - `path`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [generator.test.ts](./generator.test.ts.mdmd.md)
- [renderPublicSymbolLines.test.ts](./renderPublicSymbolLines.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
