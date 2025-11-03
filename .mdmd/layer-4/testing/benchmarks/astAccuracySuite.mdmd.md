# AST Accuracy Benchmark Suite (Layer 4)

## Source Mapping
- Planned test: [`tests/integration/benchmarks/astAccuracy.test.ts`](../../../../tests/integration/benchmarks/astAccuracy.test.ts)
- AST fixtures: [`tests/integration/benchmarks/fixtures`](../../../../tests/integration/benchmarks/fixtures) (planned representative repositories)
- Inference telemetry: [`packages/shared/src/telemetry/inferenceAccuracy.ts`](../../../../packages/shared/src/telemetry/inferenceAccuracy.ts)
- Report generator: `scripts/reporting/generateTestReport.ts`
- Design overview: [Benchmark & Telemetry Reporting](../../../layer-3/benchmark-telemetry-pipeline.mdmd.md)
- Tasks: [T058](../../../../specs/001-link-aware-diagnostics/tasks.md), [T061](../../../../specs/001-link-aware-diagnostics/tasks.md), [T062](../../../../specs/001-link-aware-diagnostics/tasks.md)

## Purpose
Quantify how accurately the pseudocode AST matches ground-truth language-specific ASTs across curated fixtures, surfacing precision/recall metrics that guide inference improvements.

## Behaviour
- Loads pre-generated AST fixtures for each benchmark workspace and compares them against inferred relationships generated or provided during the test run (initially fixture-provided inference outputs).
- Blends workspace-authored fixtures with vendored repositories cloned into per-run staging directories (Ky, libuv, …) so accuracy metrics cover real-world include/import patterns without sacrificing determinism.
- Records true/false positive/negative counts per artifact and relationship kind via the `InferenceAccuracyTracker`.
- Produces aggregate metrics (precision, recall, F1) and detailed miss lists, exporting per-mode JSON summaries plus fixture-by-fixture diff bundles under `AI-Agent-Workspace/tmp/benchmarks/ast-accuracy/<mode>/`.
- Supports mode switching (`--mode ast` vs `--mode self-similarity`) controlled by Task T062 so CI can focus on the most relevant benchmarks.
- Provides configurable tolerance thresholds to ignore low-impact misses or mark critical regressions.

## Interactions
- Executed as part of the full verification pipeline; can also be invoked independently via `npm run test:benchmarks -- --ast-only` for focused accuracy audits.
- Feeds metrics directly into the test report generator, which embeds tables and links to raw JSON artifacts in `reports/test-report.ast.md`.
- Optionally emits VS Code output (via planned command) for manual diagnosis when developers run the suite locally.

## Evidence
- Benchmark fixtures will include golden AST/graph pairs stored alongside the tests for deterministic comparisons.
- Unit coverage for diff utilities ensures edge classification behaves as expected; integration run captured by the report completes the chain.
