# AST Accuracy Fixtures

## Metadata
- Layer: 4
- Implementation ID: IMP-507
- Code Paths:
  - [`tests/integration/benchmarks/fixtures/typescript/basic`](../../../tests/integration/benchmarks/fixtures/typescript/basic)
  - [`tests/integration/benchmarks/fixtures/typescript/layered`](../../../tests/integration/benchmarks/fixtures/typescript/layered)
  - [`tests/integration/benchmarks/fixtures/typescript/ky`](../../../tests/integration/benchmarks/fixtures/typescript/ky)
  - [`tests/integration/benchmarks/fixtures/c/basics`](../../../tests/integration/benchmarks/fixtures/c/basics)
  - [`tests/integration/benchmarks/fixtures/c/modular`](../../../tests/integration/benchmarks/fixtures/c/modular)
  - [`tests/integration/benchmarks/fixtures/python/basics`](../../../tests/integration/benchmarks/fixtures/python/basics)
  - [`tests/integration/benchmarks/fixtures/python/pipeline`](../../../tests/integration/benchmarks/fixtures/python/pipeline)
  - [`tests/integration/benchmarks/fixtures/rust/basics`](../../../tests/integration/benchmarks/fixtures/rust/basics)
  - [`tests/integration/benchmarks/fixtures/rust/analytics`](../../../tests/integration/benchmarks/fixtures/rust/analytics)
  - [`tests/integration/benchmarks/fixtures/java/basic`](../../../tests/integration/benchmarks/fixtures/java/basic)
  - [`tests/integration/benchmarks/fixtures/java/service`](../../../tests/integration/benchmarks/fixtures/java/service)
  - [`tests/integration/benchmarks/fixtures/ruby/basic`](../../../tests/integration/benchmarks/fixtures/ruby/basic)
  - [`tests/integration/benchmarks/fixtures/ruby/cli`](../../../tests/integration/benchmarks/fixtures/ruby/cli)
  - [`tests/integration/benchmarks/fixtures/fixtures.manifest.json`](../../../tests/integration/benchmarks/fixtures/fixtures.manifest.json)
- Related Tests: [`tests/integration/benchmarks/astAccuracy.test.ts`](../../../tests/integration/benchmarks/astAccuracy.test.ts)

## Purpose
Curate language-specific fixtures that measure how accurately the inference pipeline reconstructs dependency edges versus curated ground truth. Each fixture pair (`expected.json`, `inferred.json`) captures the precision/recall deltas we monitor inside the AST accuracy benchmark.

## Fixture Inventory

-### `ts-basic`
- Scope: Minimal TypeScript module graph with helpers split across multiple files.
- Source Files: [`src/index.ts`](../../../tests/integration/benchmarks/fixtures/typescript/basic/src/index.ts), [`src/models.ts`](../../../tests/integration/benchmarks/fixtures/typescript/basic/src/models.ts), [`src/util.ts`](../../../tests/integration/benchmarks/fixtures/typescript/basic/src/util.ts), [`src/types.ts`](../../../tests/integration/benchmarks/fixtures/typescript/basic/src/types.ts), [`src/helpers.ts`](../../../tests/integration/benchmarks/fixtures/typescript/basic/src/helpers.ts)
- Benchmark Intent: Verify import/usage detection inside a typical TS module fan-out while tolerating helper noise.

-### `ts-layered`
- Scope: TypeScript reporting service with layered services, repositories, and shared models.
- Source Files: [`src/index.ts`](../../../tests/integration/benchmarks/fixtures/typescript/layered/src/index.ts), [`src/services/reportService.ts`](../../../tests/integration/benchmarks/fixtures/typescript/layered/src/services/reportService.ts), [`src/services/dataService.ts`](../../../tests/integration/benchmarks/fixtures/typescript/layered/src/services/dataService.ts), [`src/utils/format.ts`](../../../tests/integration/benchmarks/fixtures/typescript/layered/src/utils/format.ts), [`src/models/widget.ts`](../../../tests/integration/benchmarks/fixtures/typescript/layered/src/models/widget.ts), [`src/repositories/storage.ts`](../../../tests/integration/benchmarks/fixtures/typescript/layered/src/repositories/storage.ts)
- Benchmark Intent: Stress graph reconstruction across a deeper TypeScript stack that mixes helper usage, repository imports, and shared domain models.

