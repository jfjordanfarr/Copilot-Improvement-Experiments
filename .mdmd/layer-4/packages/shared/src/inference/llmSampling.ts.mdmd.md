# packages/shared/src/inference/llmSampling.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/inference/llmSampling.ts
- Live Doc ID: LD-implementation-packages-shared-src-inference-llmsampling-ts
- Generated At: 2025-11-16T20:43:31.842Z

## Authored
### Purpose
Defines the shared LLM sampling harness—request/result contracts, vote aggregation, thresholding, and telemetry hooks—added on the November 4 fixture-oracle expansion pass documented in [AI-Agent-Workspace/ChatHistory/2025/11/2025-11-04.md#L4650](../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-04.md#L4650).

### Notes
Link inference will eventually call `runSamplingSession` once the sampling pipeline is ready; the same change log outlines the follow-up to wire in telemetry sinks, so keep this module in sync with [AI-Agent-Workspace/ChatHistory/2025/11/2025-11-04.md#L4679](../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-04.md#L4679).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T20:43:31.842Z","inputHash":"49fa9e45e4573adc"}]} -->
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
