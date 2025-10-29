# Test Report Generator (Layer 4)

## Source Mapping
- Planned implementation: `scripts/reporting/generateTestReport.ts`
- Safe-to-commit integration: [`scripts/safe-to-commit.mjs`](../../../scripts/safe-to-commit.mjs)
- Verify harness: [`scripts/fixture-tools/verify-fixtures.ts`](../../../scripts/fixture-tools/verify-fixtures.ts)
- Upstream design: [Benchmark & Telemetry Reporting](../../layer-3/benchmark-telemetry-pipeline.mdmd.md)
- Tasks: [T051](../../../specs/001-link-aware-diagnostics/tasks.md), [T062](../../../specs/001-link-aware-diagnostics/tasks.md)

## Purpose
Produce a durable `docs/test-report.md` artifact that captures the outcome of regression, benchmark, and telemetry runs so stakeholders can audit accuracy and performance trends without re-running the suites.

## Behaviour
- Consumes structured JSON emitted by `npm run verify -- --report`, merging unit, integration, benchmark, and telemetry sections.
- Renders Markdown with sections for suite summaries, benchmark deltas, telemetry metrics, and an appendix containing raw JSON.
- Supports incremental updates: regenerates existing report in-place, preserving prior run metadata (timestamp, git commit) for comparison.
- Accepts CLI flags for output path (`--out`), append vs overwrite, and report template selection.
- Returns non-zero exit code when critical suites fail so CI can block on missing coverage even if the report writes.

## Interactions
- Invoked by `safe:commit` when the user opts into full verification; also runnable directly for ad-hoc benchmarking.
- Reads benchmark outputs produced by `rebuildStability.test.ts` and `astAccuracy.test.ts`, incorporating their metrics tables.
- Pulls inference accuracy snapshots from the telemetry tracker so precision/recall and drift counters appear beside latency stats.

## Evidence
- Unit tests will cover Markdown generation, JSON ingestion, and CLI flag handling (`scripts/reporting/generateTestReport.test.ts`, planned).
- Integration coverage arrives via the benchmark suites and full verification command once implemented.
