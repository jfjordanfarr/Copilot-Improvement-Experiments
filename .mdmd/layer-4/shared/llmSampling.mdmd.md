# LLM Sampling Harness

## Metadata
- Layer: 4
- Implementation ID: IMP-530
- Code Path: [`packages/shared/src/inference/llmSampling.ts`](../../../packages/shared/src/inference/llmSampling.ts)
- Exports: SamplingRequest, SamplingPromptVariant, SamplingVote, SamplingEdge, SamplingResult, SamplingEvaluation, SamplingTelemetry, AggregatedVote, SamplingTelemetryOptions, SamplingTelemetrySink, SamplingVoteCollector, runSamplingSession, scoreSamples, aggregateVotes, emitSamplingTelemetry

## Purpose
Provide a reusable harness for gathering multiple LLM responses, scoring each proposal, and surfacing high-confidence edges back to the inference pipeline without sacrificing determinism or operator control.
- Collect votes via a pluggable `collectVotes` callback so existing adapters can drive prompt execution without hard dependencies.
- Aggregate per-edge support and apply acceptance thresholds before returning candidate edges to callers.
- Emit optional telemetry describing session outcomes so downstream reporting can track acceptance ratios over time.

## Public Symbols
### SamplingRequest
Input contract describing the sampling session (session id, prompt variants, acceptance thresholds, optional vote collector, and telemetry settings).

### SamplingPromptVariant
Describes a single prompt execution (template id, temperature, metadata) so results can be replayed during audits.

### SamplingVote
Represents an individual model response, including proposed edges, optional confidence scores, and any decoding metadata.

### SamplingEdge
Normalised edge proposal emitted by the harness containing source, target, and relation identifiers.

### AggregatedVote
Aggregated view of a proposed edge including total support count and the average confidence reported by contributing votes.

### SamplingResult
Aggregate output for a sampling session, grouping accepted edges, pending candidates, and all collected votes plus timing metadata.

### SamplingEvaluation
Intermediate data structure returned by `scoreSamples`, grouping accepted, pending, and rejected edges for review.

### SamplingTelemetry
Payload sent to telemetry services summarising response counts, acceptance ratios, and session duration.

### SamplingTelemetryOptions
Optional configuration enabling telemetry payloads and specifying the sink that should receive them.

### SamplingTelemetrySink
Callback signature for telemetry subscribers; receives structured session summaries and may perform synchronous or asynchronous work.

### runSamplingSession
Primary orchestrator that invokes an optional vote collector, aggregates votes via `scoreSamples`, emits telemetry, and returns a `SamplingResult`.

### scoreSamples
Evaluates collected votes against acceptance criteria (agreement ratios), tagging edges as accepted or pending while leaving room for future rejection heuristics.

### aggregateVotes
Groups identical edges across votes, tracking support counts and average confidence to aid threshold checks and review.

### SamplingVoteCollector
Callback signature that allows callers to supply sampling votes; returning an array (or promise) enables synchronous or asynchronous collectors.

### emitSamplingTelemetry
Packages the final `SamplingResult` into structured telemetry events and forwards them to a caller-provided sink when telemetry is enabled.

## Collaborators
- Pluggable vote collectors supply sampling responses and can live alongside existing inference adapters until deeper integration lands.
- Telemetry sinks (for example, [`packages/shared/src/telemetry/inferenceAccuracy.ts`](../../../packages/shared/src/telemetry/inferenceAccuracy.ts)) can subscribe to harness events to surface sampling agreement metrics.
- Benchmark tooling such as [`scripts/run-benchmarks.mjs`](../../../scripts/run-benchmarks.mjs) remains a future integration point once sampling mode graduates from the shared harness.

## Linked Components
- [COMP-013 Polyglot Fixture Oracles](../../layer-3/polyglot-oracles-and-sampling.mdmd.md#comp-013-polyglot-fixture-oracles)
- [COMP-014 LLM Sampling Harness](../../layer-3/polyglot-oracles-and-sampling.mdmd.md#comp-014-llm-sampling-harness)
- [COMP-007 Diagnostics Benchmarking](../../layer-3/benchmark-telemetry-pipeline.mdmd.md#comp007-diagnostics-benchmarking)

## Evidence
- [`packages/shared/src/inference/llmSampling.test.ts`](../../../packages/shared/src/inference/llmSampling.test.ts) validates vote aggregation, threshold handling, telemetry emission, and collector orchestration.
- Integration harness in `tests/integration/benchmarks/astAccuracy.test.ts` will compare sampling outputs against deterministic oracle truth, ensuring rejected edges never alter expectations without review.
- Benchmark telemetry in `reports/benchmarks/ast/` will log sampling agreement rates, highlighting when human review removed or promoted LLM-suggested edges.

## Observability
- Emits structured telemetry via `emitSamplingTelemetry`, tagged with session identifier and counts so downstream dashboards can compare acceptance ratios.
- Accepts metadata on `SamplingRequest` and `SamplingVote`, preserving provenance for consumers that persist results externally.
- Surfaced metrics will integrate with `npm run safe:commit` reports once the telemetry sink is wired into the existing inference dashboards.
