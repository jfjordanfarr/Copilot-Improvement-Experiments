# packages/server/src/features/live-docs/system/generator.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/live-docs/system/generator.ts
- Live Doc ID: LD-implementation-packages-server-src-features-live-docs-system-generator-ts
- Generated At: 2025-11-14T23:55:07.032Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T23:55:07.032Z","inputHash":"ece2f202802139f5"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `GenerateSystemLiveDocsOptions`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/system/generator.ts#L44)

#### `SystemLiveDocWriteRecord`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/system/generator.ts#L54)

#### `GeneratedSystemDocument`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/system/generator.ts#L61)

#### `SystemLiveDocGeneratorResult`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/system/generator.ts#L70)

#### `generateSystemLiveDocs`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/system/generator.ts#L192)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared/config/liveDocumentationConfig` - `LiveDocumentationConfig`, `normalizeLiveDocumentationConfig`
- `@copilot-improvement/shared/live-docs/analysis/coActivation` - `CoActivationEdge`, `CoActivationReport` (type-only)
- `@copilot-improvement/shared/live-docs/markdown` - `LiveDocRenderSection`, `extractAuthoredBlock`, `renderLiveDocMarkdown`
- `@copilot-improvement/shared/live-docs/schema` - `LiveDocMetadata`, `LiveDocProvenance`, `normalizeLiveDocMetadata`
- `@copilot-improvement/shared/live-docs/types` - `Stage0Doc`, `Stage0Symbol`, `TargetManifest` (type-only)
- `@copilot-improvement/shared/tooling/githubSlugger` - `githubSlug`
- `@copilot-improvement/shared/tooling/pathUtils` - `normalizeWorkspacePath`
- `glob` - `glob`
- `node:fs/promises` - `fs`
- `node:path` - `path`
- [`core.cleanupEmptyParents`](../generation/core.ts.mdmd.md#cleanupemptyparents)
- [`core.directoryExists`](../generation/core.ts.mdmd.md#directoryexists)
- [`core.formatRelativePathFromDoc`](../generation/core.ts.mdmd.md#formatrelativepathfromdoc)
- [`core.hasMeaningfulAuthoredContent`](../generation/core.ts.mdmd.md#hasmeaningfulauthoredcontent)
- [`docLoader.loadStage0Docs`](../stage0/docLoader.ts.mdmd.md#loadstage0docs)
- [`manifest.loadTargetManifest`](../targets/manifest.ts.mdmd.md#loadtargetmanifest)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [generator.test.ts](./generator.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
