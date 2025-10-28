# LatencyTracker (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/telemetry/latencyTracker.ts`](../../../packages/server/src/telemetry/latencyTracker.ts)
- Runtime integration: [`packages/server/src/main.ts`](../../../packages/server/src/main.ts)
- Change pipeline: [`packages/server/src/runtime/changeProcessor.ts`](../../../packages/server/src/runtime/changeProcessor.ts)
- Telemetry contracts: [`packages/shared/src/contracts/telemetry.ts`](../../../packages/shared/src/contracts/telemetry.ts)
- Parent design: [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)
- Spec references: [T052](../../../specs/001-link-aware-diagnostics/tasks.md#phase-7-polish--crosscutting-concerns) • [FR-009](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements)

## Purpose
Track end-to-end latency for code and document changes processed by the language server so that downstream surfaces (extension commands, dashboards, alerts) can report on diagnostic responsiveness and regression risk.

## Behaviour
- `recordEnqueue(uri)` captures when a file change enters the queue, preserving FIFO order per canonicalised URI.
- `registerPersisted` pairs a queued start with the associated change event once persistence finishes, increasing type-level totals for later rollups.
- `complete` finalises a change when diagnostics publish, producing a `LatencySample` that records queued/persisted/published timestamps plus emitted diagnostic count.
- `discardQueuedChange` removes abandoned queue entries (e.g. change superseded before persistence) to avoid inflating wait metrics.
- `snapshot({ reset?, maxSamples? })` summarises totals, averages, p95, and recent samples; optionally resets all counters so callers can measure discrete windows.
- Defensive logging warns when completion events arrive out of order or without prior registration, protecting against partially wired integrations.

## Interactions
- `main.ts` instantiates the tracker during language server bootstrap and exposes snapshot results over the LSP `latencySummary` request.
- `changeProcessor` hooks call `recordEnqueue`, `registerPersisted`, `discardQueuedChange`, and `complete` as changes flow through queueing, persistence, and diagnostic publication cycles.
- VS Code commands consume snapshots via [`latencySummary.ts`](../../layer-4/extension-commands/latencySummary.mdmd.md) to present telemetry to users or automated tests.

## Evidence
- Unit coverage: [`packages/server/src/telemetry/latencyTracker.test.ts`](../../../packages/server/src/telemetry/latencyTracker.test.ts)
- Integration assurance: [`tests/integration/perf/diagnosticLatency.test.ts`](../../../tests/integration/perf/diagnosticLatency.test.ts)

## Exported Symbols

#### LatencyTracker
`LatencyTracker` records queue, persistence, and publication timestamps so telemetry summaries include averages, percentiles, and sample histories.

#### LatencyTrackerOptions
`LatencyTrackerOptions` configures clocks, thresholds, sample retention, and logger injection when instantiating the tracker.
