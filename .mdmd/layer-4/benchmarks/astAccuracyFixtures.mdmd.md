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
  - [`tests/integration/benchmarks/fixtures/c/libuv`](../../../tests/integration/benchmarks/fixtures/c/libuv)
  - [`tests/integration/benchmarks/fixtures/python/basics`](../../../tests/integration/benchmarks/fixtures/python/basics)
  - [`tests/integration/benchmarks/fixtures/python/pipeline`](../../../tests/integration/benchmarks/fixtures/python/pipeline)
  - [`tests/integration/benchmarks/fixtures/python/requests`](../../../tests/integration/benchmarks/fixtures/python/requests)
  - [`tests/integration/benchmarks/fixtures/rust/basics`](../../../tests/integration/benchmarks/fixtures/rust/basics)
  - [`tests/integration/benchmarks/fixtures/rust/analytics`](../../../tests/integration/benchmarks/fixtures/rust/analytics)
  - [`tests/integration/benchmarks/fixtures/rust/log`](../../../tests/integration/benchmarks/fixtures/rust/log)
  - [`tests/integration/benchmarks/fixtures/java/basic`](../../../tests/integration/benchmarks/fixtures/java/basic)
  - [`tests/integration/benchmarks/fixtures/java/service`](../../../tests/integration/benchmarks/fixtures/java/service)
  - [`tests/integration/benchmarks/fixtures/java/okhttp`](../../../tests/integration/benchmarks/fixtures/java/okhttp)
  - [`tests/integration/benchmarks/fixtures/ruby/basic`](../../../tests/integration/benchmarks/fixtures/ruby/basic)
  - [`tests/integration/benchmarks/fixtures/ruby/cli`](../../../tests/integration/benchmarks/fixtures/ruby/cli)
  - [`tests/integration/benchmarks/fixtures/fixtures.manifest.json`](../../../tests/integration/benchmarks/fixtures/fixtures.manifest.json)
- Related Tests: [`tests/integration/benchmarks/astAccuracy.test.ts`](../../../tests/integration/benchmarks/astAccuracy.test.ts)

## Purpose
Curate language-specific fixtures that measure how accurately the inference pipeline reconstructs dependency edges versus curated ground truth. Each fixture pair (`expected.json`, `inferred.json`) captures the precision/recall deltas we monitor inside the AST accuracy benchmark.

## Fixture Inventory

### Vendored Fixture Integrity (auto-generated)

<!-- benchmark-vendor-inventory:start -->
#### `ts-ky` (Ky HTTP client repository)

- **Source**: `sindresorhus/ky` @ `5d3684ed0e27c1a89f9d13f09523367d86cbabfe` — MIT
- **Integrity**: `sha256` root `2c49edba6c5393bad18daf38d76375b014d9706d573193307ccc779bde9099a8` (43 files)
- **File Selection**: include `**/*.ts`, `**/*.tsx`; exclude `**/*.d.ts`, `**/__tests__/**`, `**/*.test.ts`, `**/*.spec.ts` (resolved 43 files)

#### `c-libuv` (libuv repository)

- **Source**: `libuv/libuv` @ `12d1ed1380c59c5ec27503cf149833de6f0e6bb0` — MIT
- **Integrity**: `sha256` root `f057cbccf2b7939e4ffa78e7ab98d4ac2aee56cc7fff23d2c9fbbbaa83920f8c` (118 files)
- **File Selection**: include `src/**/*.c`, `src/**/*.h`, `include/**/*.h`; exclude `test/**`, `docs/**`, `cmake/**`, `samples/**` (resolved 118 files)

#### `python-requests` (Requests HTTP client repository)

- **Source**: `psf/requests` @ `61e2240f283f15780ac2d0e2cfefb0fd6fdab627` — Apache-2.0
- **Integrity**: `sha256` root `15a1472f5b939c3180740202cdc7b92a519a28297318864c16d75d87554345b6` (18 files)
- **File Selection**: include `src/requests/**/*.py`; exclude `src/requests/__pycache__/**` (resolved 18 files)

#### `rust-log` (Rust logging facade (rust-lang/log))

- **Source**: `rust-lang/log` @ `6e1735597bb21c5d979a077395df85e1d633e077` — Apache-2.0 OR MIT
- **Integrity**: `sha256` root `28f475a305a4226ed660b7c5cccb193715970a30e66d12fc55c7705b2e01700c` (10 files)
- **File Selection**: include `src/**/*.rs`, `Cargo.toml`; exclude `tests/**`, `benches/**`, `examples/**`, `rfcs/**` (resolved 10 files)

#### `java-okhttp` (OkHttp client repository)

