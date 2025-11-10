# packages/shared/src/live-docs/generator.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/live-docs/generator.test.ts
- Live Doc ID: LD-test-packages-shared-src-live-docs-generator-test-ts
- Generated At: 2025-11-09T22:52:12.431Z

## Authored
### Purpose
Exercise the markdown helpers so live documentation regeneration keeps authored content, provenance markers, and file identifiers stable.

### Notes
Asserts that previously written Purpose/Notes blocks survive round-tripping, verifies the default template appears when no authored section exists, and checks that metadata and section markers render with the expected HTML comments. Additional cases ensure Live Doc ids and output paths remain deterministic across environments, and that provenance payloads serialise to JSON inside the marker comment.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:12.431Z","inputHash":"e922a8cfb1d73ffc"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`markdown.composeLiveDocId`](./markdown.ts.mdmd.md#composelivedocid)
- [`markdown.composeLiveDocPath`](./markdown.ts.mdmd.md#composelivedocpath)
- [`markdown.defaultAuthoredTemplate`](./markdown.ts.mdmd.md#defaultauthoredtemplate)
- [`markdown.extractAuthoredBlock`](./markdown.ts.mdmd.md#extractauthoredblock)
- [`markdown.renderLiveDocMarkdown`](./markdown.ts.mdmd.md#renderlivedocmarkdown)
- [`markdown.renderProvenanceComment`](./markdown.ts.mdmd.md#renderprovenancecomment)
- [`schema.LiveDocMetadata`](./schema.ts.mdmd.md#livedocmetadata) (type-only)
- [`schema.LiveDocProvenance`](./schema.ts.mdmd.md#livedocprovenance) (type-only)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/config: [liveDocumentationConfig.ts](../config/liveDocumentationConfig.ts.mdmd.md)
- packages/shared/src/live-docs: [markdown.ts](./markdown.ts.mdmd.md), [schema.ts](./schema.ts.mdmd.md)
- packages/shared/src/tooling: [pathUtils.ts](../tooling/pathUtils.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
