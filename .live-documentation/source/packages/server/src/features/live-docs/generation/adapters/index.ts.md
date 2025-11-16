# packages/server/src/features/live-docs/generation/adapters/index.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/live-docs/generation/adapters/index.ts
- Live Doc ID: LD-implementation-packages-server-src-features-live-docs-generation-adapters-index-ts
- Generated At: 2025-11-16T02:09:51.503Z

## Authored
### Purpose
Routes source files through language-specific adapters before falling back to the default TypeScript analyzer, ensuring polyglot projects surface enriched Live Doc metadata.

### Notes
- Maintains a registry keyed by file extension so adapters can be added without touching the generator core.
- Normalises workspace paths before delegating, giving adapters consistent context for dependency resolution and doc rendering.
- Returns `null` when no adapter claims the file, allowing the core analyzer to handle remaining languages without double work.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.503Z","inputHash":"e8cd86c23090564e"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LanguageAdapter`
- Type: interface
- Source: [source](../../../../../../../../../packages/server/src/features/live-docs/generation/adapters/index.ts#L11)

#### `analyzeWithLanguageAdapters`
- Type: function
- Source: [source](../../../../../../../../../packages/server/src/features/live-docs/generation/adapters/index.ts#L27)

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
- [`c.cAdapter`](./c.ts.md#cadapter)
- [`csharp.csharpAdapter`](./csharp.ts.md#csharpadapter)
- [`java.javaAdapter`](./java.ts.md#javaadapter)
- [`python.pythonAdapter`](./python.ts.md#pythonadapter)
- [`ruby.rubyAdapter`](./ruby.ts.md#rubyadapter)
- [`rust.rustAdapter`](./rust.ts.md#rustadapter)
- [`core.SourceAnalysisResult`](../core.ts.md#sourceanalysisresult) (type-only)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [c.docstring.test.ts](./c.docstring.test.ts.md)
- [python.docstring.test.ts](./python.docstring.test.ts.md)
- [ruby.docstring.test.ts](./ruby.docstring.test.ts.md)
- [rust.docstring.test.ts](./rust.docstring.test.ts.md)
- [core.docstring.test.ts](../core.docstring.test.ts.md)
- [generator.test.ts](../../generator.test.ts.md)
- [renderPublicSymbolLines.test.ts](../../renderPublicSymbolLines.test.ts.md)
- [generator.test.ts](../../system/generator.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
