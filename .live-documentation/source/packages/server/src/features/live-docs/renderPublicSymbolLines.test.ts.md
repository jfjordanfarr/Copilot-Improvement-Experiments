# packages/server/src/features/live-docs/renderPublicSymbolLines.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/server/src/features/live-docs/renderPublicSymbolLines.test.ts
- Live Doc ID: LD-test-packages-server-src-features-live-docs-renderpublicsymbollines-test-ts
- Generated At: 2025-11-16T02:09:51.606Z

## Authored
### Purpose
Verifies the symbol renderer formats headings, metadata bullets, and links correctly for generated Live Docs.

### Notes
- Uses a synthetic analysis payload to assert type labels, source anchors, and documentation summaries appear in order.
- Guards against regressions where trailing newlines or missing blank separators would degrade rendered markdown.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.606Z","inputHash":"c5b8874f8d8504cb"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared/config/liveDocumentationConfig` - `LIVE_DOCUMENTATION_FILE_EXTENSION`
- `node:path` - `path`
- [`generator.__testUtils`](./generator.ts.md#__testutils)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/server/src/features/live-docs: [evidenceBridge.ts](./evidenceBridge.ts.md), [generator.ts](./generator.ts.md)
- packages/server/src/features/live-docs/generation: [core.ts](./generation/core.ts.md)
- packages/server/src/features/live-docs/generation/adapters: [adapters/index.ts](./generation/adapters/index.ts.md), [c.ts](./generation/adapters/c.ts.md), [csharp.ts](./generation/adapters/csharp.ts.md), [java.ts](./generation/adapters/java.ts.md), [python.ts](./generation/adapters/python.ts.md), [ruby.ts](./generation/adapters/ruby.ts.md)
  [rust.ts](./generation/adapters/rust.ts.md)
- packages/shared/src/config: [liveDocumentationConfig.ts](../../../../shared/src/config/liveDocumentationConfig.ts.md)
- packages/shared/src/live-docs: [markdown.ts](../../../../shared/src/live-docs/markdown.ts.md), [schema.ts](../../../../shared/src/live-docs/schema.ts.md)
- packages/shared/src/tooling: [githubSlugger.ts](../../../../shared/src/tooling/githubSlugger.ts.md), [githubSluggerRegex.ts](../../../../shared/src/tooling/githubSluggerRegex.ts.md), [pathUtils.ts](../../../../shared/src/tooling/pathUtils.ts.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
