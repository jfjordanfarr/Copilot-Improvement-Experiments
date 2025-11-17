# packages/shared/src/live-docs/adapters/java.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/live-docs/adapters/java.ts
- Live Doc ID: LD-implementation-packages-shared-src-live-docs-adapters-java-ts
- Generated At: 2025-11-16T22:34:13.009Z

## Authored
### Purpose
Parses Java sources to translate Javadoc summaries, tags, and imports into the Live Docs schema, as delivered in the Nov 13 adapter addition and fixture refresh <../../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-13.md#L1460-L1508>.

### Notes
- Keep the polyglot integration test and updated Java fixtures in sync with any parser changes; those assets were extended alongside the original rollout to catch regressions <../../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-13.md#L1488-L1508>.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:13.009Z","inputHash":"9fbe53204f74e8b8"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `javaAdapter`
- Type: const
- Source: [source](../../../../../../../packages/shared/src/live-docs/adapters/java.ts#L21)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `promises`
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
- [generator.test.ts](../../../../server/src/features/live-docs/generator.test.ts.mdmd.md)
- [renderPublicSymbolLines.test.ts](../../../../server/src/features/live-docs/renderPublicSymbolLines.test.ts.mdmd.md)
- [generator.test.ts](../../../../server/src/features/live-docs/system/generator.test.ts.mdmd.md)
- [c.docstring.test.ts](./c.docstring.test.ts.mdmd.md)
- [python.docstring.test.ts](./python.docstring.test.ts.mdmd.md)
- [ruby.docstring.test.ts](./ruby.docstring.test.ts.mdmd.md)
- [rust.docstring.test.ts](./rust.docstring.test.ts.mdmd.md)
- [core.docstring.test.ts](../core.docstring.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