-### `ts-ky`
- Scope: Vendorized snapshot of the Ky HTTP client preserving its core, error, type, and utility modules.
- Source Files:
  - Core: [`src/core/Ky.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/core/Ky.ts), [`src/core/constants.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/core/constants.ts)
  - Errors: [`src/errors/HTTPError.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/errors/HTTPError.ts), [`src/errors/NonError.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/errors/NonError.ts), [`src/errors/TimeoutError.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/errors/TimeoutError.ts)
  - Entry: [`src/index.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/index.ts)
  - Types: [`src/types/common.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/types/common.ts), [`src/types/hooks.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/types/hooks.ts), [`src/types/ky.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/types/ky.ts), [`src/types/options.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/types/options.ts), [`src/types/request.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/types/request.ts), [`src/types/response.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/types/response.ts), [`src/types/ResponsePromise.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/types/ResponsePromise.ts), [`src/types/retry.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/types/retry.ts)
  - Utilities: [`src/utils/body.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/utils/body.ts), [`src/utils/delay.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/utils/delay.ts), [`src/utils/is.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/utils/is.ts), [`src/utils/merge.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/utils/merge.ts), [`src/utils/normalize.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/utils/normalize.ts), [`src/utils/options.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/utils/options.ts), [`src/utils/timeout.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/utils/timeout.ts), [`src/utils/type-guards.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/utils/type-guards.ts), [`src/utils/types.ts`](../../../tests/integration/benchmarks/fixtures/typescript/ky/src/utils/types.ts)
- Benchmark Intent: Measure inference accuracy against a real-world TypeScript codebase that relies on ESM-style `.js` import specifiers, layered re-exports, and helper utilities beyond our self-authored fixtures.
- Notes: Comment-aware import heuristics now filter documentation-only snippets (for example, `import ky from 'ky'` inside JSDoc), eliminating the earlier nine-missing/six-extra drift; `expected.json` and `inferred.json` currently align with 56 edges after deduplication.

-### `c-basics`
- Scope: Single translation unit calling into a companion implementation and header pair.
- Source Files: [`src/main.c`](../../../tests/integration/benchmarks/fixtures/c/basics/src/main.c), [`src/util.c`](../../../tests/integration/benchmarks/fixtures/c/basics/src/util.c), [`src/util.h`](../../../tests/integration/benchmarks/fixtures/c/basics/src/util.h), [`src/helpers.h`](../../../tests/integration/benchmarks/fixtures/c/basics/src/helpers.h)
- Benchmark Intent: Track `#include` resolution and call graph reconstruction for C projects that lean on headers.

-### `c-modular`
- Scope: Multi-file C pipeline coordinating metrics, logging, and orchestration helpers.
- Source Files: [`src/main.c`](../../../tests/integration/benchmarks/fixtures/c/modular/src/main.c), [`src/pipeline.c`](../../../tests/integration/benchmarks/fixtures/c/modular/src/pipeline.c), [`src/pipeline.h`](../../../tests/integration/benchmarks/fixtures/c/modular/src/pipeline.h), [`src/metrics.c`](../../../tests/integration/benchmarks/fixtures/c/modular/src/metrics.c), [`src/metrics.h`](../../../tests/integration/benchmarks/fixtures/c/modular/src/metrics.h), [`src/logger.c`](../../../tests/integration/benchmarks/fixtures/c/modular/src/logger.c), [`src/logger.h`](../../../tests/integration/benchmarks/fixtures/c/modular/src/logger.h)
- Benchmark Intent: Capture layered include chains, static helpers, and call-site coverage representative of a modest C service boundary.

-### `python-basics`
- Scope: Python package entry point validating argument seeds and aggregating metrics.
- Source Files: [`src/main.py`](../../../tests/integration/benchmarks/fixtures/python/basics/src/main.py), [`src/util.py`](../../../tests/integration/benchmarks/fixtures/python/basics/src/util.py), [`src/helpers.py`](../../../tests/integration/benchmarks/fixtures/python/basics/src/helpers.py)
- Benchmark Intent: Examine module import handling and helper usage detection in a dynamic language.

