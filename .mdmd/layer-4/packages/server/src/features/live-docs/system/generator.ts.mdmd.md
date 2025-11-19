# packages/server/src/features/live-docs/system/generator.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/live-docs/system/generator.ts
- Live Doc ID: LD-implementation-packages-server-src-features-live-docs-system-generator-ts
- Generated At: 2025-11-19T15:01:34.387Z

## Authored
### Purpose
Synthesizes Stage-0 Live Docs, co-activation analytics, and optional target manifests into on-demand System-layer markdown so the CLI can emit statistically justified integration views ([2025-11-11 summary](../../../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-11.SUMMARIZED.md)).

### Notes
- Applies the p/q/z thresholds produced by `coActivation.ts` before writing clusters, preventing the oversized views we rejected earlier in the 2025-11-11 session.
- Supports custom `outputDir` and mirror cleanup so headless harness and `npm run live-docs:system` executions materialize ephemeral System docs outside the repo, matching the on-demand plan agreed the same day.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-19T15:01:34.387Z","inputHash":"886173a511b9ad18"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `GenerateSystemLiveDocsOptions` {#symbol-generatesystemlivedocsoptions}
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/system/generator.ts#L44)

#### `SystemLiveDocWriteRecord` {#symbol-systemlivedocwriterecord}
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/system/generator.ts#L54)

#### `GeneratedSystemDocument` {#symbol-generatedsystemdocument}
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/system/generator.ts#L61)

#### `SystemLiveDocGeneratorResult` {#symbol-systemlivedocgeneratorresult}
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/system/generator.ts#L70)

#### `generateSystemLiveDocs` {#symbol-generatesystemlivedocs}
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/system/generator.ts#L192)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `glob` - `glob`
- `node:fs/promises` - `fs`
- `node:path` - `path`
- [`docLoader.loadStage0Docs`](../stage0/docLoader.ts.mdmd.md#symbol-loadstage0docs)
- [`manifest.loadTargetManifest`](../targets/manifest.ts.mdmd.md#symbol-loadtargetmanifest)
- [`liveDocumentationConfig.LiveDocumentationConfig`](../../../../../shared/src/config/liveDocumentationConfig.ts.mdmd.md#symbol-livedocumentationconfig)
- [`liveDocumentationConfig.normalizeLiveDocumentationConfig`](../../../../../shared/src/config/liveDocumentationConfig.ts.mdmd.md#symbol-normalizelivedocumentationconfig)
- [`coActivation.CoActivationEdge`](../../../../../shared/src/live-docs/analysis/coActivation.ts.mdmd.md#symbol-coactivationedge) (type-only)
- [`coActivation.CoActivationReport`](../../../../../shared/src/live-docs/analysis/coActivation.ts.mdmd.md#symbol-coactivationreport) (type-only)
- [`core.cleanupEmptyParents`](../../../../../shared/src/live-docs/core.ts.mdmd.md#symbol-cleanupemptyparents)
- [`core.directoryExists`](../../../../../shared/src/live-docs/core.ts.mdmd.md#symbol-directoryexists)
- [`core.formatRelativePathFromDoc`](../../../../../shared/src/live-docs/core.ts.mdmd.md#symbol-formatrelativepathfromdoc)
- [`core.hasMeaningfulAuthoredContent`](../../../../../shared/src/live-docs/core.ts.mdmd.md#symbol-hasmeaningfulauthoredcontent)
- [`markdown.LiveDocRenderSection`](../../../../../shared/src/live-docs/markdown.ts.mdmd.md#symbol-livedocrendersection)
- [`markdown.extractAuthoredBlock`](../../../../../shared/src/live-docs/markdown.ts.mdmd.md#symbol-extractauthoredblock)
- [`markdown.renderLiveDocMarkdown`](../../../../../shared/src/live-docs/markdown.ts.mdmd.md#symbol-renderlivedocmarkdown)
- [`schema.LiveDocMetadata`](../../../../../shared/src/live-docs/schema.ts.mdmd.md#symbol-livedocmetadata)
- [`schema.LiveDocProvenance`](../../../../../shared/src/live-docs/schema.ts.mdmd.md#symbol-livedocprovenance)
- [`schema.normalizeLiveDocMetadata`](../../../../../shared/src/live-docs/schema.ts.mdmd.md#symbol-normalizelivedocmetadata)
- [`types.Stage0Doc`](../../../../../shared/src/live-docs/types.ts.mdmd.md#symbol-stage0doc) (type-only)
- [`types.Stage0Symbol`](../../../../../shared/src/live-docs/types.ts.mdmd.md#symbol-stage0symbol) (type-only)
- [`types.TargetManifest`](../../../../../shared/src/live-docs/types.ts.mdmd.md#symbol-targetmanifest) (type-only)
- [`githubSlugger.slug`](../../../../../shared/src/tooling/githubSlugger.ts.mdmd.md#symbol-slug)
- [`pathUtils.normalizeWorkspacePath`](../../../../../shared/src/tooling/pathUtils.ts.mdmd.md#symbol-normalizeworkspacepath)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [generator.test.ts](./generator.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
