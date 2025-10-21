# HysteresisController (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/diagnostics/hysteresisController.ts`](../../../packages/server/src/features/diagnostics/hysteresisController.ts)
- Tests: [`packages/server/src/features/diagnostics/hysteresisController.test.ts`](../../../packages/server/src/features/diagnostics/hysteresisController.test.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)
- Spec references: [FR-011](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T033](../../../specs/001-link-aware-diagnostics/tasks.md)

## Responsibility
Enforces a suppression window that prevents diagnostics from ricocheting between linked artifacts. When module A emits an alert targeting module B, reciprocal alerts back to A are muted until the configured hysteresis window expires or an acknowledgement clears the pair.

## Behaviour
- Stores in-memory `HysteresisRecord` entries keyed by `trigger→target` pairs with emission timestamps.
- `shouldSuppress` prunes expired entries, then checks whether the reverse pairing was recently emitted within the configured window.
- `recordEmission` tracks new alerts, trimming the working set when it exceeds `maxEntries`.
- `acknowledge` clears both directions, enabling acknowledgement flows to re-arm alerts immediately after user review.

## Implementation Notes
- Defaults (`maxEntries=500`, `pruneMultiplier=4`) keep memory usage bounded without aggressive churn; overridable for stress tests.
- Optional `now` factory enables deterministic time travel in tests.
- `prune()` multiplies the hysteresis window to permit drifting timers while still evicting stale pairs.

## Testing
- Dedicated unit suite validates suppression timing, acknowledgement, trimming, and deterministic behaviour via fake clocks.
- Integration suites (US1/US2) assert that reciprocal markdown diagnostics are suppressed until acknowledgements occur.

## Follow-ups
- Persist hysteresis state to disk once acknowledgement UX stores user intent (planned under T042) so restarts do not re-notify old alerts.
- Emit structured logs when suppression fires to aid observability during noisy pipelines.
