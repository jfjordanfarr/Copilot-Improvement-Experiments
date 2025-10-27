# ChangeQueue (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/changeEvents/changeQueue.ts`](../../../packages/server/src/features/changeEvents/changeQueue.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)
- Spec references: [FR-012](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T022](../../../specs/001-link-aware-diagnostics/tasks.md)

## Exported Symbols

### `ChangeQueue`
Event-loop friendly queue that debounces file change notifications and delivers batches to downstream processors.

### `QueuedChange`
Shape describing the metadata captured for each pending change (URI, layer, latest content hash, and change provenance).

## Responsibility
Buffers rapid-fire document/code change notifications and flushes them after a debounce window so downstream inference, persistence, and diagnostics execute in predictable batches.

## Behaviour
- Each `enqueue()` upserts the change by URI (latest metadata wins) and (re)schedules a timer based on the configured debounce window.
- When the timer fires, invokes the provided `onFlush` callback with all pending changes and clears the queue.
- `updateDebounceWindow()` adjusts the active window at runtime (e.g., when settings change). If there are pending changes, reschedules the timer with the new value.
- `dispose()` cancels any outstanding timer and drops state—used during server shutdown.

## Implementation Notes
- Uses explicit `scheduleTimeout`/`cancelTimeout` helpers to remain platform-agnostic and simplify testing (can be patched with fake timers).
- Stores only the latest change per URI to avoid redundant inference for the same artifact.
- Debounce window sourced from extension settings (`debounce.ms`), defaulting to 1000 ms for human editing cadence.

## Testing & Usage
- Exercised via unit tests that fake timers to assert batching and debounce updates.
- Integration suites rely on the queue to coalesce rapid saves (see US1/US2 “Rapid edits” scenarios) and confirm diagnostics reflect the final save state.

## Follow-ups
- Consider splitting queues per artifact layer (docs vs code) if future workloads require distinct debounce policies.
- Surface flush metrics to telemetry for tuning default debounce windows.