- **Source**: `square/okhttp` @ `ad97bd3df34376eec85aa187dc8f45cfde8a2c01` — Apache-2.0
- **Integrity**: `sha256` root `be90ccd6ebe51756c3a48287cd7249672be9d3eb3672215d4c33af9295881bad` (151 files)
- **File Selection**: include `okhttp/src/main/java/**/*.java`, `mockwebserver/src/main/java/**/*.java`, `okcurl/src/main/java/**/*.java`, `okhttp-dnsoverhttps/src/main/java/**/*.java`, `okhttp-logging-interceptor/src/main/java/**/*.java`, `okhttp-sse/src/main/java/**/*.java`, `okhttp-testing-support/src/main/java/**/*.java`, `okhttp-tests/src/main/java/**/*.java`, `okhttp-tls/src/main/java/**/*.java`, `okhttp-urlconnection/src/main/java/**/*.java`; exclude `**/src/test/**`, `samples/**` (resolved 151 files)
<!-- benchmark-vendor-inventory:end -->

-### `ts-basic`
- Scope: Minimal TypeScript module graph with helpers split across multiple files.
- Source Files: [`src/index.ts`](../../../tests/integration/benchmarks/fixtures/typescript/basic/src/index.ts), [`src/models.ts`](../../../tests/integration/benchmarks/fixtures/typescript/basic/src/models.ts), [`src/util.ts`](../../../tests/integration/benchmarks/fixtures/typescript/basic/src/util.ts), [`src/types.ts`](../../../tests/integration/benchmarks/fixtures/typescript/basic/src/types.ts), [`src/helpers.ts`](../../../tests/integration/benchmarks/fixtures/typescript/basic/src/helpers.ts)
- Benchmark Intent: Verify import/usage detection inside a typical TS module fan-out while tolerating helper noise.

-### `ts-layered`
- Scope: TypeScript reporting service with layered services, repositories, and shared models.
- Source Files: [`src/index.ts`](../../../tests/integration/benchmarks/fixtures/typescript/layered/src/index.ts), [`src/services/reportService.ts`](../../../tests/integration/benchmarks/fixtures/typescript/layered/src/services/reportService.ts), [`src/services/dataService.ts`](../../../tests/integration/benchmarks/fixtures/typescript/layered/src/services/dataService.ts), [`src/utils/format.ts`](../../../tests/integration/benchmarks/fixtures/typescript/layered/src/utils/format.ts), [`src/models/widget.ts`](../../../tests/integration/benchmarks/fixtures/typescript/layered/src/models/widget.ts), [`src/repositories/storage.ts`](../../../tests/integration/benchmarks/fixtures/typescript/layered/src/repositories/storage.ts)
- Benchmark Intent: Stress graph reconstruction across a deeper TypeScript stack that mixes helper usage, repository imports, and shared domain models.

### `ts-ky`
- Scope: Full repository clone of `sindresorhus/ky` at the pinned commit; staging pulls the entire tree into a temporary workspace before analysis.
- File Selection: Manifest glob rules include `**/*.ts` / `**/*.tsx` while excluding `.d.ts` and test fixtures so integrity hashing reflects the real production surface without folding in generated assets.
- Benchmark Intent: Measure inference accuracy against a real-world TypeScript codebase that relies on ESM-style `.js` import specifiers, layered re-exports, and helper utilities beyond our self-authored fixtures.
- Notes: Comment-aware import heuristics now filter documentation-only snippets (for example, `import ky from 'ky'` inside JSDoc), eliminating the earlier nine-missing/six-extra drift; precision/recall is evaluated against the staging clone rather than a manually vendored subset.

-### `c-basics`
- Scope: Single translation unit calling into a companion implementation and header pair.
- Source Files: [`src/main.c`](../../../tests/integration/benchmarks/fixtures/c/basics/src/main.c), [`src/util.c`](../../../tests/integration/benchmarks/fixtures/c/basics/src/util.c), [`src/util.h`](../../../tests/integration/benchmarks/fixtures/c/basics/src/util.h), [`src/helpers.h`](../../../tests/integration/benchmarks/fixtures/c/basics/src/helpers.h)
- Benchmark Intent: Track `#include` resolution and call graph reconstruction for C projects that lean on headers.

-### `c-modular`
- Scope: Multi-file C pipeline coordinating metrics, logging, and orchestration helpers.
- Source Files: [`src/main.c`](../../../tests/integration/benchmarks/fixtures/c/modular/src/main.c), [`src/pipeline.c`](../../../tests/integration/benchmarks/fixtures/c/modular/src/pipeline.c), [`src/pipeline.h`](../../../tests/integration/benchmarks/fixtures/c/modular/src/pipeline.h), [`src/metrics.c`](../../../tests/integration/benchmarks/fixtures/c/modular/src/metrics.c), [`src/metrics.h`](../../../tests/integration/benchmarks/fixtures/c/modular/src/metrics.h), [`src/logger.c`](../../../tests/integration/benchmarks/fixtures/c/modular/src/logger.c), [`src/logger.h`](../../../tests/integration/benchmarks/fixtures/c/modular/src/logger.h)
- Benchmark Intent: Capture layered include chains, static helpers, and call-site coverage representative of a modest C service boundary.

