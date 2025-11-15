# packages/server/src/features/live-docs/generation/core.docstring.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/server/src/features/live-docs/generation/core.docstring.test.ts
- Live Doc ID: LD-test-packages-server-src-features-live-docs-generation-core-docstring-test-ts
- Generated At: 2025-11-14T22:24:33.931Z

## Authored
### Purpose
Guards the TypeScript docstring bridge by exercising end-to-end symbol extraction and markdown rendering for representative comment structures.

### Notes
- Builds synthetic TypeScript sources containing summaries, remarks, parameters, returns, throws, examples, and cross-links to validate every rendered section.
- Asserts that markdown emitted by `renderPublicSymbolLines` stays deterministic, catching regressions before they leak into bulk Live Doc regeneration.
- Reuses shared fixture helpers so future adapters can reference the same expectations when expanding docstring support to other languages.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T22:24:33.931Z","inputHash":"f314d44ffd59cd25"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- [`core.collectExportedSymbols`](./core.ts.mdmd.md#collectexportedsymbols)
- [`core.renderPublicSymbolLines`](./core.ts.mdmd.md#renderpublicsymbollines)
- `typescript` - `ts`
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/server/src/features/live-docs/generation: [core.ts](./core.ts.mdmd.md)
- packages/server/src/features/live-docs/generation/adapters: [adapters/index.ts](./adapters/index.ts.mdmd.md), [csharp.ts](./adapters/csharp.ts.mdmd.md), [java.ts](./adapters/java.ts.mdmd.md), [python.ts](./adapters/python.ts.mdmd.md), [rust.ts](./adapters/rust.ts.mdmd.md)
- packages/shared/src/config: [liveDocumentationConfig.ts](../../../../../shared/src/config/liveDocumentationConfig.ts.mdmd.md)
- packages/shared/src/tooling: [githubSlugger.ts](../../../../../shared/src/tooling/githubSlugger.ts.mdmd.md), [githubSluggerRegex.ts](../../../../../shared/src/tooling/githubSluggerRegex.ts.mdmd.md), [pathUtils.ts](../../../../../shared/src/tooling/pathUtils.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
