# AST Accuracy Fixtures

## Metadata
- Layer: 4
- Implementation ID: IMP-507
- Code Paths:
  - [`tests/integration/benchmarks/fixtures/ts-basic`](../../../tests/integration/benchmarks/fixtures/ts-basic)
  - [`tests/integration/benchmarks/fixtures/c-basics`](../../../tests/integration/benchmarks/fixtures/c-basics)
  - [`tests/integration/benchmarks/fixtures/python-basics`](../../../tests/integration/benchmarks/fixtures/python-basics)
  - [`tests/integration/benchmarks/fixtures/rust-basics`](../../../tests/integration/benchmarks/fixtures/rust-basics)
  - [`tests/integration/benchmarks/fixtures/fixtures.manifest.json`](../../../tests/integration/benchmarks/fixtures/fixtures.manifest.json)
- Related Tests: [`tests/integration/benchmarks/astAccuracy.test.ts`](../../../tests/integration/benchmarks/astAccuracy.test.ts)

## Purpose
Curate language-specific fixtures that measure how accurately the inference pipeline reconstructs dependency edges versus curated ground truth. Each fixture pair (`expected.json`, `inferred.json`) captures the precision/recall deltas we monitor inside the AST accuracy benchmark.

## Fixture Inventory

### `ts-basic`
- Scope: Minimal TypeScript module graph with helpers split across multiple files.
- Source Files: [`src/index.ts`](../../../tests/integration/benchmarks/fixtures/ts-basic/src/index.ts), [`src/models.ts`](../../../tests/integration/benchmarks/fixtures/ts-basic/src/models.ts), [`src/util.ts`](../../../tests/integration/benchmarks/fixtures/ts-basic/src/util.ts), [`src/types.ts`](../../../tests/integration/benchmarks/fixtures/ts-basic/src/types.ts), [`src/helpers.ts`](../../../tests/integration/benchmarks/fixtures/ts-basic/src/helpers.ts)
- Benchmark Intent: Verify import/usage detection inside a typical TS module fan-out while tolerating helper noise.

### `c-basics`
- Scope: Single translation unit calling into a companion implementation and header pair.
- Source Files: [`src/main.c`](../../../tests/integration/benchmarks/fixtures/c-basics/src/main.c), [`src/util.c`](../../../tests/integration/benchmarks/fixtures/c-basics/src/util.c), [`src/util.h`](../../../tests/integration/benchmarks/fixtures/c-basics/src/util.h), [`src/helpers.h`](../../../tests/integration/benchmarks/fixtures/c-basics/src/helpers.h)
- Benchmark Intent: Track `#include` resolution and call graph reconstruction for C projects that lean on headers.

### `python-basics`
- Scope: Python package entry point validating argument seeds and aggregating metrics.
- Source Files: [`src/main.py`](../../../tests/integration/benchmarks/fixtures/python-basics/src/main.py), [`src/util.py`](../../../tests/integration/benchmarks/fixtures/python-basics/src/util.py), [`src/helpers.py`](../../../tests/integration/benchmarks/fixtures/python-basics/src/helpers.py)
- Benchmark Intent: Examine module import handling and helper usage detection in a dynamic language.

### `rust-basics`
- Scope: Small Rust crate with helper modules for math and utility routines.
- Source Files: [`src/main.rs`](../../../tests/integration/benchmarks/fixtures/rust-basics/src/main.rs), [`src/math.rs`](../../../tests/integration/benchmarks/fixtures/rust-basics/src/math.rs), [`src/utils.rs`](../../../tests/integration/benchmarks/fixtures/rust-basics/src/utils.rs)
- Benchmark Intent: Validate module linkage reconstruction inside a Rust crate that mixes cross-module calls and helper utilities.

## Operational Notes
- Fixture metadata is centralised in [`fixtures.manifest.json`](../../../tests/integration/benchmarks/fixtures/fixtures.manifest.json) and consumed by the benchmark harness to honour `BENCHMARK_MODE` filters.
- Ground truth graphs live in each fixture’s `expected.json`; the `inferred.json` captures current system behaviour so we can assert precision/recall deltas and track regressions in `docs/test-report.md`.
- New fixtures should remain deterministic, avoid external dependencies, and include a brief summary here so graph audits keep source coverage intact.

## Shared Reporting Types

### BenchmarkEnvironment
- Defined in [`packages/shared/src/reporting/testReport.ts`](../../../packages/shared/src/reporting/testReport.ts).
- Describes runtime characteristics (Node version, platform, architecture, provider mode) attached to each benchmark record for provenance.

### ReportSection
- Defined in [`packages/shared/src/reporting/testReport.ts`](../../../packages/shared/src/reporting/testReport.ts).
- Represents the rendered Markdown body for a single benchmark, enabling the formatter to add new section types without rewriting report plumbing.
