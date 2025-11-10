# packages/shared/src/tooling/githubSlugger.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/tooling/githubSlugger.test.ts
- Live Doc ID: LD-test-packages-shared-src-tooling-githubslugger-test-ts
- Generated At: 2025-11-09T22:52:13.209Z

## Authored
### Purpose
Locks the vendored slugger against upstream behaviour by asserting casing, unicode handling, duplicate tracking, and edge-case contexts.

### Notes
- Mirrors representative headings (ASCII, emoji, non-Latin) to ensure `slug` strips characters exactly like GitHub’s implementation.
- Exercises `maintainCase`, `slugWithContext`, and `reset` flows so duplicate numbering and context metadata remain stable.
- Includes guards for non-string inputs and headings that reduce to empty slugs, catching regressions when upgrading the regex.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:13.209Z","inputHash":"74337d447b1ab1e0"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`githubSlugger.GitHubSlugger`](./githubSlugger.ts.mdmd.md#githubslugger)
- [`githubSlugger.createSlugger`](./githubSlugger.ts.mdmd.md#createslugger)
- [`githubSlugger.slug`](./githubSlugger.ts.mdmd.md#slug)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/tooling: [githubSlugger.ts](./githubSlugger.ts.mdmd.md), [githubSluggerRegex.ts](./githubSluggerRegex.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
