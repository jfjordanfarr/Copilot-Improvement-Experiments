# Benchmark Recorder Utility (Layer 4)

## Source Mapping
- Implementation: [`tests/integration/benchmarks/utils/benchmarkRecorder.ts`](../../../../tests/integration/benchmarks/utils/benchmarkRecorder.ts)
- Repo resolution: [`tests/integration/benchmarks/utils/repoPaths.ts`](../../../../tests/integration/benchmarks/utils/repoPaths.ts)
- Benchmark harnesses: [`tests/integration/benchmarks/rebuildStability.test.ts`](../../../../tests/integration/benchmarks/rebuildStability.test.ts)
- Design overview: [Benchmark & Telemetry Reporting](../../../layer-3/benchmark-telemetry-pipeline.mdmd.md)

## Purpose
Persist structured benchmark results to a deterministic location so the verification pipeline can diff outputs between runs and surface them in the aggregated telemetry report.

## Behaviour
- Resolves the default output directory to `AI-Agent-Workspace/tmp/benchmarks` relative to the repository root, creating directories as needed.
- Allows callers to override the output directory via the `BENCHMARK_OUTPUT_DIR` environment variable for ad-hoc investigations.
- Serialises payloads as pretty-printed JSON and writes them to `<benchmark-name>.json`, overwriting stale files from earlier runs.

## Interactions
- [`rebuildStability.test.ts`](../../../../tests/integration/benchmarks/rebuildStability.test.ts) records the results of each snapshot iteration for later graph comparison and regression detection.
- Future benchmark suites (AST accuracy, latency dashboards) can share the utility to emit machine-readable outputs consumed by `docs/test-report.md` once that report writer lands.

## Evidence
- Invoked by the rebuild stability benchmark during `npm run test:integration`, producing JSON fixtures under `AI-Agent-Workspace/tmp/benchmarks` that back the graph drift assertions.

## Exported Symbols

#### writeBenchmarkResult
Writes a benchmark payload to disk after expanding environment overrides and ensuring the target directory exists, guaranteeing deterministic JSON artifacts for the reporting pipeline.
