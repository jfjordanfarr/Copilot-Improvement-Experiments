# Rebuild Stability Benchmark Suite (Layer 4)

## Source Mapping
- Planned test: [`tests/integration/benchmarks/rebuildStability.test.ts`](../../../../tests/integration/benchmarks/rebuildStability.test.ts)
- Fixture orchestration: [`tests/integration/fixtures/fixtures.manifest.json`](../../../../tests/integration/fixtures/fixtures.manifest.json)
- Graph snapshot tooling: [`scripts/graph-tools/snapshot-workspace.ts`](../../../../scripts/graph-tools/snapshot-workspace.ts)
- Design overview: [Benchmark & Telemetry Reporting](../../../layer-3/benchmark-telemetry-pipeline.mdmd.md)
- Tasks: [T057](../../../../specs/001-link-aware-diagnostics/tasks.md), [T062](../../../../specs/001-link-aware-diagnostics/tasks.md)

## Purpose
Measure how deterministically the workspace graph reconstructs across repeated rebuilds, ensuring our pseudocode AST stays stable despite concurrent edits or fixture resets.

## Behaviour
- Spins up representative benchmark workspaces, triggering change queues and graph snapshot generation multiple times per run.
- Compares resulting snapshots using structural diffing, tracking node/edge churn, ordering variance, and latency metrics.
- Emits metrics (max drift %, average rebuild time) as structured JSON for the report generator.
- Supports dual-mode execution: `self-similarity` (repeat same workspace) and `cross-comparison` (compare to golden snapshot) so Task T062 can toggle behaviours.
- Cleans up temporary artifacts between iterations to avoid polluting subsequent runs.

## Interactions
- Consumed by `npm run verify -- --report` and optionally `npm run benchmarks:stability` (planned dedicated script).
- Writes results to a temporary JSON file consumed by `generateTestReport.ts`.
- Leverages telemetry trackers (latency + inference) to enrich the stability metrics when available.

## Evidence
- Integration run logs (captured in `docs/test-report.md`) will include drift tables and rebuild timing benchmarks.
- Follow-up unit helpers (`tests/integration/benchmarks/utils/rebuildComparison.test.ts`, planned) cover diffing logic independently.
