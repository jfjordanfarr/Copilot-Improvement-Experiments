# packages/server/src/features/live-docs/generation/adapters/python.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/live-docs/generation/adapters/python.ts
- Live Doc ID: LD-implementation-packages-server-src-features-live-docs-generation-adapters-python-ts
- Generated At: 2025-11-16T02:09:51.533Z

## Authored
### Purpose
Extracts Python exports, dependencies, and structured docstrings so Live Docs can present parity metadata with our TypeScript pipeline.

### Notes
- Parses module-level AST using the embedded Python oracle and maps results into the shared `SourceAnalysisResult` shape.
- Normalises docstring sections across Google, NumPy, and reStructuredText styles to keep summaries, parameters, and examples predictable.
- Emits dependency edges for `import` and `from` clauses, reconciling relative package paths against the originating file.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.533Z","inputHash":"8b4a4783da15c658"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `pythonAdapter`
- Type: const
- Source: [source](../../../../../../../../../packages/server/src/features/live-docs/generation/adapters/python.ts#L32)

##### `pythonAdapter` — Summary
Language adapter that extracts public symbols and docstring metadata from Python modules.

##### `pythonAdapter` — Remarks
The adapter recognises reStructuredText, Google, and NumPy-style docstring conventions
to populate Live Doc summaries, parameter tables, and inline examples without relying
on Python runtime introspection.
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
- [`index.LanguageAdapter`](./index.ts.md#languageadapter) (type-only)
- [`core.DependencyEntry`](../core.ts.md#dependencyentry) (type-only)
- [`core.PublicSymbolEntry`](../core.ts.md#publicsymbolentry) (type-only)
- [`core.SourceAnalysisResult`](../core.ts.md#sourceanalysisresult) (type-only)
- [`core.SymbolDocumentation`](../core.ts.md#symboldocumentation) (type-only)
- [`core.SymbolDocumentationExample`](../core.ts.md#symboldocumentationexample) (type-only)
- [`core.SymbolDocumentationLink`](../core.ts.md#symboldocumentationlink) (type-only)
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
