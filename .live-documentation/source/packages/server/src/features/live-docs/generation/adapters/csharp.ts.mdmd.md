# packages/server/src/features/live-docs/generation/adapters/csharp.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/live-docs/generation/adapters/csharp.ts
- Live Doc ID: LD-implementation-packages-server-src-features-live-docs-generation-adapters-csharp-ts
- Generated At: 2025-11-15T02:58:51.536Z

## Authored
### Purpose
Adapts Roslyn-emitted JSON into Live Doc symbols so C# fixtures carry summaries, parameters, and dependency edges alongside TypeScript sources.

### Notes
- Reads the pre-generated C# analysis payloads stored with the fixture suite, avoiding a runtime Roslyn dependency.
- Normalises XML doc comments into the shared documentation fields so downstream markdown rendering stays format-agnostic.
- Captures `using` directives and fully-qualified symbol references to describe cross-file dependencies in the Live Doc graph.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-15T02:58:51.536Z","inputHash":"bf15fbc509c01d45"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `csharpAdapter`
- Type: const
- Source: [source](../../../../../../../../../packages/server/src/features/live-docs/generation/adapters/csharp.ts#L46)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
- [`index.LanguageAdapter`](./index.ts.mdmd.md#languageadapter) (type-only)
- [`core.DependencyEntry`](../core.ts.mdmd.md#dependencyentry) (type-only)
- [`core.PublicSymbolEntry`](../core.ts.mdmd.md#publicsymbolentry) (type-only)
- [`core.SourceAnalysisResult`](../core.ts.mdmd.md#sourceanalysisresult) (type-only)
- [`core.SymbolDocumentation`](../core.ts.mdmd.md#symboldocumentation) (type-only)
- [`core.SymbolDocumentationExample`](../core.ts.mdmd.md#symboldocumentationexample) (type-only)
- [`core.SymbolDocumentationException`](../core.ts.mdmd.md#symboldocumentationexception) (type-only)
- [`core.SymbolDocumentationLink`](../core.ts.mdmd.md#symboldocumentationlink) (type-only)
- [`core.SymbolDocumentationLinkKind`](../core.ts.mdmd.md#symboldocumentationlinkkind) (type-only)
- [`core.SymbolDocumentationParameter`](../core.ts.mdmd.md#symboldocumentationparameter) (type-only)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [c.docstring.test.ts](./c.docstring.test.ts.mdmd.md)
- [python.docstring.test.ts](./python.docstring.test.ts.mdmd.md)
- [ruby.docstring.test.ts](./ruby.docstring.test.ts.mdmd.md)
- [rust.docstring.test.ts](./rust.docstring.test.ts.mdmd.md)
- [core.docstring.test.ts](../core.docstring.test.ts.mdmd.md)
- [generator.test.ts](../../generator.test.ts.mdmd.md)
- [renderPublicSymbolLines.test.ts](../../renderPublicSymbolLines.test.ts.mdmd.md)
- [generator.test.ts](../../system/generator.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
