# Test Report

Benchmark reporting now emits per-mode artifacts:

- `reports/test-report.self-similarity.md` — self-similarity regression runs.
- `reports/test-report.ast.md` — AST ground-truth comparisons.

Versioned JSON sources live under `reports/benchmarks/<mode>/`. Verbose fixture diagnostics (including all false positives/negatives) are available in `AI-Agent-Workspace/tmp/benchmarks/<benchmark>/<mode>/`.
