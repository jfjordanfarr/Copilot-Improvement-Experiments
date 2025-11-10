# packages/server/src/telemetry/latencyTracker.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/telemetry/latencyTracker.ts
- Live Doc ID: LD-implementation-packages-server-src-telemetry-latencytracker-ts
- Generated At: 2025-11-09T22:52:11.539Z

## Authored
### Purpose
Measures end-to-end processing time for queued changes, aggregating diagnostics throughput and latency metrics for telemetry endpoints.

### Notes
- Tracks queues per canonical URI, captures persisted timestamps, and finalises samples when diagnostics publish, yielding rolling averages and percentile stats.
- Enforces configurable sample caps and threshold logging, guarding against unbounded memory growth while flagging duplicates or missing completions.
- Produces by-type breakdowns (documents vs code) so operators can spot skewed pipelines and uses `reset` to clear state between reporting intervals.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:11.539Z","inputHash":"773adaeec61292e7"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LatencyTrackerOptions`
- Type: interface
- Source: [source](../../../../../../packages/server/src/telemetry/latencyTracker.ts#L5)

#### `LatencyTracker`
- Type: class
- Source: [source](../../../../../../packages/server/src/telemetry/latencyTracker.ts#L36)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `LatencyChangeKind`, `LatencySample`, `LatencySummary`
- [`uri.normalizeFileUri`](../features/utils/uri.ts.mdmd.md#normalizefileuri)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [latencyTracker.test.ts](./latencyTracker.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
