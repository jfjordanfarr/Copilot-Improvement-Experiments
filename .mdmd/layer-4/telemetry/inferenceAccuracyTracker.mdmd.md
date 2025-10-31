# Inference Accuracy Tracker

## Metadata
- Layer: 4
- Implementation ID: IMP-308
- Code Path: [`packages/shared/src/telemetry/inferenceAccuracy.ts`](../../../packages/shared/src/telemetry/inferenceAccuracy.ts)
- Exports: InferenceOutcome, AccuracySample, AccuracyTotals, BenchmarkAccuracySummary, InferenceAccuracyTracker, InferenceAccuracyTrackerOptions, RecordOutcomeOptions, InferenceAccuracySummary

## Purpose
Capture precision, recall, and F1 metrics for ripple inference so benchmark suites and extension surfaces can report adoption health with reproducible telemetry snapshots.

## Public Symbols

### InferenceOutcome
Literal union capturing adjudicated inference results (`truePositive`, `falsePositive`, `falseNegative`) used throughout benchmark reporting.

### AccuracySample
Per-outcome record persisted by the tracker, including benchmark id, optional artifact context, weights, and ISO timestamp for later forensic review.

### AccuracyTotals
Aggregate counters and derived precision/recall/F1 scores used for both per-benchmark and global summaries.

### BenchmarkAccuracySummary
Extends `AccuracyTotals` with the owning benchmark id; assembled per benchmark when callers request a snapshot.

### InferenceAccuracyTracker
Collects weighted true/false positive and false negative outcomes, computes aggregate metrics, and returns sorted benchmark snapshots. Supports bounded sample history and optional reset semantics so long-running processes can emit periodic reports without restart.

### InferenceAccuracyTrackerOptions
Configuration surface (max samples, custom clock, optional logger) that keeps benchmark pipelines deterministic while allowing dependency injection inside tests.

### RecordOutcomeOptions
Payload accepted by `recordOutcome`, tying benchmark identifiers to individual inference results, related artifacts, and relationships for downstream inspection.

### InferenceAccuracySummary
Shape returned by `snapshot`, combining aggregate totals, per-benchmark ratios, and recent samples for report generators.

## Collaborators
- [`normalizeFileUri`](../../../packages/shared/src/uri/normalizeFileUri.ts) ensures stored artifact URIs remain canonical for later diffing.
- Benchmark harnesses ([Benchmark Recorder Utility](../testing/benchmarks/benchmarkRecorder.mdmd.md), [`tests/integration/benchmarks`](../../../tests/integration/benchmarks)) feed outcomes into the tracker.
- Report generators ([Test Report Generator](../tooling/testReportGenerator.mdmd.md)) consume snapshot payloads when assembling markdown/JSON artefacts.

## Linked Components
- [COMP-007 – Diagnostics Benchmarking](../../layer-3/benchmark-telemetry-pipeline.mdmd.md)

## Evidence
- Unit tests: [`packages/server/src/telemetry/inferenceAccuracy.test.ts`](../../../packages/server/src/telemetry/inferenceAccuracy.test.ts) verify ratio calculations, sample trimming, and reset behaviour.
- Integration coverage: benchmark suites under [`tests/integration/benchmarks`](../../../tests/integration/benchmarks) exercise tracker snapshots during verify runs.
- Safe-to-commit history (2025-10-29) recorded tracker regressions, confirming the pipeline surfaces failures when metrics drift.

## Operational Notes
- Default sample cap (200) prevents telemetry tables from exploding while still capturing recent history; adjust via options when long-lived processes require deeper audits.
- Unknown outcomes trigger logger warnings but do not crash the pipeline, keeping long benchmark runs resilient.
