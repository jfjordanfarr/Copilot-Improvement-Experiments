# packages/shared/src/inference/llmSampling.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/inference/llmSampling.ts
- Live Doc ID: LD-implementation-packages-shared-src-inference-llmsampling-ts
- Generated At: 2025-11-09T22:52:12.245Z

## Authored
### Purpose
Provide reusable scaffolding for multi-variant LLM sampling sessions, aggregating vote data, evaluating acceptance thresholds, and emitting optional telemetry for downstream orchestration.

### Notes
`aggregateVotes` collapses edge proposals across variants into deterministic support/average-confidence tuples sorted for stable diagnostics. `scoreSamples` buckets aggregated edges into accepted or pending lists relative to a session-level threshold, while `runSamplingSession` executes a pluggable vote collector, stamps timing metadata, and ignores telemetry sink failures on purpose. Telemetry payloads summarize edge counts and duration so higher layers can monitor sampling quality without depending on implementation details.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:12.245Z","inputHash":"ab684e8d1c46048c"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `SamplingPromptVariant`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/llmSampling.ts#L1)

#### `SamplingEdge`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/llmSampling.ts#L8)

#### `SamplingVote`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/llmSampling.ts#L14)

#### `SamplingRequest`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/llmSampling.ts#L22)

#### `SamplingVoteCollector`
- Type: type
- Source: [source](../../../../../../packages/shared/src/inference/llmSampling.ts#L32)

#### `AggregatedVote`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/llmSampling.ts#L36)

#### `SamplingEvaluation`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/llmSampling.ts#L42)

#### `SamplingResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/llmSampling.ts#L48)

#### `SamplingTelemetryOptions`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/llmSampling.ts#L56)

#### `SamplingTelemetry`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/llmSampling.ts#L61)

#### `SamplingTelemetrySink`
- Type: type
- Source: [source](../../../../../../packages/shared/src/inference/llmSampling.ts#L71)

#### `aggregateVotes`
- Type: function
- Source: [source](../../../../../../packages/shared/src/inference/llmSampling.ts#L75)

#### `scoreSamples`
- Type: function
- Source: [source](../../../../../../packages/shared/src/inference/llmSampling.ts#L124)

#### `runSamplingSession`
- Type: function
- Source: [source](../../../../../../packages/shared/src/inference/llmSampling.ts#L151)

#### `emitSamplingTelemetry`
- Type: function
- Source: [source](../../../../../../packages/shared/src/inference/llmSampling.ts#L176)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_No dependencies documented yet_
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [llmSampling.test.ts](./llmSampling.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
