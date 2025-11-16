# packages/server/src/features/watchers/pathReferenceDetector.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/watchers/pathReferenceDetector.ts
- Live Doc ID: LD-implementation-packages-server-src-features-watchers-pathreferencedetector-ts
- Generated At: 2025-11-16T02:09:51.675Z

## Authored
### Purpose
Scans document and code content for relative path references, resolving them to workspace URIs so the watcher can seed inference with high-confidence relationship hints.

### Notes
- Parses multiple syntaxes—imports, requires, dynamic imports, markdown links, and inline literals—to catch links emitted by a range of languages.
- Resolves each candidate path against the source directory, guessing common extensions and skipping self-references before emitting hints.
- Rates hints by origin-specific confidence and tags rationales, letting downstream filters prioritise references discovered via code imports over broader literal matches.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.675Z","inputHash":"3e59f1248aafd264"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ArtifactCategory`
- Type: type
- Source: [source](../../../../../../../packages/server/src/features/watchers/pathReferenceDetector.ts#L9)

#### `PathReferenceOrigin`
- Type: type
- Source: [source](../../../../../../../packages/server/src/features/watchers/pathReferenceDetector.ts#L11)

#### `buildFileReferenceHints`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/watchers/pathReferenceDetector.ts#L56)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `RelationshipHint` (type-only)
- `node:fs` - `fs`
- `node:path` - `path`
- `node:url` - `fileURLToPath`, `pathToFileURL`
- [`uri.normalizeFileUri`](../utils/uri.ts.md#normalizefileuri)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [saveCodeChange.test.ts](../changeEvents/saveCodeChange.test.ts.md)
- [saveDocumentChange.test.ts](../changeEvents/saveDocumentChange.test.ts.md)
- [publishDocDiagnostics.test.ts](../diagnostics/publishDocDiagnostics.test.ts.md)
- [artifactWatcher.test.ts](./artifactWatcher.test.ts.md)
- [pathReferenceDetector.test.ts](./pathReferenceDetector.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
