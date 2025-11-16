# packages/shared/src/tooling/documentationLinks.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/tooling/documentationLinks.test.ts
- Live Doc ID: LD-test-packages-shared-src-tooling-documentationlinks-test-ts
- Generated At: 2025-11-16T02:09:52.089Z

## Authored
### Purpose
Covers the documentation link enforcement pipeline, ensuring anchors resolve to code files and breadcrumb comments are generated or fixed as needed.

### Notes
- Spins up throwaway workspaces seeded with fixture docs/code so parsing captures headings, backlink markers, and rule metadata exactly once.
- Verifies the code-to-doc map prefers sections with backlinks, and that formatted comments respect the configured `DEFAULT_RULES` label/prefix per extension.
- Asserts enforcement emits a missing-breadcrumb violation before repair, then successfully patches the source file when `fix: true` is supplied.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:52.089Z","inputHash":"da7ebb007c594a47"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
- `node:os` - `os`
- `node:path` - `path`
- [`documentationLinks.DEFAULT_RULES`](./documentationLinks.ts.md#default_rules)
- [`documentationLinks.DocumentationDocumentAnchors`](./documentationLinks.ts.md#documentationdocumentanchors)
- [`documentationLinks.formatDocumentationLinkComment`](./documentationLinks.ts.md#formatdocumentationlinkcomment)
- [`documentationLinks.parseDocumentationAnchors`](./documentationLinks.ts.md#parsedocumentationanchors)
- [`documentationLinks.resolveCodeToDocumentationMap`](./documentationLinks.ts.md#resolvecodetodocumentationmap)
- [`documentationLinks.runDocumentationLinkEnforcement`](./documentationLinks.ts.md#rundocumentationlinkenforcement)
- `vitest` - `afterEach`, `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/tooling: [documentationLinks.ts](./documentationLinks.ts.md), [githubSlugger.ts](./githubSlugger.ts.md), [githubSluggerRegex.ts](./githubSluggerRegex.ts.md), [markdownShared.ts](./markdownShared.ts.md), [pathUtils.ts](./pathUtils.ts.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
