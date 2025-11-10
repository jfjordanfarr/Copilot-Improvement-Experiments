# packages/shared/src/tooling/symbolReferences.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/tooling/symbolReferences.test.ts
- Live Doc ID: LD-test-packages-shared-src-tooling-symbolreferences-test-ts
- Generated At: 2025-11-09T22:52:13.379Z

## Authored
### Purpose
Validate that symbol reference auditing reports duplicates and missing anchors while respecting rule overrides and ignore patterns.

### Notes
- Each test spins up a throwaway workspace, writes markdown fixtures, and invokes `findSymbolReferenceAnomalies` against the on-disk files to mirror real CLI usage.
- The first scenario expects one duplicate heading warning and two missing-anchor errors, asserting the reported slug, file, and severity values for coverage across cross-file and same-file links.
- The second scenario disables the duplicate rule and provides an `ignoreSlugPatterns` entry, confirming the analyzer returns no issues when instructed to suppress specific slugs.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:13.379Z","inputHash":"6a425ea25620d4a3"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
- `node:os` - `os`
- `node:path` - `path`
- [`symbolReferences.findSymbolReferenceAnomalies`](./symbolReferences.ts.mdmd.md#findsymbolreferenceanomalies)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/tooling: [githubSlugger.ts](./githubSlugger.ts.mdmd.md), [githubSluggerRegex.ts](./githubSluggerRegex.ts.mdmd.md), [markdownShared.ts](./markdownShared.ts.mdmd.md), [symbolReferences.ts](./symbolReferences.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
