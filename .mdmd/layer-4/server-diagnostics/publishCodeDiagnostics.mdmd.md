# publishCodeDiagnostics (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/diagnostics/publishCodeDiagnostics.ts`](../../../packages/server/src/features/diagnostics/publishCodeDiagnostics.ts)
- Tests: implicit via integration suites `tests/integration/us1/codeImpact.test.ts` and `us5/transformRipple.test.ts`
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)
- Spec references: [FR-002](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-006](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T037](../../../specs/001-link-aware-diagnostics/tasks.md)

## Exported Symbols

### `CodeChangeContext`
Aggregated ripple payload representing a single triggering artifact change, including the change event id and inferred ripple impacts destined for dependent code files.

### `PublishCodeDiagnosticsOptions`
Invocation contract supplying the incoming contexts, runtime settings, optional hysteresis controller, acknowledgement service, and the LSP diagnostic sender.

### `PublishCodeDiagnosticsResult`
Summary metrics returned after publication, reporting how many diagnostics emitted versus those suppressed by budgets, hysteresis, acknowledgement, or missing dependents alongside noise-filter totals.

### `publishCodeDiagnostics`
Core workflow that trims ripple impacts, enforces suppression rules, assigns diagnostics to dependent URIs, and ships them to the LSP client while recording acknowledgement metadata.

## Responsibility
Transforms captured ripple impacts from code saves into LSP diagnostics, respecting suppression budgets and hysteresis rules so dependent modules receive actionable alerts without flooding the Problems view.

## Behaviour
- Accepts `CodeChangeContext` entries (artifact metadata, change event id, ripple impacts) produced by the change processor.
- Buckets diagnostics by dependent URI, ensuring each target file receives a single batched `sendDiagnostics` call.
- Applies three suppression layers: noise filter trims low-confidence/deep/duplicate ripple impacts, the `maxDiagnosticsPerBatch` budget enforces per-batch quotas, and hysteresis defers reciprocal alerts still cooling down.
- Emits diagnostics carrying rich metadata (`relationshipKind`, `confidence`, `depth`, `path`, `changeEventId`) consumed by the extension for hover text and quick fixes.

## Implementation Notes
- Message format embeds both human-friendly guidance (e.g. `linked dependency changed`) and machine-friendly data in `diagnostic.data`.
- Utilises `normaliseDisplayPath` for problem messages so Windows paths display cleanly without `file://` schemes.
- Records hysteresis emissions when alerts are sent to prevent immediate bounce-backs from dependent documents.

## Failure & Edge Handling
- If ripple impacts omit URIs, the loop skips them to avoid partial diagnostics.
- Budget exhaustion increments `suppressedByBudget`; noise filter metrics expose why ripple impacts were trimmed so operators can tune presets.
- Pairings without dependents increment `withoutDependents`, signalling upstream gaps (e.g., missing inference edges).

## Testing
- Integration scenarios assert emitted diagnostics contain "linked dependency changed" and propagate through US1/US5 pipelines.
- Unit coverage backlog: add direct tests to validate suppression counters and metadata formatting (tracked under T053 follow-up).

## Follow-ups
- Pipe `summary` metrics into telemetry for dashboarding once the runtime exposes metric sinks.
- Surface suppressed contexts through the acknowledgement service to explain why a dependent didn’t receive an alert.
