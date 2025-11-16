# packages/shared/src/live-docs/markdown.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/live-docs/markdown.ts
- Live Doc ID: LD-implementation-packages-shared-src-live-docs-markdown-ts
- Generated At: 2025-11-16T22:34:13.209Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:13.209Z","inputHash":"0b421c6ba58200a0"}]} -->
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
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L166)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- [`liveDocumentationConfig.LIVE_DOCUMENTATION_FILE_EXTENSION`](../config/liveDocumentationConfig.ts.mdmd.md#live_documentation_file_extension)
- [`schema.LiveDocMetadata`](./schema.ts.mdmd.md#livedocmetadata) (type-only)
- [`schema.LiveDocProvenance`](./schema.ts.mdmd.md#livedocprovenance) (type-only)
- [`pathUtils.normalizeWorkspacePath`](../tooling/pathUtils.ts.mdmd.md#normalizeworkspacepath)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [generator.test.ts](../../../server/src/features/live-docs/generator.test.ts.mdmd.md)
- [renderPublicSymbolLines.test.ts](../../../server/src/features/live-docs/renderPublicSymbolLines.test.ts.mdmd.md)
- [generator.test.ts](../../../server/src/features/live-docs/system/generator.test.ts.mdmd.md)
- [generator.test.ts](./generator.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
