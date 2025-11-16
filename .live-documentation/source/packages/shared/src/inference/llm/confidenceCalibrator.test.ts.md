# packages/shared/src/inference/llm/confidenceCalibrator.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/inference/llm/confidenceCalibrator.test.ts
- Live Doc ID: LD-test-packages-shared-src-inference-llm-confidencecalibrator-test-ts
- Generated At: 2025-11-16T02:09:51.914Z

## Authored
### Purpose
Prove the calibrator maps labelled and numeric LLM confidence payloads into the expected tiers, scores, and eligibility flags across common scenarios.

### Notes
Exercises label-driven calibration to verify canonical tier assignments and numeric backfills, then covers threshold-based tiering for plain confidences to ensure only high-scoring links qualify for diagnostics. A corroborated medium-strength example demonstrates how promotion works when the same relationship appears in historical or heuristic evidence, guarding future regressions in eligibility logic.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.914Z","inputHash":"a90fa81b84571d36"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`confidenceCalibrator.calibrateConfidence`](./confidenceCalibrator.ts.md#calibrateconfidence)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/domain: [artifacts.ts](../../domain/artifacts.ts.md)
- packages/shared/src/inference/llm: [confidenceCalibrator.ts](./confidenceCalibrator.ts.md), [relationshipExtractor.ts](./relationshipExtractor.ts.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
