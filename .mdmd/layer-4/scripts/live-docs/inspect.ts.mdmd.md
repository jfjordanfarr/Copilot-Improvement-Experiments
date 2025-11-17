# scripts/live-docs/inspect.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/live-docs/inspect.ts
- Live Doc ID: LD-implementation-scripts-live-docs-inspect-ts
- Generated At: 2025-11-17T19:44:57.565Z

## Authored
### Purpose
Provide a CLI entry point that inspects the staged Live Documentation graph and either finds a dependency path between two artefacts or lists the furthest reachable nodes from a starting point.

### Notes
Supports both text and JSON output. When no path exists, the CLI reports the closest reachable frontier, including unresolved dependencies, so path-finding gaps can be closed.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-17T19:44:57.565Z","inputHash":"886d4c14893bc8f7"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `glob` - `glob`
- `node:fs/promises` - `fs`
- `node:path` - `path`
- `node:process` - `process`
- [`liveDocumentationConfig.DEFAULT_LIVE_DOCUMENTATION_CONFIG`](../../packages/shared/src/config/liveDocumentationConfig.ts.mdmd.md#default_live_documentation_config)
- [`liveDocumentationConfig.LIVE_DOCUMENTATION_FILE_EXTENSION`](../../packages/shared/src/config/liveDocumentationConfig.ts.mdmd.md#live_documentation_file_extension)
- [`liveDocumentationConfig.LiveDocumentationConfig`](../../packages/shared/src/config/liveDocumentationConfig.ts.mdmd.md#livedocumentationconfig)
- [`liveDocumentationConfig.normalizeLiveDocumentationConfig`](../../packages/shared/src/config/liveDocumentationConfig.ts.mdmd.md#normalizelivedocumentationconfig)
- [`parse.parseLiveDocMarkdown`](../../packages/shared/src/live-docs/parse.ts.mdmd.md#parselivedocmarkdown)
- [`pathUtils.normalizeWorkspacePath`](../../packages/shared/src/tooling/pathUtils.ts.mdmd.md#normalizeworkspacepath)
<!-- LIVE-DOC:END Dependencies -->
