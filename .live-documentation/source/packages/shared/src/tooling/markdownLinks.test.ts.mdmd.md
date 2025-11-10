# packages/shared/src/tooling/markdownLinks.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/tooling/markdownLinks.test.ts
- Live Doc ID: LD-test-packages-shared-src-tooling-markdownlinks-test-ts
- Generated At: 2025-11-09T22:52:13.240Z

## Authored
### Purpose
Regression-tests the markdown link auditor against representative inline, reference, and absolute link scenarios to guard its path resolution heuristics.

### Notes
- Creates disposable workspaces to author docs with both valid and missing targets, asserting the issue list mirrors expected paths and counts.
- Covers exclusion paths like external URLs, anchors, angle-bracket generics, and user-supplied ignore patterns so legitimate content is not flagged.
- Exercises reference-definition parsing to ensure missing definitions and broken targets both raise diagnostics.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:13.240Z","inputHash":"7b119fa6f97f56c5"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `mkdirSync`, `mkdtempSync`, `rmSync`, `writeFileSync`
- `node:os` - `tmpdir`
- `node:path` - `path`
- [`markdownLinks.findBrokenMarkdownLinks`](./markdownLinks.ts.mdmd.md#findbrokenmarkdownlinks)
- `vitest` - `afterEach`, `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/tooling: [markdownLinks.ts](./markdownLinks.ts.mdmd.md), [markdownShared.ts](./markdownShared.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
