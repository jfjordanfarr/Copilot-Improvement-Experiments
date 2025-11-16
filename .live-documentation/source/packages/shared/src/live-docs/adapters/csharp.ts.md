# packages/shared/src/live-docs/adapters/csharp.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/live-docs/adapters/csharp.ts
- Live Doc ID: LD-implementation-packages-shared-src-live-docs-adapters-csharp-ts
- Generated At: 2025-11-16T16:08:45.622Z

## Authored
### Purpose
Adapts Roslyn-emitted JSON into Live Doc symbols so C# fixtures carry summaries, parameters, and dependency edges alongside TypeScript sources.

### Notes
- Reads the pre-generated C# analysis payloads stored with the fixture suite, avoiding a runtime Roslyn dependency.
- Normalises XML doc comments into the shared documentation fields so downstream markdown rendering stays format-agnostic.
- Captures `using` directives and fully-qualified symbol references to describe cross-file dependencies in the Live Doc graph.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T16:08:45.622Z","inputHash":"babce8d3e1a13537"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `csharpAdapter`
- Type: const
- Source: [source](../../../../../../../packages/shared/src/live-docs/adapters/csharp.ts#L46)
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
- [`core.SymbolDocumentationException`](../core.ts.md#symboldocumentationexception) (type-only)
- [`core.SymbolDocumentationLink`](../core.ts.md#symboldocumentationlink) (type-only)
- [`core.SymbolDocumentationLinkKind`](../core.ts.md#symboldocumentationlinkkind) (type-only)
- [`core.SymbolDocumentationParameter`](../core.ts.md#symboldocumentationparameter) (type-only)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [generator.test.ts](../../../../server/src/features/live-docs/generator.test.ts.md)
- [renderPublicSymbolLines.test.ts](../../../../server/src/features/live-docs/renderPublicSymbolLines.test.ts.md)
- [generator.test.ts](../../../../server/src/features/live-docs/system/generator.test.ts.md)
- [c.docstring.test.ts](./c.docstring.test.ts.md)
- [python.docstring.test.ts](./python.docstring.test.ts.md)
- [ruby.docstring.test.ts](./ruby.docstring.test.ts.md)
- [rust.docstring.test.ts](./rust.docstring.test.ts.md)
- [core.docstring.test.ts](../core.docstring.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
