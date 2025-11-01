# Benchmark Runner CLI (Layer 4)

## Source Mapping
- CLI entry point: [`scripts/run-benchmarks.mjs`](../../../../scripts/run-benchmarks.mjs)
- npm script wrapper: [`package.json`](../../../../package.json) → `"test:benchmarks"`

## Purpose
Provide a single orchestration command for benchmark suites so developers can iterate on AST accuracy and rebuild stability scenarios without invoking the full verification workflow. The runner mirrors integration-test ergonomics while keeping benchmark execution deterministic and self-contained.

## Behaviour
- Cleans and recompiles the integration harness (`tests/integration/dist`) before launching any suites to guarantee fresh artifacts.
- Accepts suite filters via `--ast-only`, `--rebuild-only`, and repeatable `--suite <name>` arguments; defaults to executing all registered suites when no filters are supplied.
- Supports mode overrides through `--mode <value>` or `BENCHMARK_MODE` so callers can target `ast`, `self-similarity`, or `all` without retooling the manifest.
- Lists available suites with `--show-suites`/`--list`, keeping discovery fast for new contributors.
- Invokes Mocha with the TDD interface to honour the `suite()`/`test()` semantics used in `tests/integration/benchmarks/**`.

## Interactions
- Exposed via `npm run test:benchmarks`, which forwards additional flags to `scripts/run-benchmarks.mjs`.
- Consumed by `npm run safe:commit -- --benchmarks` when maintainers need benchmark coverage in the gate (default runs omit benchmarks for speed).
- Produces the same benchmark result JSON consumed by `scripts/reporting/generateTestReport.ts`, enabling subsequent Markdown report generation.

## Evidence
- Local execution (`npm run test:benchmarks -- --ast-only`) passes against the reorganised fixture catalog, demonstrating that suite selection and environment plumbing function as designed.
- Graph coverage audit recognises the CLI via this document, preventing orphaned tooling from bypassing documentation requirements.
