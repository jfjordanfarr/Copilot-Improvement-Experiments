# Verification Orchestrator Script

## Metadata
- Layer: 4
- Implementation ID: IMP-321
- Code Path: [`scripts/verify.mjs`](../../../scripts/verify.mjs)
- Related Docs: [`benchmark-telemetry-pipeline`](../../layer-3/benchmark-telemetry-pipeline.mdmd.md)

## Purpose
Drive the standard verification gate (`lint`, `unit`, `integration`, optional report generation) while propagating `BENCHMARK_MODE` and report flags across npm subprocesses. Ensures local runs and CI share the same execution contract.

## Public Surface
- Accepts `--mode <value>` to pick fixture subsets via `BENCHMARK_MODE` (defaults to `self-similarity` when unset).
- Supports `--report` / `--no-report` toggles so callers can opt into Markdown report synthesis without editing npm scripts.
- Reads npm config fallbacks (`npm_config_mode`, `npm_config_report`) to stay compatible with `npm run verify -- --mode ast` style invocations.

## Operational Notes
- Windows compatibility: commands spawn through the appropriate shell shim (`npm.cmd`, `npx.cmd`) while keeping environment overrides in place.
- Fail-fast semantics: any non-zero child exit terminates the script with a clear label, preserving the first failing phase in console output.
- Downstream tasks rely on `BENCHMARK_MODE`; avoid mutating the environment between steps unless the new mode should apply across the entire run.
