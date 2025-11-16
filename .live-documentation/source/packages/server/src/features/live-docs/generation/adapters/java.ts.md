# packages/server/src/features/live-docs/generation/adapters/java.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/live-docs/generation/adapters/java.ts
- Live Doc ID: LD-implementation-packages-server-src-features-live-docs-generation-adapters-java-ts
- Generated At: 2025-11-16T02:09:51.513Z

## Authored
### Purpose
Transforms Java AST snapshots captured by our fixture oracle into Live Doc-friendly symbols, docstrings, and dependency edges.

### Notes
- Resolves package declarations and import statements to detect cross-class references before the core renderer runs.
- Normalises Javadoc blocks into the shared documentation schema so summaries, parameters, and throws entries render consistently.
- Uses cached AST output generated during fixture setup, keeping regeneration fast without invoking the Java compiler during Live Doc runs.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.513Z","inputHash":"134f693a3b168586"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `javaAdapter`
- Type: const
- Source: [source](../../../../../../../../../packages/server/src/features/live-docs/generation/adapters/java.ts#L21)
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
- [c.docstring.test.ts](./c.docstring.test.ts.md)
- [python.docstring.test.ts](./python.docstring.test.ts.md)
- [ruby.docstring.test.ts](./ruby.docstring.test.ts.md)
- [rust.docstring.test.ts](./rust.docstring.test.ts.md)
- [core.docstring.test.ts](../core.docstring.test.ts.md)
- [generator.test.ts](../../generator.test.ts.md)
- [renderPublicSymbolLines.test.ts](../../renderPublicSymbolLines.test.ts.md)
- [generator.test.ts](../../system/generator.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