-### `python-pipeline`
- Scope: Python reporting workflow with repositories, validators, and dataclass-backed summaries.
- Source Files: [`src/main.py`](../../../tests/integration/benchmarks/fixtures/python/pipeline/src/main.py), [`src/pipeline.py`](../../../tests/integration/benchmarks/fixtures/python/pipeline/src/pipeline.py), [`src/repositories.py`](../../../tests/integration/benchmarks/fixtures/python/pipeline/src/repositories.py), [`src/metrics.py`](../../../tests/integration/benchmarks/fixtures/python/pipeline/src/metrics.py), [`src/validators.py`](../../../tests/integration/benchmarks/fixtures/python/pipeline/src/validators.py)
- Benchmark Intent: Exercise chained imports and validation helpers in a multi-module Python package to surface control-flow heavy graphs.

### `rust-basics`
- Scope: Small Rust crate with helper modules for math and utility routines.
- Source Files: [`src/main.rs`](../../../tests/integration/benchmarks/fixtures/rust/basics/src/main.rs), [`src/math.rs`](../../../tests/integration/benchmarks/fixtures/rust/basics/src/math.rs), [`src/utils.rs`](../../../tests/integration/benchmarks/fixtures/rust/basics/src/utils.rs)
- Benchmark Intent: Validate module linkage reconstruction inside a Rust crate that mixes cross-module calls and helper utilities.

### `rust-analytics`
- Scope: Rust analytics crate combining IO, metrics, and alert evaluation logic.
- Source Files: [`src/main.rs`](../../../tests/integration/benchmarks/fixtures/rust/analytics/src/main.rs), [`src/analytics.rs`](../../../tests/integration/benchmarks/fixtures/rust/analytics/src/analytics.rs), [`src/io.rs`](../../../tests/integration/benchmarks/fixtures/rust/analytics/src/io.rs), [`src/metrics.rs`](../../../tests/integration/benchmarks/fixtures/rust/analytics/src/metrics.rs), [`src/models.rs`](../../../tests/integration/benchmarks/fixtures/rust/analytics/src/models.rs)
- Benchmark Intent: Observe how module graphs behave once Vec-backed IO, struct-heavy models, and multi-stage analysis logic interplay.

### `java-basic`
- Scope: Java reporting application with a reader, catalog, and formatter stack.
- Source Files: [`src/com/example/app/App.java`](../../../tests/integration/benchmarks/fixtures/java/basic/src/com/example/app/App.java), [`src/com/example/data/Reader.java`](../../../tests/integration/benchmarks/fixtures/java/basic/src/com/example/data/Reader.java), [`src/com/example/data/Catalog.java`](../../../tests/integration/benchmarks/fixtures/java/basic/src/com/example/data/Catalog.java), [`src/com/example/format/ReportWriter.java`](../../../tests/integration/benchmarks/fixtures/java/basic/src/com/example/format/ReportWriter.java), [`src/com/example/model/Record.java`](../../../tests/integration/benchmarks/fixtures/java/basic/src/com/example/model/Record.java)
- Benchmark Intent: Establish JVM coverage by mixing package-level imports, record usage, and formatter ↔ catalog dependencies.

