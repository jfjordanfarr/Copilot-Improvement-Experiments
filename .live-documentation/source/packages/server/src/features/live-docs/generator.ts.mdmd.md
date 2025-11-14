# packages/server/src/features/live-docs/generator.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/live-docs/generator.ts
- Live Doc ID: LD-implementation-packages-server-src-features-live-docs-generator-ts
- Generated At: 2025-11-14T18:42:06.531Z

## Authored
### Purpose
Regenerates Layer‑4 Live Docs by analysing source files, weaving in evidence, and writing deterministic markdown mirrors.

### Notes
- Walks configured globs (optionally limited to changed files), inspects TypeScript exports/imports, and renders sections via shared markdown helpers.
- Merges authored blocks with generated metadata, provenance hashes, and evidence snapshots so doc history stays stable across runs.
- Supports dry-run/reporting workflows through change classification and exposes test utilities for symbol/dependency extraction.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.531Z","inputHash":"931a2df47a714265"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `generateLiveDocs`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/live-docs/generator.ts#L91)

#### `__testUtils`
- Type: const
- Source: [source](../../../../../../../packages/server/src/features/live-docs/generator.ts#L722)

#### `withDefaultConfig`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/live-docs/generator.ts#L731)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared/config/liveDocumentationConfig` - `DEFAULT_LIVE_DOCUMENTATION_CONFIG`, `LiveDocumentationArchetype`, `LiveDocumentationConfig`, `normalizeLiveDocumentationConfig`
- `@copilot-improvement/shared/live-docs/markdown` - `LiveDocRenderSection`, `composeLiveDocId`, `extractAuthoredBlock`, `renderLiveDocMarkdown`
- `@copilot-improvement/shared/live-docs/schema` - `LiveDocGeneratorProvenance`, `LiveDocMetadata`, `LiveDocProvenance` (type-only)
- `@copilot-improvement/shared/tooling/pathUtils` - `normalizeWorkspacePath`, `toWorkspaceFileUri`, `toWorkspaceRelativePath`
- `glob` - `glob`
- `node:crypto` - `createHash`
- `node:fs/promises` - `fs`
- `node:path` - `path`
- [`evidenceBridge.CoverageSummary`](./evidenceBridge.ts.mdmd.md#coveragesummary)
- [`evidenceBridge.EvidenceSnapshot`](./evidenceBridge.ts.mdmd.md#evidencesnapshot)
- [`evidenceBridge.ImplementationEvidenceItem`](./evidenceBridge.ts.mdmd.md#implementationevidenceitem)
- [`evidenceBridge.TestEvidenceItem`](./evidenceBridge.ts.mdmd.md#testevidenceitem)
- [`evidenceBridge.loadEvidenceSnapshot`](./evidenceBridge.ts.mdmd.md#loadevidencesnapshot)
- [`core.SourceAnalysisResult`](./generation/core.ts.mdmd.md#sourceanalysisresult)
- [`core.analyzeSourceFile`](./generation/core.ts.mdmd.md#analyzesourcefile)
- [`core.cleanupEmptyParents`](./generation/core.ts.mdmd.md#cleanupemptyparents)
- [`core.collectDependencies`](./generation/core.ts.mdmd.md#collectdependencies)
- [`core.collectExportedSymbols`](./generation/core.ts.mdmd.md#collectexportedsymbols)
- [`core.directoryExists`](./generation/core.ts.mdmd.md#directoryexists)
- [`core.discoverTargetFiles`](./generation/core.ts.mdmd.md#discovertargetfiles)
- [`core.formatRelativePathFromDoc`](./generation/core.ts.mdmd.md#formatrelativepathfromdoc)
- [`core.hasMeaningfulAuthoredContent`](./generation/core.ts.mdmd.md#hasmeaningfulauthoredcontent)
- [`core.inferScriptKind`](./generation/core.ts.mdmd.md#inferscriptkind)
- [`core.renderDependencyLines`](./generation/core.ts.mdmd.md#renderdependencylines)
- [`core.renderPublicSymbolLines`](./generation/core.ts.mdmd.md#renderpublicsymbollines)
- [`core.resolveArchetype`](./generation/core.ts.mdmd.md#resolvearchetype)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [generator.test.ts](./generator.test.ts.mdmd.md)
- [renderPublicSymbolLines.test.ts](./renderPublicSymbolLines.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
