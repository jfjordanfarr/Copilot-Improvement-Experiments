# Telemetry Contracts (Layer 4)

## Source Mapping
- Definitions: [`packages/shared/src/contracts/telemetry.ts`](../../../packages/shared/src/contracts/telemetry.ts)
- Consumers: [`packages/server/src/main.ts`](../../../packages/server/src/main.ts), [`packages/extension/src/commands/latencySummary.ts`](../../../packages/extension/src/commands/latencySummary.ts)
- Parent designs: [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md), [Extension Surfaces](../../layer-3/extension-surfaces.mdmd.md)
- Spec references: [T052](../../../specs/001-link-aware-diagnostics/tasks.md#phase-7-polish--crosscutting-concerns)

## Purpose
Provide a shared, type-safe contract that describes latency telemetry requests and responses exchanged between the language server and VS Code extension.

## Behaviour
- Declares `LATENCY_SUMMARY_REQUEST`, the LSP method string used by the extension to request latency metrics.
- Defines `LatencySample` records and the aggregated `LatencySummary` payload returned by the server.
- Captures request options (`LatencySummaryRequest`) that allow clients to request resets or adjust the number of samples included in summaries.
- Wraps the full payload in `LatencySummaryResponse` so the language server can evolve the envelope without breaking consumers.

## Interactions
- [`LatencyTracker`](../../layer-4/server-telemetry/latencyTracker.mdmd.md) populates `LatencySummary` values prior to responding to the LSP request.
- [`Latency Summary Commands`](../../layer-4/extension-commands/latencySummary.mdmd.md) format and display the returned telemetry to users or automated test harnesses.
- Integration suites deserialize summaries directly, letting the test harness assert latency constraints without duplicating DTO shapes.

## Exported Symbols

#### LATENCY_SUMMARY_REQUEST
`LATENCY_SUMMARY_REQUEST` identifies the LSP method that requests diagnostic latency telemetry from the language server.

#### LatencyChangeKind
`LatencyChangeKind` enumerates telemetry buckets (document versus code) so summaries can disaggregate latency by change type.

#### LatencySample
`LatencySample` captures queue, persistence, and publication timestamps plus diagnostic counts for individual changes.

#### LatencySummary
`LatencySummary` aggregates totals, averages, percentiles, per-type rollups, and the latest samples returned to clients.

#### LatencySummaryRequest
`LatencySummaryRequest` lets callers reset counters and tune sample counts for the requested snapshot window.

#### LatencySummaryResponse
`LatencySummaryResponse` wraps the telemetry snapshot payload returned to extension and tooling consumers.

## Evidence
- Server coverage: [`packages/server/src/telemetry/latencyTracker.test.ts`](../../../packages/server/src/telemetry/latencyTracker.test.ts)
- End-to-end assurance: [`tests/integration/perf/diagnosticLatency.test.ts`](../../../tests/integration/perf/diagnosticLatency.test.ts)