### `java-service`
- Scope: Java analytics service composed of repository, analyzer, metrics, and logging layers.
- Source Files: [`src/com/example/service/AppService.java`](../../../tests/integration/benchmarks/fixtures/java/service/src/com/example/service/AppService.java), [`src/com/example/service/analytics/Analyzer.java`](../../../tests/integration/benchmarks/fixtures/java/service/src/com/example/service/analytics/Analyzer.java), [`src/com/example/service/data/Repository.java`](../../../tests/integration/benchmarks/fixtures/java/service/src/com/example/service/data/Repository.java), [`src/com/example/service/data/SourceRegistry.java`](../../../tests/integration/benchmarks/fixtures/java/service/src/com/example/service/data/SourceRegistry.java), [`src/com/example/service/metrics/SummaryBuilder.java`](../../../tests/integration/benchmarks/fixtures/java/service/src/com/example/service/metrics/SummaryBuilder.java), [`src/com/example/service/model/Sample.java`](../../../tests/integration/benchmarks/fixtures/java/service/src/com/example/service/model/Sample.java), [`src/com/example/service/model/Summary.java`](../../../tests/integration/benchmarks/fixtures/java/service/src/com/example/service/model/Summary.java), [`src/com/example/service/util/Logger.java`](../../../tests/integration/benchmarks/fixtures/java/service/src/com/example/service/util/Logger.java)
- Benchmark Intent: Capture richer class graphs with constructor injection, layered analytics, and shared utility modules emblematic of enterprise Java services.

### `ruby-basic`
- Scope: Ruby module namespace coordinating a data store, formatter, and reporter.
- Source Files: [`lib/main.rb`](../../../tests/integration/benchmarks/fixtures/ruby/basic/lib/main.rb), [`lib/data_store.rb`](../../../tests/integration/benchmarks/fixtures/ruby/basic/lib/data_store.rb), [`lib/reporter.rb`](../../../tests/integration/benchmarks/fixtures/ruby/basic/lib/reporter.rb), [`lib/formatter.rb`](../../../tests/integration/benchmarks/fixtures/ruby/basic/lib/formatter.rb), [`lib/templates.rb`](../../../tests/integration/benchmarks/fixtures/ruby/basic/lib/templates.rb)
- Benchmark Intent: Introduce Ruby `require_relative` graphs and module namespaces to benchmark dynamic language edge reconstruction beyond Python.

### `ruby-cli`
- Scope: Ruby CLI surface layering command dispatch, services, cache, and logging helpers.
- Source Files: [`lib/cli.rb`](../../../tests/integration/benchmarks/fixtures/ruby/cli/lib/cli.rb), [`lib/commands/report.rb`](../../../tests/integration/benchmarks/fixtures/ruby/cli/lib/commands/report.rb), [`lib/services/analyzer.rb`](../../../tests/integration/benchmarks/fixtures/ruby/cli/lib/services/analyzer.rb), [`lib/services/data_loader.rb`](../../../tests/integration/benchmarks/fixtures/ruby/cli/lib/services/data_loader.rb), [`lib/services/cache.rb`](../../../tests/integration/benchmarks/fixtures/ruby/cli/lib/services/cache.rb), [`lib/support/logger.rb`](../../../tests/integration/benchmarks/fixtures/ruby/cli/lib/support/logger.rb)
- Benchmark Intent: Provide a denser Ruby dependency mesh with cross-service chatter and shared logging utilities to test how the inference pipeline scales with CLI-oriented gems.

## Operational Notes
- Fixture metadata is centralised in [`fixtures.manifest.json`](../../../tests/integration/benchmarks/fixtures/fixtures.manifest.json) and consumed by the benchmark harness to honour `BENCHMARK_MODE` filters.
- Ground truth graphs live in each fixture’s `expected.json`; the `inferred.json` captures current system behaviour so we can assert precision/recall deltas and track regressions in `reports/test-report.md`.
- New fixtures should remain deterministic, avoid external dependencies, and include a brief summary here so graph audits keep source coverage intact.
- TypeScript now includes two synthetic fixtures and the Ky snapshot, while other languages maintain paired baseline/layered scenarios so accuracy metrics span simple through moderately complex graphs without immediately adopting heavyweight OSS codebases.

## Shared Reporting Types

### BenchmarkEnvironment
- Defined in [`packages/shared/src/reporting/testReport.ts`](../../../packages/shared/src/reporting/testReport.ts).
- Describes runtime characteristics (Node version, platform, architecture, provider mode) attached to each benchmark record for provenance.

### ReportSection
- Defined in [`packages/shared/src/reporting/testReport.ts`](../../../packages/shared/src/reporting/testReport.ts).
- Represents the rendered Markdown body for a single benchmark, enabling the formatter to add new section types without rewriting report plumbing.
