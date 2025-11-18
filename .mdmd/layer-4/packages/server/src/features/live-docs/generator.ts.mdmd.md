# packages/server/src/features/live-docs/generator.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/live-docs/generator.ts
- Live Doc ID: LD-implementation-packages-server-src-features-live-docs-generator-ts
- Generated At: 2025-11-18T16:28:50.960Z

## Authored
### Purpose
Coordinates Live Documentation generation by analyzing source files, merging authored sections, recording provenance, and writing deterministic markdown mirrors for each artifact.

### Notes
- Refactored into a layer-agnostic pipeline to support both Stage‑0 and System docs; see [2025-11-10 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-10.SUMMARIZED.md).
- Exposes `__testUtils` hooks to validate rendering behaviour as documented in [2025-11-08 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-08.SUMMARIZED.md).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-18T16:28:50.960Z","inputHash":"a59602a736f22c26"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LiveDocGeneratorResult`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/live-docs/generator.ts#L70)

#### `generateLiveDocs`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/live-docs/generator.ts#L93)

#### `__testUtils`
- Type: const
- Source: [source](../../../../../../../packages/server/src/features/live-docs/generator.ts#L762)

#### `withDefaultConfig`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/live-docs/generator.ts#L771)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `glob` - `glob`
- `node:crypto` - `createHash`
- `node:fs/promises` - `fs`
- `node:path` - `path`
- [`evidenceBridge.CoverageSummary`](./evidenceBridge.ts.mdmd.md#coveragesummary)
- [`evidenceBridge.EvidenceSnapshot`](./evidenceBridge.ts.mdmd.md#evidencesnapshot)
- [`evidenceBridge.ImplementationEvidenceItem`](./evidenceBridge.ts.mdmd.md#implementationevidenceitem)
- [`evidenceBridge.TestEvidenceItem`](./evidenceBridge.ts.mdmd.md#testevidenceitem)
- [`evidenceBridge.loadEvidenceSnapshot`](./evidenceBridge.ts.mdmd.md#loadevidencesnapshot)
- [`liveDocumentationConfig.DEFAULT_LIVE_DOCUMENTATION_CONFIG`](../../../../shared/src/config/liveDocumentationConfig.ts.mdmd.md#default_live_documentation_config)
- [`liveDocumentationConfig.LiveDocumentationArchetype`](../../../../shared/src/config/liveDocumentationConfig.ts.mdmd.md#livedocumentationarchetype)
- [`liveDocumentationConfig.LiveDocumentationConfig`](../../../../shared/src/config/liveDocumentationConfig.ts.mdmd.md#livedocumentationconfig)
- [`liveDocumentationConfig.normalizeLiveDocumentationConfig`](../../../../shared/src/config/liveDocumentationConfig.ts.mdmd.md#normalizelivedocumentationconfig)
- [`core.SourceAnalysisResult`](../../../../shared/src/live-docs/core.ts.mdmd.md#sourceanalysisresult)
- [`core.analyzeSourceFile`](../../../../shared/src/live-docs/core.ts.mdmd.md#analyzesourcefile)
- [`core.cleanupEmptyParents`](../../../../shared/src/live-docs/core.ts.mdmd.md#cleanupemptyparents)
- [`core.collectDependencies`](../../../../shared/src/live-docs/core.ts.mdmd.md#collectdependencies)
- [`core.collectExportedSymbols`](../../../../shared/src/live-docs/core.ts.mdmd.md#collectexportedsymbols)
- [`core.computePublicSymbolHeadingInfo`](../../../../shared/src/live-docs/core.ts.mdmd.md#computepublicsymbolheadinginfo)
- [`core.directoryExists`](../../../../shared/src/live-docs/core.ts.mdmd.md#directoryexists)
- [`core.discoverTargetFiles`](../../../../shared/src/live-docs/core.ts.mdmd.md#discovertargetfiles)
- [`core.formatRelativePathFromDoc`](../../../../shared/src/live-docs/core.ts.mdmd.md#formatrelativepathfromdoc)
- [`core.hasMeaningfulAuthoredContent`](../../../../shared/src/live-docs/core.ts.mdmd.md#hasmeaningfulauthoredcontent)
- [`core.inferScriptKind`](../../../../shared/src/live-docs/core.ts.mdmd.md#inferscriptkind)
- [`core.renderDependencyLines`](../../../../shared/src/live-docs/core.ts.mdmd.md#renderdependencylines)
- [`core.renderPublicSymbolLines`](../../../../shared/src/live-docs/core.ts.mdmd.md#renderpublicsymbollines)
- [`core.renderReExportedAnchorLines`](../../../../shared/src/live-docs/core.ts.mdmd.md#renderreexportedanchorlines)
- [`core.resolveArchetype`](../../../../shared/src/live-docs/core.ts.mdmd.md#resolvearchetype)
- [`markdown.LiveDocRenderSection`](../../../../shared/src/live-docs/markdown.ts.mdmd.md#livedocrendersection)
- [`markdown.composeLiveDocId`](../../../../shared/src/live-docs/markdown.ts.mdmd.md#composelivedocid)
- [`markdown.extractAuthoredBlock`](../../../../shared/src/live-docs/markdown.ts.mdmd.md#extractauthoredblock)
- [`markdown.renderLiveDocMarkdown`](../../../../shared/src/live-docs/markdown.ts.mdmd.md#renderlivedocmarkdown)
- [`schema.LiveDocGeneratorProvenance`](../../../../shared/src/live-docs/schema.ts.mdmd.md#livedocgeneratorprovenance) (type-only)
- [`schema.LiveDocMetadata`](../../../../shared/src/live-docs/schema.ts.mdmd.md#livedocmetadata) (type-only)
- [`schema.LiveDocProvenance`](../../../../shared/src/live-docs/schema.ts.mdmd.md#livedocprovenance) (type-only)
- [`pathUtils.normalizeWorkspacePath`](../../../../shared/src/tooling/pathUtils.ts.mdmd.md#normalizeworkspacepath)
- [`pathUtils.toWorkspaceFileUri`](../../../../shared/src/tooling/pathUtils.ts.mdmd.md#toworkspacefileuri)
- [`pathUtils.toWorkspaceRelativePath`](../../../../shared/src/tooling/pathUtils.ts.mdmd.md#toworkspacerelativepath)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [generator.test.ts](./generator.test.ts.mdmd.md)
- [renderPublicSymbolLines.test.ts](./renderPublicSymbolLines.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
