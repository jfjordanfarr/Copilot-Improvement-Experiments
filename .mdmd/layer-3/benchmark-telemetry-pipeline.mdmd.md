# Benchmark & Telemetry Reporting (Layer 3)

## Vision
Deliver a reproducible performance and accuracy reporting loop that couples end-to-end regression evidence (Task T051) with automated benchmark suites (Tasks T057–T058, T061–T062). The goal is to make diagnostic latency, graph stability, and inference accuracy auditable through a single command and exportable report, while paving the way for richer AST fixtures (T060) later.

## Goals
- **Unified reporting**: Produce a durable artifact (`docs/test-report.md`) after every full verification pass summarising integration runs, benchmark results, and inference metrics.
- **Benchmark automation**: Execute reproducible workspaces ([`tests/integration/benchmarks`](../../tests/integration/benchmarks)) that stress graph rebuild stability (T057), pseudocode-vs-AST accuracy (T061), and dual-mode benchmark selection (T062); surface deltas in the same report.
- **Telemetry capture**: Persist inference accuracy telemetry to SQLite alongside latency stats so benchmarks can emit precise metrics via [`packages/shared/src/telemetry/inferenceAccuracy.ts`](../../packages/shared/src/telemetry/inferenceAccuracy.ts).

## Scope
- Extend the existing `safe:commit` pipeline with an opt-in "full verification" mode that powers the report ([`scripts/safe-to-commit.mjs`](../../scripts/safe-to-commit.mjs)).
- Author benchmark harnesses under [`tests/integration/benchmarks`](../../tests/integration/benchmarks) for graph stability (T057) and AST-vs-inference accuracy comparisons (T061).
- Capture and expose inference accuracy telemetry via a shared module consumed by the server (T058) so benchmarks can report precision/recall style metrics, with CLI switches to select modes (T062), leveraging [`packages/server/src/telemetry/inferenceAccuracy.ts`](../../packages/server/src/telemetry/inferenceAccuracy.ts).
- Harmonise CLI tooling ([`scripts/fixture-tools/verify-fixtures.ts`](../../scripts/fixture-tools/verify-fixtures.ts), [`tests/integration/benchmarks/utils`](../../tests/integration/benchmarks/utils)) to emit structured JSON feeding the final report renderer.

## Out of Scope
- Comprehensive AST fixture curation (T060) remains future work; this effort reuses representative fixtures without expanding to additional languages yet.
- Publishing results to external dashboards or telemetry sinks.

## Interfaces
- `npm run verify -- --report` emits structured output consumed by a new reporter that writes `docs/test-report.md` (T051).
- Benchmark suites expose TypeScript helpers (e.g. [`tests/integration/benchmarks/utils/benchmarkRecorder.ts`](../../tests/integration/benchmarks/utils/benchmarkRecorder.ts)) that drive workspace fixtures and return metrics consumed by the reporter.
- Server telemetry API exposes `InferenceAccuracyTracker.snapshot()` via [`packages/shared/src/telemetry/inferenceAccuracy.ts`](../../packages/shared/src/telemetry/inferenceAccuracy.ts) consumed by benchmarks and, optionally, the extension.

## Dependencies
- Relies on existing latency tracker ([`packages/server/src/telemetry/latencyTracker.ts`](../../packages/server/src/telemetry/latencyTracker.ts)) and fixture verification CLI ([`scripts/fixture-tools/verify-fixtures.ts`](../../scripts/fixture-tools/verify-fixtures.ts)) to provide baseline metrics.
- Requires new Layer 4 documentation for the forthcoming implementation files (reports, benchmarks, telemetry tracker).
- Builds on SQLite persistence already established in [`packages/server/src/telemetry`](../../packages/server/src/telemetry).

## Open Questions
1. Should the report render as Markdown only, or export JSON for automation? (Initial pass opts for Markdown with embedded JSON appendix.)
2. Where should inference accuracy telemetry live to avoid coupling with latency tracker? (Resolved: shared module `packages/shared/src/telemetry/inferenceAccuracy.ts` re-exported through the server for downstream consumers.)
3. How do we handle flaky benchmarks? (Introduce threshold tolerances and retry logic to avoid false negatives.)

## Next Steps
1. Design Layer 4 docs for:
   - Regression report generator (`scripts/reporting/generateTestReport.ts`).
   - Benchmark harness (`tests/integration/benchmarks/rebuildStability.test.ts`).
   - Inference accuracy telemetry (`packages/shared/src/telemetry/inferenceAccuracy.ts`).
2. Implement inference accuracy tracker with unit coverage (T058).
3. Build benchmark harnesses and integrate into `verify` / `safe:commit` (T057).
4. Implement report generator and wire into CI + documentation (T051).
5. Update tasks.md after each stage and ensure MDMD docs reference the new code paths.
