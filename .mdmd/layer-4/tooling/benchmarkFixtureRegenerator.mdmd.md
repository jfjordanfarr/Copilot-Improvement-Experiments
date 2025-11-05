# Benchmark Fixture Regenerator

## Metadata
- Layer: 4
- Implementation ID: IMP-510
- Code Path: [`scripts/fixture-tools/regenerate-benchmarks.ts`](../../../scripts/fixture-tools/regenerate-benchmarks.ts)
- Exports: runRegenerationCli

## Purpose
Provide a deterministic CLI that regenerates TypeScript, Python, C, Rust, Java, and Ruby benchmark expectations from language-specific oracles, stages review artefacts, and preserves hand-authored override segments.
- Offer an ergonomic developer workflow (`npm run fixtures:regenerate -- --lang ts|python|c|rust|java|ruby`) that rebuilds oracle-backed edges without committing changes automatically.
- Persist diff payloads under `AI-Agent-Workspace/tmp/fixture-regeneration/<fixture-id>/` so reviewers can inspect compiler versus manual expectations.
- Respect override manifests so polyglot or hand-crafted edges remain untouched during regeneration cycles.

## Public Symbols

### runRegenerationCli
Entry point invoked by the CLI script. Parses suite selection flags, invokes the TypeScript, Python, C, Rust, Java, and Ruby fixture oracles, merges manual override segments, and writes output bundles containing:
- `oracle.json` – compiler-derived edges sorted and normalised
- `merged.json` – regenerated expectations ready for copy-back when approved
- `diff.md` – human-readable summary describing additions, removals, and override conflicts

## Collaborators
- [`packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts`](../../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts) supplies compiler-derived edges for TypeScript fixtures.
- [`packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts`](../../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts) shells out to CPython to enumerate module relationships for Python fixtures.
- [`packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts`](../../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts) scans translation units for includes and call edges in C fixtures.
- [`packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts`](../../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts) interprets module declarations and `use` statements to recover Rust edges.
- [`packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts`](../../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts) analyses import usage to classify Java dependencies.
- [`packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts`](../../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts) resolves `require_relative` references for Ruby fixtures.
- [`tests/integration/benchmarks/fixtures/`](../../../tests/integration/benchmarks/fixtures) stores curated expectations and override manifests consumed by the CLI.
- [`scripts/fixture-tools/benchmark-manifest.ts`](../../../scripts/fixture-tools/benchmark-manifest.ts) provides suite metadata (fixture ids, paths, integrity expectations).

## Linked Components
- [COMP-007 Diagnostics Benchmarking](../../layer-3/benchmark-telemetry-pipeline.mdmd.md#comp007-diagnostics-benchmarking)
- [COMP-013 Polyglot Fixture Oracles](../../layer-3/polyglot-oracles-and-sampling.mdmd.md#comp-013-polyglot-fixture-oracles)

## Evidence
- Manual smoke run (`npm run fixtures:regenerate -- --lang python` or `--lang rust`) verifies `oracle.json`, `merged.json`, and `diff.md` artefacts materialise under `AI-Agent-Workspace/tmp/fixture-regeneration/<fixture-id>/`.
- Benchmark pipeline integration (`npm run test:benchmarks -- --suite ast`) compares oracle output against curated expectations within [`tests/integration/benchmarks/astAccuracy.test.ts`](../../../tests/integration/benchmarks/astAccuracy.test.ts).
- README workflow documents copying `merged.json` into `expected.json` after review to keep fixtures aligned with compiler truth.
