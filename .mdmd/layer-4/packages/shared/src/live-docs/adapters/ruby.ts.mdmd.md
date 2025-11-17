# packages/shared/src/live-docs/adapters/ruby.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/live-docs/adapters/ruby.ts
- Live Doc ID: LD-implementation-packages-shared-src-live-docs-adapters-ruby-ts
- Generated At: 2025-11-16T22:34:13.077Z

## Authored
### Purpose
Provides the Ruby analyzer that maps YARD-style line and block comments, mixins, and `require` dependencies into Live Docs, following the implementation plan drafted and executed on Nov 14 <../../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-14.md#L2999-L3072> <../../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-14.md#L3308-L3334>.

### Notes
- Keep YARD tag coverage aligned with `ruby.docstring.test.ts` and the regenerated ruby fixtures that shipped with the adapter <../../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-14.md#L3308-L3334>.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:13.077Z","inputHash":"3c21d6da89c90e4d"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `rubyAdapter`
- Type: const
- Source: [source](../../../../../../../packages/shared/src/live-docs/adapters/ruby.ts#L31)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `promises`
- `node:path` - `path`
- [`index.LanguageAdapter`](./index.ts.mdmd.md#languageadapter) (type-only)
- [`core.DependencyEntry`](../core.ts.mdmd.md#dependencyentry) (type-only)
- [`core.PublicSymbolEntry`](../core.ts.mdmd.md#publicsymbolentry) (type-only)
- [`core.SourceAnalysisResult`](../core.ts.mdmd.md#sourceanalysisresult) (type-only)
- [`core.SymbolDocumentation`](../core.ts.mdmd.md#symboldocumentation) (type-only)
- [`core.SymbolDocumentationExample`](../core.ts.mdmd.md#symboldocumentationexample) (type-only)
- [`core.SymbolDocumentationException`](../core.ts.mdmd.md#symboldocumentationexception) (type-only)
- [`core.SymbolDocumentationLink`](../core.ts.mdmd.md#symboldocumentationlink) (type-only)
- [`core.SymbolDocumentationParameter`](../core.ts.mdmd.md#symboldocumentationparameter) (type-only)
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
