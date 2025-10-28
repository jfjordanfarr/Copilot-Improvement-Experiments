# Diagnostic Latency Suite (Layer 4)

## Source Mapping
- Test implementation: [`tests/integration/perf/diagnosticLatency.test.ts`](../../../../tests/integration/perf/diagnosticLatency.test.ts)
- Extension command under test: [`packages/extension/src/commands/latencySummary.ts`](../../../../packages/extension/src/commands/latencySummary.ts)
- Telemetry tracker: [`packages/server/src/telemetry/latencyTracker.ts`](../../../../packages/server/src/telemetry/latencyTracker.ts)
- Parent design: [Integration Testing Architecture](../../../layer-3/testing-integration-architecture.mdmd.md)
- Spec references: [T053](../../../../specs/001-link-aware-diagnostics/tasks.md#phase-7-polish--crosscutting-concerns)

## Purpose
Exercise the end-to-end latency telemetry pipeline in a realistic workspace so regressions in diagnostic turnaround time are caught before release.

## Behaviour
- Activates the extension in a fixture workspace and forces diagnostics to enable in `local-only` mode to avoid external dependencies.
- Applies a content edit to `feature.ts`, waits for diagnostics on `core.ts`, and polls the internal telemetry command until a completed change sample appears.
- Validates that p95, max, and most recent sample latencies remain within 10% of the configured telemetry threshold, failing the suite if any metric breaches the budget.
- Resets telemetry counters before each run to keep assertions deterministic across repeated invocations.

## Interactions
- Uses the internal `linkDiagnostics.getLatencySummary` command so the suite can read raw telemetry without scraping UI output.
- Relies on [`LatencyTracker`](../../../layer-4/server-telemetry/latencyTracker.mdmd.md) snapshots to accumulate queue→publish timings and expose them through the LSP surface.
- Builds on the shared VS Code harness documented in [`vscodeIntegrationHarness`](../integration/vscodeIntegrationHarness.mdmd.md) for activation, readiness polling, and diagnostic helpers.

## Evidence
- The suite is invoked by `npm run test:integration` and `npm run safe:commit`, providing continuous verification of telemetry SLAs.
