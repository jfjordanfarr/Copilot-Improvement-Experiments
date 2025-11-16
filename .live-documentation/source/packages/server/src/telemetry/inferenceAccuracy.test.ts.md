# packages/server/src/telemetry/inferenceAccuracy.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/server/src/telemetry/inferenceAccuracy.test.ts
- Live Doc ID: LD-test-packages-server-src-telemetry-inferenceaccuracy-test-ts
- Generated At: 2025-11-16T02:09:51.725Z

## Authored
### Purpose
Exercises the inference accuracy tracker to ensure it computes precision/recall, enforces sample limits, and supports reset semantics.

### Notes
- Records mixed true/false positives and negatives within a single benchmark to verify derived ratios match expectations.
- Simulates multiple benchmarks with timestamped outcomes so snapshot ordering and `maxSamples` truncation can be asserted deterministically.
- Confirms `snapshot({ reset: true })` clears cumulative state, allowing follow-on calls to start fresh during monitoring workflows.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.725Z","inputHash":"9ed4ad08155ea6e2"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`inferenceAccuracy.InferenceAccuracyTracker`](./inferenceAccuracy.ts.md#inferenceaccuracytracker)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/server/src/telemetry: [inferenceAccuracy.ts](./inferenceAccuracy.ts.md)
- packages/shared/src/telemetry: [inferenceAccuracy.ts](../../../shared/src/telemetry/inferenceAccuracy.ts.md)
- packages/shared/src/uri: [normalizeFileUri.ts](../../../shared/src/uri/normalizeFileUri.ts.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
