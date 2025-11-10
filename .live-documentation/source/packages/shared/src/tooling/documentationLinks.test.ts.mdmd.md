# packages/shared/src/tooling/documentationLinks.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/tooling/documentationLinks.test.ts
- Live Doc ID: LD-test-packages-shared-src-tooling-documentationlinks-test-ts
- Generated At: 2025-11-09T22:52:13.149Z

## Authored
### Purpose
Covers the documentation link enforcement pipeline, ensuring anchors resolve to code files and breadcrumb comments are generated or fixed as needed.

### Notes
- Spins up throwaway workspaces seeded with fixture docs/code so parsing captures headings, backlink markers, and rule metadata exactly once.
- Verifies the code-to-doc map prefers sections with backlinks, and that formatted comments respect the configured `DEFAULT_RULES` label/prefix per extension.
- Asserts enforcement emits a missing-breadcrumb violation before repair, then successfully patches the source file when `fix: true` is supplied.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:13.149Z","inputHash":"4d957622527c17cc"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
- `node:os` - `os`
- `node:path` - `path`
- [`documentationLinks.DEFAULT_RULES`](./documentationLinks.ts.mdmd.md#default_rules)
- [`documentationLinks.DocumentationDocumentAnchors`](./documentationLinks.ts.mdmd.md#documentationdocumentanchors)
- [`documentationLinks.formatDocumentationLinkComment`](./documentationLinks.ts.mdmd.md#formatdocumentationlinkcomment)
- [`documentationLinks.parseDocumentationAnchors`](./documentationLinks.ts.mdmd.md#parsedocumentationanchors)
- [`documentationLinks.resolveCodeToDocumentationMap`](./documentationLinks.ts.mdmd.md#resolvecodetodocumentationmap)
- [`documentationLinks.runDocumentationLinkEnforcement`](./documentationLinks.ts.mdmd.md#rundocumentationlinkenforcement)
- `vitest` - `afterEach`, `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/tooling: [documentationLinks.ts](./documentationLinks.ts.mdmd.md), [githubSlugger.ts](./githubSlugger.ts.mdmd.md), [githubSluggerRegex.ts](./githubSluggerRegex.ts.mdmd.md), [markdownShared.ts](./markdownShared.ts.mdmd.md), [pathUtils.ts](./pathUtils.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