### `c-libuv`
- Scope: Entire `libuv/libuv` repository cloned into a staging workspace; glob filters include all `src/**/*.c`, `src/**/*.h`, and `include/**/*.h` artifacts so platform-specific layers participate in the benchmark without manual pruning.
- File Selection: Deterministic glob expansion excludes upstream benchmarks, docs, and build artefacts (e.g., `test/`, `docs/`, `cmake/`) while hashing the production portability core.
- Benchmark Intent: Measure include fan-out across a production portability layer with deep platform-specific headers while remaining deterministic for benchmarking.
- Provenance: Materialized from [`libuv/libuv`](https://github.com/libuv/libuv) (`12d1ed1380c59c5ec27503cf149833de6f0e6bb0`); the integrity pipeline pins the commit and refetches it for every verification run.

-### `python-basics`
- Scope: Python package entry point validating argument seeds and aggregating metrics.
- Source Files: [`src/main.py`](../../../tests/integration/benchmarks/fixtures/python/basics/src/main.py), [`src/util.py`](../../../tests/integration/benchmarks/fixtures/python/basics/src/util.py), [`src/helpers.py`](../../../tests/integration/benchmarks/fixtures/python/basics/src/helpers.py)
- Benchmark Intent: Examine module import handling and helper usage detection in a dynamic language.

-### `python-pipeline`
- Scope: Python reporting workflow with repositories, validators, and dataclass-backed summaries.
- Source Files: [`src/main.py`](../../../tests/integration/benchmarks/fixtures/python/pipeline/src/main.py), [`src/pipeline.py`](../../../tests/integration/benchmarks/fixtures/python/pipeline/src/pipeline.py), [`src/repositories.py`](../../../tests/integration/benchmarks/fixtures/python/pipeline/src/repositories.py), [`src/metrics.py`](../../../tests/integration/benchmarks/fixtures/python/pipeline/src/metrics.py), [`src/validators.py`](../../../tests/integration/benchmarks/fixtures/python/pipeline/src/validators.py)
- Benchmark Intent: Exercise chained imports and validation helpers in a multi-module Python package to surface control-flow heavy graphs.

### `python-requests`
- Scope: Real-world `psf/requests` 2.32.3 client stack surfaced through the manifest’s git materializer while trimming tests and docs to focus on the runtime surface.
- File Selection: Integrates all `src/requests/**/*.py` modules (18 files) with integrity pinning so optional vendored dependencies remain externally supplied.
- Benchmark Intent: Stress our Python import reconstruction against a production package that mixes module-level constants, compatibility helpers, and session orchestration.
- Dynamic Import Notes: `requests.compat` relies on `importlib.import_module` to resolve either `chardet` or `charset_normalizer`, while `requests.packages` rewrites `sys.modules` to expose vendored namespaces (`requests.packages.urllib3.*` and conditional `chardet`). These behaviours inform why the expected graph focuses on intra-package imports—the dynamic aliases are noted here for manual review even though they do not surface as static edges.

### `rust-basics`
- Scope: Small Rust crate with helper modules for math and utility routines.
- Source Files: [`src/main.rs`](../../../tests/integration/benchmarks/fixtures/rust/basics/src/main.rs), [`src/math.rs`](../../../tests/integration/benchmarks/fixtures/rust/basics/src/math.rs), [`src/utils.rs`](../../../tests/integration/benchmarks/fixtures/rust/basics/src/utils.rs)
- Benchmark Intent: Validate module linkage reconstruction inside a Rust crate that mixes cross-module calls and helper utilities.

### `rust-analytics`
- Scope: Rust analytics crate combining IO, metrics, and alert evaluation logic.
- Source Files: [`src/main.rs`](../../../tests/integration/benchmarks/fixtures/rust/analytics/src/main.rs), [`src/analytics.rs`](../../../tests/integration/benchmarks/fixtures/rust/analytics/src/analytics.rs), [`src/io.rs`](../../../tests/integration/benchmarks/fixtures/rust/analytics/src/io.rs), [`src/metrics.rs`](../../../tests/integration/benchmarks/fixtures/rust/analytics/src/metrics.rs), [`src/models.rs`](../../../tests/integration/benchmarks/fixtures/rust/analytics/src/models.rs)
- Benchmark Intent: Observe how module graphs behave once Vec-backed IO, struct-heavy models, and multi-stage analysis logic interplay.

### `rust-log`
- Scope: Vendored `rust-lang/log` v0.4.28 staged through the manifest materializer, trimmed to `src/**/*.rs` plus `Cargo.toml` so the crate’s macro exports, private API, and `kv` support remain intact without shipping benches or tests.
- File Selection: Manifest glob rules resolve 10 files covering `lib.rs`, `macros.rs`, `__private_api.rs`, and the complete `kv` tree, matching the integrity digest used by the benchmark pipeline.
- Benchmark Intent: Ensure the inference engine captures macro-driven edges (`macro_use` → `__private_api`), reciprocal module wiring, and feature-gated helpers that surface only when `kv` features are enabled—providing a production Rust facade to complement our synthetic crates.

### `java-basic`
- Scope: Java reporting application with a reader, catalog, and formatter stack.
- Source Files: [`src/com/example/app/App.java`](../../../tests/integration/benchmarks/fixtures/java/basic/src/com/example/app/App.java), [`src/com/example/data/Reader.java`](../../../tests/integration/benchmarks/fixtures/java/basic/src/com/example/data/Reader.java), [`src/com/example/data/Catalog.java`](../../../tests/integration/benchmarks/fixtures/java/basic/src/com/example/data/Catalog.java), [`src/com/example/format/ReportWriter.java`](../../../tests/integration/benchmarks/fixtures/java/basic/src/com/example/format/ReportWriter.java), [`src/com/example/model/Record.java`](../../../tests/integration/benchmarks/fixtures/java/basic/src/com/example/model/Record.java)
- Benchmark Intent: Establish JVM coverage by mixing package-level imports, record usage, and formatter ↔ catalog dependencies.

### `java-service`
- Scope: Java analytics service composed of repository, analyzer, metrics, and logging layers.
- Source Files: [`src/com/example/service/AppService.java`](../../../tests/integration/benchmarks/fixtures/java/service/src/com/example/service/AppService.java), [`src/com/example/service/analytics/Analyzer.java`](../../../tests/integration/benchmarks/fixtures/java/service/src/com/example/service/analytics/Analyzer.java), [`src/com/example/service/data/Repository.java`](../../../tests/integration/benchmarks/fixtures/java/service/src/com/example/service/data/Repository.java), [`src/com/example/service/data/SourceRegistry.java`](../../../tests/integration/benchmarks/fixtures/java/service/src/com/example/service/data/SourceRegistry.java), [`src/com/example/service/metrics/SummaryBuilder.java`](../../../tests/integration/benchmarks/fixtures/java/service/src/com/example/service/metrics/SummaryBuilder.java), [`src/com/example/service/model/Sample.java`](../../../tests/integration/benchmarks/fixtures/java/service/src/com/example/service/model/Sample.java), [`src/com/example/service/model/Summary.java`](../../../tests/integration/benchmarks/fixtures/java/service/src/com/example/service/model/Summary.java), [`src/com/example/service/util/Logger.java`](../../../tests/integration/benchmarks/fixtures/java/service/src/com/example/service/util/Logger.java)
- Benchmark Intent: Capture richer class graphs with constructor injection, layered analytics, and shared utility modules emblematic of enterprise Java services.

### `java-okhttp`
- Scope: Vendored OkHttp 3.14.9 modules spanning the core client, DNS-over-HTTPS, SSE, TLS, URLConnection shims, logging interceptors, and the mock web server so the benchmark samples inter-package edges within a production-grade HTTP stack.
- File Selection: Manifest sparse checkout limits the workspace to `src/main/java` trees for ten modules (151 Java files) and excludes tests and samples while hashing the vendored sources for integrity checks.
- Benchmark Intent: Stress inference on a real Java ecosystem that mixes public API façades, internal helpers, and cross-module orchestration—surfacing import graphs that go well beyond our synthetic fixtures and exercising the fallback engine’s Java heuristics at scale.

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
- Ground truth graphs live in each fixture’s `expected.json`; the `inferred.json` captures current system behaviour so we can assert precision/recall deltas and track regressions in `reports/test-report.ast.md`.
- New fixtures should remain deterministic, avoid external dependencies, and include a brief summary here so graph audits keep source coverage intact.
- TypeScript now includes two synthetic fixtures and the Ky snapshot, while other languages maintain paired baseline/layered scenarios so accuracy metrics span simple through moderately complex graphs without immediately adopting heavyweight OSS codebases.

## Shared Reporting Types

### BenchmarkEnvironment
- Defined in [`packages/shared/src/reporting/testReport.ts`](../../../packages/shared/src/reporting/testReport.ts).
- Describes runtime characteristics (Node version, platform, architecture, provider mode) attached to each benchmark record for provenance.

### ReportSection
- Defined in [`packages/shared/src/reporting/testReport.ts`](../../../packages/shared/src/reporting/testReport.ts).
- Represents the rendered Markdown body for a single benchmark, enabling the formatter to add new section types without rewriting report plumbing.
