# packages/server/src/features/live-docs/system/generator.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/live-docs/system/generator.ts
- Live Doc ID: LD-implementation-packages-server-src-features-live-docs-system-generator-ts
- Generated At: 2025-11-11T05:12:47.282Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-11T05:12:47.282Z","inputHash":"d8b1651a874d32d9"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `GenerateSystemLiveDocsOptions`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/system/generator.ts#L39)

#### `SystemLiveDocWriteRecord`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/system/generator.ts#L47)

#### `SystemLiveDocGeneratorResult`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/system/generator.ts#L54)

#### `generateSystemLiveDocs`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/system/generator.ts#L128)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared/config/liveDocumentationConfig` - `LiveDocumentationConfig`, `normalizeLiveDocumentationConfig`
- `@copilot-improvement/shared/live-docs/markdown` - `LiveDocRenderSection`, `extractAuthoredBlock`, `renderBeginMarker`, `renderEndMarker`, `renderLiveDocMarkdown`
- `@copilot-improvement/shared/live-docs/schema` - `LiveDocMetadata`, `LiveDocProvenance`, `normalizeLiveDocMetadata`
- `@copilot-improvement/shared/tooling/githubSlugger` - `githubSlug`
- `@copilot-improvement/shared/tooling/pathUtils` - `normalizeWorkspacePath`
- `glob` - `glob`
- `node:fs/promises` - `fs`
- `node:path` - `path`
- [`core.cleanupEmptyParents`](../generation/core.ts.mdmd.md#cleanupemptyparents)
- [`core.directoryExists`](../generation/core.ts.mdmd.md#directoryexists)
- [`core.formatRelativePathFromDoc`](../generation/core.ts.mdmd.md#formatrelativepathfromdoc)
- [`core.hasMeaningfulAuthoredContent`](../generation/core.ts.mdmd.md#hasmeaningfulauthoredcontent)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [generator.test.ts](./generator.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
