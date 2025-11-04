# Benchmark Fixture Regenerator

## Metadata
- Layer: 4
- Implementation ID: IMP-510
- Code Path: [`scripts/fixture-tools/regenerate-ts-benchmarks.ts`](../../../scripts/fixture-tools/regenerate-ts-benchmarks.ts)
- Exports: runRegenerationCli

## Purpose
Provide a deterministic CLI that regenerates TypeScript benchmark expectations from the compiler oracle, stages review artefacts, and preserves hand-authored override segments.
- Offer an ergonomic developer workflow (`npm run fixtures:regenerate -- --suite ts`) that rebuilds oracle-backed edges without committing changes automatically.
- Persist diff payloads under `AI-Agent-Workspace/tmp/fixture-regeneration/<fixture-id>/` so reviewers can inspect compiler versus manual expectations.
- Respect override manifests so polyglot or hand-crafted edges remain untouched during regeneration cycles.

## Public Symbols

### runRegenerationCli
Entry point invoked by the CLI script. Parses suite selection flags, invokes the TypeScript fixture oracle, merges manual override segments, and writes output bundles containing:
- `oracle.json` – compiler-derived edges sorted and normalised
- `merged.json` – regenerated expectations ready for copy-back when approved
- `diff.md` – human-readable summary describing additions, removals, and override conflicts

## Collaborators
- [`packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts`](../../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts) supplies compiler-derived edges.
- [`tests/integration/benchmarks/fixtures/typescript/`](../../../tests/integration/benchmarks/fixtures/typescript) store curated expectations and override manifests consumed by the CLI.
- [`scripts/fixture-tools/benchmark-manifest.js`](../../../scripts/fixture-tools/benchmark-manifest.js) provides suite metadata (fixture ids, paths, integrity expectations).

## Linked Components
- [COMP-007 Diagnostics Benchmarking](../../layer-3/benchmark-telemetry-pipeline.mdmd.md#comp007-diagnostics-benchmarking)

## Evidence
- Manual smoke run (`npm run fixtures:regenerate -- --suite ts`) verifies `oracle.json`, `merged.json`, and `diff.md` artefacts materialise under `AI-Agent-Workspace/tmp/fixture-regeneration/<fixture-id>/`.
- Benchmark pipeline integration (`npm run test:benchmarks -- --suite ast`) compares oracle output against curated expectations within [`tests/integration/benchmarks/astAccuracy.test.ts`](../../../tests/integration/benchmarks/astAccuracy.test.ts).
- README workflow documents copying `merged.json` into `expected.json` after review to keep fixtures aligned with compiler truth.
