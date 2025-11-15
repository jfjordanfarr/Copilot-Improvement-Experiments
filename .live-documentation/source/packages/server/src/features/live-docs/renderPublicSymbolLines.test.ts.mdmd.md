# packages/server/src/features/live-docs/renderPublicSymbolLines.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/server/src/features/live-docs/renderPublicSymbolLines.test.ts
- Live Doc ID: LD-test-packages-server-src-features-live-docs-renderpublicsymbollines-test-ts
- Generated At: 2025-11-15T02:58:51.627Z

## Authored
### Purpose
Verifies the symbol renderer formats headings, metadata bullets, and links correctly for generated Live Docs.

### Notes
- Uses a synthetic analysis payload to assert type labels, source anchors, and documentation summaries appear in order.
- Guards against regressions where trailing newlines or missing blank separators would degrade rendered markdown.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-15T02:58:51.627Z","inputHash":"1331d9a54347168a"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- [`generator.__testUtils`](./generator.ts.mdmd.md#__testutils)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/server/src/features/live-docs: [evidenceBridge.ts](./evidenceBridge.ts.mdmd.md), [generator.ts](./generator.ts.mdmd.md)
- packages/server/src/features/live-docs/generation: [core.ts](./generation/core.ts.mdmd.md)
- packages/server/src/features/live-docs/generation/adapters: [adapters/index.ts](./generation/adapters/index.ts.mdmd.md), [c.ts](./generation/adapters/c.ts.mdmd.md), [csharp.ts](./generation/adapters/csharp.ts.mdmd.md), [java.ts](./generation/adapters/java.ts.mdmd.md), [python.ts](./generation/adapters/python.ts.mdmd.md), [ruby.ts](./generation/adapters/ruby.ts.mdmd.md)
  [rust.ts](./generation/adapters/rust.ts.mdmd.md)
- packages/shared/src/config: [liveDocumentationConfig.ts](../../../../shared/src/config/liveDocumentationConfig.ts.mdmd.md)
- packages/shared/src/live-docs: [markdown.ts](../../../../shared/src/live-docs/markdown.ts.mdmd.md), [schema.ts](../../../../shared/src/live-docs/schema.ts.mdmd.md)
- packages/shared/src/tooling: [githubSlugger.ts](../../../../shared/src/tooling/githubSlugger.ts.mdmd.md), [githubSluggerRegex.ts](../../../../shared/src/tooling/githubSluggerRegex.ts.mdmd.md), [pathUtils.ts](../../../../shared/src/tooling/pathUtils.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
