# Latency Summary Commands (Layer 4)

## Metadata
- Layer: 4
- Implementation ID: IMP-113
- Code Path: [`packages/extension/src/commands/latencySummary.ts`](../../../packages/extension/src/commands/latencySummary.ts)
- Exports: registerLatencyTelemetryCommands, LATENCY_SUMMARY_COMMAND, GET_LATENCY_SUMMARY_INTERNAL_COMMAND

## Source Breadcrumbs
<!-- mdmd:code packages/extension/src/commands/latencySummary.ts -->
- [`packages/extension/src/commands/latencySummary.ts`](../../../packages/extension/src/commands/latencySummary.ts) registers the user-facing and internal telemetry commands.
- Command contributions: [`packages/extension/package.json`](../../../packages/extension/package.json)
- Telemetry contracts: [`packages/shared/src/contracts/telemetry.ts`](../../../packages/shared/src/contracts/telemetry.ts)
- Parent design: [Extension Surfaces](../../layer-3/extension-surfaces.mdmd.md)
- Spec references: [Tasks T052 & T053](../../../specs/001-link-aware-diagnostics/tasks.md)

## Purpose
Expose latency telemetry gathered by the language server so operators can monitor responsiveness, optionally reset counters, and enable automated suites to assert latency service levels.

## Behaviour
- Registers `LATENCY_SUMMARY_COMMAND`, presenting a quick pick that either displays results or displays and resets counters (command id "linkDiagnostics.showLatencySummary").
- Uses a dedicated output channel to render human-friendly summaries, including totals by change type and the most recent samples.
- Highlights threshold breaches in the toast notification by prefixing the message with a warning glyph when p95 latency exceeds the configured budget.
- Registers `GET_LATENCY_SUMMARY_INTERNAL_COMMAND` to return raw telemetry data for automation or scripted diagnostics (command id "linkDiagnostics.getLatencySummary").
- Respects `suppressOutput` in internal command options to avoid spamming UI surfaces during test runs or telemetry polling.

## Interactions
- Sends `LATENCY_SUMMARY_REQUEST` to the language server, which in turn consumes [`LatencyTracker`](../../layer-4/server-telemetry/latencyTracker.mdmd.md) snapshots.
- Integration tests invoke the internal `getLatencySummary` command to assert latency thresholds without needing UI automation.
- Output channel provides persistent history for developers investigating perf regressions alongside other diagnostics commands defined in the extension surface.

## Evidence
- Integration coverage: [`tests/integration/perf/diagnosticLatency.test.ts`](../../../tests/integration/perf/diagnosticLatency.test.ts)

## Exported Symbols

#### registerLatencyTelemetryCommands
`registerLatencyTelemetryCommands` wires the telemetry output channel and command registrations into the extension activation lifecycle.

#### LATENCY_SUMMARY_COMMAND
`LATENCY_SUMMARY_COMMAND` exposes the user-facing palette command id "linkDiagnostics.showLatencySummary".

#### GET_LATENCY_SUMMARY_INTERNAL_COMMAND
`GET_LATENCY_SUMMARY_INTERNAL_COMMAND` surfaces the internal "linkDiagnostics.getLatencySummary" command consumed by telemetry automation suites.
