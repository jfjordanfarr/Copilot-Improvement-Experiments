# InferenceAccuracyTracker (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/telemetry/inferenceAccuracy.ts`](../../../packages/shared/src/telemetry/inferenceAccuracy.ts) (re-exported for server consumers via [`packages/server/src/telemetry/inferenceAccuracy.ts`](../../../packages/server/src/telemetry/inferenceAccuracy.ts))
- Persistence layer: [`packages/shared/src/db/graphStore.ts`](../../../packages/shared/src/db/graphStore.ts)
- Benchmark consumers: [`tests/integration/benchmarks/astAccuracy.test.ts`](../../../tests/integration/benchmarks/astAccuracy.test.ts)
- Design overview: [Benchmark & Telemetry Reporting](../../layer-3/benchmark-telemetry-pipeline.mdmd.md)
- Tasks: [T058](../../../specs/001-link-aware-diagnostics/tasks.md), [T062](../../../specs/001-link-aware-diagnostics/tasks.md)

## Purpose
Track how closely pseudocode AST inference aligns with ground-truth AST fixtures by recording classification counts (true positives, false positives, false negatives) across benchmark runs and exposing aggregate metrics to downstream reporters.

## Behaviour
- Records inference outcomes tagged by benchmark id, artifact id, and relationship type so reports can drill into precision/recall per scenario.
- Computes running totals, precision, recall, and F1 scores for each benchmark window and overall since the last reset.
- Supports snapshot and reset semantics akin to the latency tracker, allowing benchmarks to capture metrics for a run and optionally start fresh.
- Maintains a bounded in-memory sample window, with hooks for future persistence so regression reports can compare current results with previous runs.
- Emits warnings when coverage falls below configurable thresholds, enabling automated gating.

## Interactions
- Benchmarks (`astAccuracy.test.ts`) invoke `recordOutcome` APIs while comparing inferred edges against canonical AST fixtures.
- Report generator requests `snapshot({ reset?: boolean })` to embed metrics into `reports/test-report.md`.
- CLI tooling can expose `linkDiagnostics.getInferenceAccuracy` (planned) mirroring latency telemetry for manual inspection.

## Evidence
- Dedicated unit tests validate metric calculations, reset behaviour, and persistence boundaries ([`packages/server/src/telemetry/inferenceAccuracy.test.ts`](../../../packages/server/src/telemetry/inferenceAccuracy.test.ts)).
- Integration benchmark ensures the tracker correctly accumulates metrics during AST comparison runs ([`tests/integration/benchmarks/rebuildStability.test.ts`](../../../tests/integration/benchmarks/rebuildStability.test.ts) and [`tests/integration/benchmarks/astAccuracy.test.ts`](../../../tests/integration/benchmarks/astAccuracy.test.ts)).

## Exported Symbols

- `AccuracySample` represents a single labelled classification (true positive, false positive, false negative) for a given artifact and relationship kind, including benchmark metadata.
- `AccuracyTotals` aggregates `AccuracySample` instances into running counts so precision, recall, and F1 scores can be derived per benchmark window.
- `BenchmarkAccuracySummary` summarises precision, recall, F1, and totals for a named benchmark run, supplying structured data to reporters and dashboards.
- `InferenceOutcome` enumerates allowable classification outcomes (`"truePositive"`, `"falsePositive"`, `"falseNegative"`) ensuring benchmarks record consistent labels.
- `RecordOutcomeOptions` bundles metadata (benchmark id, artifact uri, relationship kind) required when invoking tracker methods, keeping benchmarks declarative.
- `InferenceAccuracyTrackerOptions` configures optional persistence handles, logger injection, and clock overrides when instantiating the tracker.
- `InferenceAccuracySummary` combines per-benchmark and global `BenchmarkAccuracySummary` results; returned by `snapshot()` so callers can inspect aggregates and reset state when needed.

## Symbol Source Links

- [`InferenceOutcome`](../../../packages/shared/src/telemetry/inferenceAccuracy.ts#L3)
- [`RecordOutcomeOptions`](../../../packages/shared/src/telemetry/inferenceAccuracy.ts#L7)
- [`InferenceAccuracyTrackerOptions`](../../../packages/shared/src/telemetry/inferenceAccuracy.ts#L15)
- [`AccuracyTotals`](../../../packages/shared/src/telemetry/inferenceAccuracy.ts#L31)
- [`InferenceAccuracySummary`](../../../packages/shared/src/telemetry/inferenceAccuracy.ts#L46)
