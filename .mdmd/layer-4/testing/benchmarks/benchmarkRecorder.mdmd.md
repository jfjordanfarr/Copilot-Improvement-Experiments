# Benchmark Recorder Utility (Layer 4)

## Source Mapping
- Implementation: [`tests/integration/benchmarks/utils/benchmarkRecorder.ts`](../../../../tests/integration/benchmarks/utils/benchmarkRecorder.ts)
- Repo resolution: [`tests/integration/benchmarks/utils/repoPaths.ts`](../../../../tests/integration/benchmarks/utils/repoPaths.ts)
- Benchmark harnesses: [`tests/integration/benchmarks/rebuildStability.test.ts`](../../../../tests/integration/benchmarks/rebuildStability.test.ts)
- Design overview: [Benchmark & Telemetry Reporting](../../../layer-3/benchmark-telemetry-pipeline.mdmd.md)

## Purpose
Persist structured benchmark results to deterministic per-mode locations so the verification pipeline can diff outputs between runs, surface them in the aggregated telemetry report, and inspect verbose failure details on demand.

## Behaviour
- Resolves the transient output directory to `AI-Agent-Workspace/tmp/benchmarks` (overrideable via `BENCHMARK_OUTPUT_DIR`) and mirrors every write into `reports/benchmarks/<mode>/` for versioned tracking.
- Serialises payloads as pretty-printed JSON named `<benchmark>.<mode>.json` (with a `default` suffix when the mode is unspecified) so multiple modes can coexist without clobbering one another.
- Emits fixture-level diff bundles via `writeBenchmarkFixtureReport`, producing `{benchmark}/{mode}/index.json` plus one JSON file per fixture that highlights true/false positive and negative edges.

## Interactions
- [`rebuildStability.test.ts`](../../../../tests/integration/benchmarks/rebuildStability.test.ts) records the results of each snapshot iteration for later graph comparison and regression detection.
- Future benchmark suites (AST accuracy, latency dashboards) share the utility to emit machine-readable outputs consumed by `reports/test-report.self-similarity.md`, `reports/test-report.ast.md`, and future mode-specific reports.

## Evidence
- Invoked by the rebuild stability benchmark during `npm run test:integration`, producing JSON fixtures under `AI-Agent-Workspace/tmp/benchmarks` that back the graph drift assertions.

## Exported Symbols

#### writeBenchmarkResult
Writes a benchmark payload to disk after expanding environment overrides and ensuring the target directory exists, guaranteeing deterministic JSON artifacts for the reporting pipeline.
