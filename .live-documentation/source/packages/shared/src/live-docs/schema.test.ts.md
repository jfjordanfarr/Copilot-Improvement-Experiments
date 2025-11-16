# packages/shared/src/live-docs/schema.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/live-docs/schema.test.ts
- Live Doc ID: LD-test-packages-shared-src-live-docs-schema-test-ts
- Generated At: 2025-11-16T02:09:51.959Z

## Authored
### Purpose
Guard the metadata normalizer against regressions in trimming, provenance filtering, and required-field validation.

### Notes
Exercises the happy path to ensure generator provenance remains after whitespace cleanup while empty entries are dropped, and verifies docstring metadata normalization plus enricher passthrough. A separate assertion confirms we still throw when the source path is blank, catching accidental relaxations of the schema contract.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.959Z","inputHash":"ffefcbe565d20387"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`schema.DEFAULT_LIVE_DOC_LAYER`](./schema.ts.md#default_live_doc_layer)
- [`schema.normalizeLiveDocMetadata`](./schema.ts.md#normalizelivedocmetadata)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/config: [liveDocumentationConfig.ts](../config/liveDocumentationConfig.ts.md)
- packages/shared/src/live-docs: [schema.ts](./schema.ts.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
