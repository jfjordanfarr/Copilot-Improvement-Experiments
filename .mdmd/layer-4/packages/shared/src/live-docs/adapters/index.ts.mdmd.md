# packages/shared/src/live-docs/adapters/index.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/live-docs/adapters/index.ts
- Live Doc ID: LD-implementation-packages-shared-src-live-docs-adapters-index-ts
- Generated At: 2025-11-16T22:34:12.989Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:12.989Z","inputHash":"803a24e5f7432d6c"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LanguageAdapter`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/live-docs/adapters/index.ts#L11)

#### `analyzeWithLanguageAdapters`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/live-docs/adapters/index.ts#L27)

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
- [`c.cAdapter`](./c.ts.mdmd.md#cadapter)
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
- [generator.test.ts](../../../../server/src/features/live-docs/generator.test.ts.mdmd.md)
- [renderPublicSymbolLines.test.ts](../../../../server/src/features/live-docs/renderPublicSymbolLines.test.ts.mdmd.md)
- [generator.test.ts](../../../../server/src/features/live-docs/system/generator.test.ts.mdmd.md)
- [c.docstring.test.ts](./c.docstring.test.ts.mdmd.md)
- [python.docstring.test.ts](./python.docstring.test.ts.mdmd.md)
- [ruby.docstring.test.ts](./ruby.docstring.test.ts.mdmd.md)
- [rust.docstring.test.ts](./rust.docstring.test.ts.mdmd.md)
- [core.docstring.test.ts](../core.docstring.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
