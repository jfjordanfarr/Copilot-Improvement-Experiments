# packages/server/src/telemetry/inferenceAccuracy.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/server/src/telemetry/inferenceAccuracy.test.ts
- Live Doc ID: LD-test-packages-server-src-telemetry-inferenceaccuracy-test-ts
- Generated At: 2025-11-16T22:34:12.290Z

## Authored
### Purpose
Validates the inference-accuracy tracker behaviour laid out in [AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-28.SUMMARIZED.md#turn-20-continued-instrumentation--unit-coverage-lines-2201-2320](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-28.SUMMARIZED.md#turn-20-continued-instrumentation--unit-coverage-lines-2201-2320), ensuring benchmark precision/recall metrics stay trustworthy.

### Notes
The suite covers multi-benchmark aggregation, sample trimming, and reset semantics—constraints that guard the shared tracker migration captured in [AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-28.SUMMARIZED.md#turn-29-shared-telemetry-relocation--alias-fallout-lines-3202-3335](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-28.SUMMARIZED.md#turn-29-shared-telemetry-relocation--alias-fallout-lines-3202-3335).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:12.290Z","inputHash":"674b9881f787eeae"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`inferenceAccuracy.InferenceAccuracyTracker`](./inferenceAccuracy.ts.mdmd.md#inferenceaccuracytracker)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/server/src/telemetry: [inferenceAccuracy.ts](./inferenceAccuracy.ts.mdmd.md)
- packages/shared/src/telemetry: [inferenceAccuracy.ts](../../../shared/src/telemetry/inferenceAccuracy.ts.mdmd.md)
- packages/shared/src/uri: [normalizeFileUri.ts](../../../shared/src/uri/normalizeFileUri.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
