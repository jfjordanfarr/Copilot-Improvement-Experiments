# packages/server/src/features/live-docs/generator.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/live-docs/generator.ts
- Live Doc ID: LD-implementation-packages-server-src-features-live-docs-generator-ts
- Generated At: 2025-11-16T15:28:40.320Z

## Authored
### Purpose
Regenerates Layer‑4 Live Docs by analysing source files, weaving in evidence, and writing deterministic markdown mirrors.

### Notes
- Walks configured globs (optionally limited to changed files), inspects TypeScript exports/imports, and renders sections via shared markdown helpers.
- Merges authored blocks with generated metadata, provenance hashes, and evidence snapshots so doc history stays stable across runs.
- Supports dry-run/reporting workflows through change classification and exposes test utilities for symbol/dependency extraction.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T15:28:40.320Z","inputHash":"534f7d606907761c"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LiveDocGeneratorResult`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/live-docs/generator.ts#L69)

#### `generateLiveDocs`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/live-docs/generator.ts#L92)

#### `__testUtils`
- Type: const
- Source: [source](../../../../../../../packages/server/src/features/live-docs/generator.ts#L730)

#### `withDefaultConfig`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/live-docs/generator.ts#L739)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared/config/liveDocumentationConfig` - `DEFAULT_LIVE_DOCUMENTATION_CONFIG`, `LIVE_DOCUMENTATION_FILE_EXTENSION`, `LiveDocumentationArchetype`, `LiveDocumentationConfig`, `normalizeLiveDocumentationConfig`
- `@copilot-improvement/shared/live-docs/core` - `SourceAnalysisResult`, `analyzeSourceFile`, `cleanupEmptyParents`, `collectDependencies`, `collectExportedSymbols`, `directoryExists`, `discoverTargetFiles`, `formatRelativePathFromDoc`, `hasMeaningfulAuthoredContent`, `inferScriptKind`, `renderDependencyLines`, `renderPublicSymbolLines`, `resolveArchetype`
- `@copilot-improvement/shared/live-docs/markdown` - `LiveDocRenderSection`, `composeLiveDocId`, `extractAuthoredBlock`, `renderLiveDocMarkdown`
- `@copilot-improvement/shared/live-docs/schema` - `LiveDocGeneratorProvenance`, `LiveDocMetadata`, `LiveDocProvenance` (type-only)
- `@copilot-improvement/shared/tooling/pathUtils` - `normalizeWorkspacePath`, `toWorkspaceFileUri`, `toWorkspaceRelativePath`
- `glob` - `glob`
- `node:crypto` - `createHash`
- `node:fs/promises` - `fs`
- `node:path` - `path`
- [`evidenceBridge.CoverageSummary`](./evidenceBridge.ts.md#coveragesummary)
- [`evidenceBridge.EvidenceSnapshot`](./evidenceBridge.ts.md#evidencesnapshot)
- [`evidenceBridge.ImplementationEvidenceItem`](./evidenceBridge.ts.md#implementationevidenceitem)
- [`evidenceBridge.TestEvidenceItem`](./evidenceBridge.ts.md#testevidenceitem)
- [`evidenceBridge.loadEvidenceSnapshot`](./evidenceBridge.ts.md#loadevidencesnapshot)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [generator.test.ts](./generator.test.ts.md)
- [renderPublicSymbolLines.test.ts](./renderPublicSymbolLines.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
