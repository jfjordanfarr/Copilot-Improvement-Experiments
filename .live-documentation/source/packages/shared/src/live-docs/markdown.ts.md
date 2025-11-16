# packages/shared/src/live-docs/markdown.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/live-docs/markdown.ts
- Live Doc ID: LD-implementation-packages-shared-src-live-docs-markdown-ts
- Generated At: 2025-11-16T16:08:45.865Z

## Authored
### Purpose
Render deterministic Live Documentation files by combining preserved authored prose with generated sections, metadata, and provenance markers.

### Notes
Builds the full markdown document in memory, inserting metadata headers, authored content (or the default template when missing), and generator-supplied sections bounded by BEGIN/END comments for later diffing. Utility exports expose marker strings, provenance serialization, and helpers that compose workspace-relative Live Doc paths and ids using `normalizeWorkspacePath` so both CLI and extension produce identical layouts.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T16:08:45.865Z","inputHash":"2103e7625d055b99"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LIVE_DOC_BEGIN_MARKER_PREFIX`
- Type: const
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L7)

#### `LIVE_DOC_END_MARKER_PREFIX`
- Type: const
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L8)

#### `LIVE_DOC_PROVENANCE_MARKER`
- Type: const
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L9)

#### `LiveDocRenderSection`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L11)

#### `RenderLiveDocOptions`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L17)

#### `renderLiveDocMarkdown`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L33)

#### `renderBeginMarker`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L72)

#### `renderEndMarker`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L76)

#### `renderProvenanceComment`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L80)

#### `extractAuthoredBlock`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L85)

#### `defaultAuthoredTemplate`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L147)

#### `composeLiveDocPath`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L151)

#### `composeLiveDocId`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L165)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- [`liveDocumentationConfig.LIVE_DOCUMENTATION_FILE_EXTENSION`](../config/liveDocumentationConfig.ts.md#live_documentation_file_extension)
- [`schema.LiveDocMetadata`](./schema.ts.md#livedocmetadata) (type-only)
- [`schema.LiveDocProvenance`](./schema.ts.md#livedocprovenance) (type-only)
- [`pathUtils.normalizeWorkspacePath`](../tooling/pathUtils.ts.md#normalizeworkspacepath)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [generator.test.ts](../../../server/src/features/live-docs/generator.test.ts.md)
- [renderPublicSymbolLines.test.ts](../../../server/src/features/live-docs/renderPublicSymbolLines.test.ts.md)
- [generator.test.ts](../../../server/src/features/live-docs/system/generator.test.ts.md)
- [generator.test.ts](./generator.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
