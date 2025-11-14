# packages/shared/src/inference/llmSampling.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/inference/llmSampling.test.ts
- Live Doc ID: LD-test-packages-shared-src-inference-llmsampling-test-ts
- Generated At: 2025-11-14T18:42:06.759Z

## Authored
### Purpose
Verify the sampling utilities aggregate and score edge votes correctly, drive a session via a mock collector, and surface telemetry when enabled.

### Notes
The suite covers the deterministic ordering of aggregated votes, threshold-based acceptance math, and the control flow that invokes a provided `collectVotes` hook. A final assertion uses a stub sink to ensure telemetry payloads report duration and session identifiers, preventing regressions where monitoring hooks silently stop firing.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.759Z","inputHash":"ab00c55ce918af30"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`llmSampling.SamplingRequest`](./llmSampling.ts.mdmd.md#samplingrequest)
- [`llmSampling.SamplingVote`](./llmSampling.ts.mdmd.md#samplingvote)
- [`llmSampling.aggregateVotes`](./llmSampling.ts.mdmd.md#aggregatevotes)
- [`llmSampling.emitSamplingTelemetry`](./llmSampling.ts.mdmd.md#emitsamplingtelemetry)
- [`llmSampling.runSamplingSession`](./llmSampling.ts.mdmd.md#runsamplingsession)
- [`llmSampling.scoreSamples`](./llmSampling.ts.mdmd.md#scoresamples)
- `vitest` - `describe`, `expect`, `it`, `vi`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/inference: [llmSampling.ts](./llmSampling.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
