# packages/server/src/features/live-docs/generation/adapters/index.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/live-docs/generation/adapters/index.ts
- Live Doc ID: LD-implementation-packages-server-src-features-live-docs-generation-adapters-index-ts
- Generated At: 2025-11-15T01:50:43.287Z

## Authored
### Purpose
Routes source files through language-specific adapters before falling back to the default TypeScript analyzer, ensuring polyglot projects surface enriched Live Doc metadata.

### Notes
- Maintains a registry keyed by file extension so adapters can be added without touching the generator core.
- Normalises workspace paths before delegating, giving adapters consistent context for dependency resolution and doc rendering.
- Returns `null` when no adapter claims the file, allowing the core analyzer to handle remaining languages without double work.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-15T01:50:43.287Z","inputHash":"8603dcb7063972f8"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LanguageAdapter`
- Type: interface
- Source: [source](../../../../../../../../../packages/server/src/features/live-docs/generation/adapters/index.ts#L10)

#### `analyzeWithLanguageAdapters`
- Type: function
- Source: [source](../../../../../../../../../packages/server/src/features/live-docs/generation/adapters/index.ts#L26)

##### `analyzeWithLanguageAdapters` — Summary
Attempts to analyse a source file using the configured language adapters.

##### `analyzeWithLanguageAdapters` — Parameters
- `options.absolutePath`: Absolute path to the source file under inspection.
- `options.workspaceRoot`: Workspace root, forwarded to adapters that need relative paths.

##### `analyzeWithLanguageAdapters` — Returns
Analyzer output when an adapter understands the file extension, otherwise `null`.
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- [`csharp.csharpAdapter`](./csharp.ts.mdmd.md#csharpadapter)
- [`java.javaAdapter`](./java.ts.mdmd.md#javaadapter)
- [`python.pythonAdapter`](./python.ts.mdmd.md#pythonadapter)
- [`ruby.rubyAdapter`](./ruby.ts.mdmd.md#rubyadapter)
- [`rust.rustAdapter`](./rust.ts.mdmd.md#rustadapter)
- [`core.SourceAnalysisResult`](../core.ts.mdmd.md#sourceanalysisresult) (type-only)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [python.docstring.test.ts](./python.docstring.test.ts.mdmd.md)
- [ruby.docstring.test.ts](./ruby.docstring.test.ts.mdmd.md)
- [rust.docstring.test.ts](./rust.docstring.test.ts.mdmd.md)
- [core.docstring.test.ts](../core.docstring.test.ts.mdmd.md)
- [generator.test.ts](../../generator.test.ts.mdmd.md)
- [renderPublicSymbolLines.test.ts](../../renderPublicSymbolLines.test.ts.mdmd.md)
- [generator.test.ts](../../system/generator.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
