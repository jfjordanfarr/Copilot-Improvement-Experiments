# Fallback Inference Recorder

## Metadata
- Layer: 4
- Implementation ID: IMP-716
- Code Path: [`scripts/fixture-tools/record-fallback-inference.ts`](../../../scripts/fixture-tools/record-fallback-inference.ts)
- Exports: runCli

## Purpose
Capture the current fallback inference graph for any benchmark fixture so accuracy regressions surface alongside oracle truth. The CLI walks manifest definitions, materialises repositories, filters inferred edges to oracle-supported relations, and writes review artefacts either in-place or under `AI-Agent-Workspace/tmp/fallback-inference/<fixture-id>/`. This supports COMP-007 by keeping benchmark precision/recall reproducible and drives COMP-013 by comparing heuristics against oracle baselines without manual JSON edits.

## Public Symbols

### runCli
Parses fixture and language filters, resolves manifest entries, and orchestrates capture runs. Handles `--write` for direct `inferred.json` updates, or emits review bundles under the workspace scratch area. Errors are contextualised per fixture so safe-to-commit and benchmark automation can pinpoint failing scenarios quickly.

## Collaborators
- [`scripts/fixture-tools/benchmark-manifest.ts`](../../../scripts/fixture-tools/benchmark-manifest.ts) supplies fixture metadata, language tags, and file integrity globs.
- [`scripts/fixture-tools/fixtureMaterializer.ts`](../../../scripts/fixture-tools/fixtureMaterializer.ts) clones or expands fixture repositories into ephemeral workspaces for inference runs.
- [`packages/shared/src/inference/fallbackInference.ts`](../../../packages/shared/src/inference/fallbackInference.ts) generates artifacts, traces, and inferred links consumed by the recorder.
- [`tests/integration/benchmarks/fixtures`](../../../tests/integration/benchmarks/fixtures) stores the `inferred.json` targets updated via `--write` mode.

## Linked Components
- [COMP-007 Diagnostics Benchmarking](../../layer-3/benchmark-telemetry-pipeline.mdmd.md#comp007-diagnostics-benchmarking)
- [COMP-013 Polyglot Fixture Oracles](../../layer-3/polyglot-oracles-and-sampling.mdmd.md#comp-013-polyglot-fixture-oracles)

## Evidence
- `npm run fixtures:record-fallback -- --fixture java-service --write` overwrites `tests/integration/benchmarks/fixtures/java/service/inferred.json` with freshly inferred edges filtered to oracle relation sets.
- `npm run fixtures:record-fallback -- --lang rust` emits fallbacks for every Rust fixture under `AI-Agent-Workspace/tmp/fallback-inference/` when auditing heuristic drift without touching committed baselines.
- `node scripts/run-benchmarks.mjs --suite ast` consumes recorder output to assert per-fixture precision/recall, failing when fallback edges diverge from oracle truth.
