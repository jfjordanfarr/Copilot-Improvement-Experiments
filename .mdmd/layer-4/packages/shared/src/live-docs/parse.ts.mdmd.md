# packages/shared/src/live-docs/parse.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/live-docs/parse.ts
- Live Doc ID: LD-implementation-packages-shared-src-live-docs-parse-ts
- Generated At: 2025-11-17T19:45:37.043Z

## Authored
### Purpose
Centralises Live Doc markdown parsing so CLI utilities can obtain consistent metadata, symbol listings, and dependency edges without duplicating regex logic.

### Notes
Outputs workspace-relative paths and filters Live Doc links down to their underlying code artefacts, keeping downstream scripts agnostic of mirror layout conventions.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-17T19:45:37.043Z","inputHash":"39d36833856eb0c7"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ParsedLiveDoc`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/parse.ts#L7)

#### `parseLiveDocMarkdown`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/parse.ts#L17)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- [`liveDocumentationConfig.LIVE_DOCUMENTATION_FILE_EXTENSION`](../config/liveDocumentationConfig.ts.mdmd.md#live_documentation_file_extension) (type-only)
- [`liveDocumentationConfig.LiveDocumentationConfig`](../config/liveDocumentationConfig.ts.mdmd.md#livedocumentationconfig) (type-only)
- [`pathUtils.normalizeWorkspacePath`](../tooling/pathUtils.ts.mdmd.md#normalizeworkspacepath)
<!-- LIVE-DOC:END Dependencies -->
