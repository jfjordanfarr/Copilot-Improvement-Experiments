# packages/shared/src/inference/llm/relationshipExtractor.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/inference/llm/relationshipExtractor.test.ts
- Live Doc ID: LD-test-packages-shared-src-inference-llm-relationshipextractor-test-ts
- Generated At: 2025-11-09T22:52:12.319Z

## Authored
### Purpose
Demonstrate the extractor’s happy path parsing and its defensive failures when the model omits the required `relationships` structure.

### Notes
Constructs a mock prompt and model response to assert that metadata (prompt hash, model id) and normalized candidate fields survive the round trip. Two negative cases confirm the custom error surfaces both malformed JSON and structurally invalid outputs, ensuring downstream ingestion never sees unvalidated relationship payloads.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:12.319Z","inputHash":"449fb2331568bc07"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`relationshipExtractor.RelationshipExtractionPrompt`](./relationshipExtractor.ts.mdmd.md#relationshipextractionprompt)
- [`relationshipExtractor.RelationshipExtractor`](./relationshipExtractor.ts.mdmd.md#relationshipextractor)
- [`relationshipExtractor.RelationshipExtractorError`](./relationshipExtractor.ts.mdmd.md#relationshipextractorerror)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/domain: [artifacts.ts](../../domain/artifacts.ts.mdmd.md)
- packages/shared/src/inference/llm: [relationshipExtractor.ts](./relationshipExtractor.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
