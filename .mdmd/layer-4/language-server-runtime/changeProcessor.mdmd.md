# Change Processor (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/runtime/changeProcessor.ts`](../../../packages/server/src/runtime/changeProcessor.ts)
- Collaborators: [`artifactWatcher.ts`](../../../packages/server/src/features/watchers/artifactWatcher.ts), [`publishDocDiagnostics.ts`](../../../packages/server/src/features/diagnostics/publishDocDiagnostics.ts), [`publishCodeDiagnostics.ts`](../../../packages/server/src/features/diagnostics/publishCodeDiagnostics.ts), [`llmIngestion.ts`](../../../packages/server/src/runtime/llmIngestion.ts)
- Parent design: [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md), [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md)
- Spec references: [FR-002](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-003](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-015](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements)

## Exported Symbols

#### ChangeProcessorContext
`ChangeProcessorContext` carries the live collaborators (graph store, artifact watcher, runtime settings, acknowledgements, LLM manager) that the processor needs to persist changes, compute ripples, and publish diagnostics.

#### ChangeProcessor
`ChangeProcessor` exposes the runtime contract: the process method handles batches flushed from the change queue and updateContext refreshes collaborators when the language server bootstraps or settings change.

#### ChangeProcessorOptions
`ChangeProcessorOptions` wires in the LSP connection, provider guard, hysteresis controller, initial context, and diagnostic sender used to evaluate ripples and throttle diagnostic noise.

#### createChangeProcessor
`createChangeProcessor` builds a stateful processor that runs the artifact watcher, persists document/code deltas, computes ripple impacts, publishes diagnostics, and enqueues LLM ingestion requests.

## Responsibility
Coordinate workspace change handling once the debounce queue flushes:
- Normalise and persist code/document changes via the graph store.
- Generate ripple impacts through `RippleAnalyzer` respecting runtime depth/limit settings.
- Publish documentation and code diagnostics with shared noise suppression and hysteresis controls.
- Bridge successful artifacts into the LLM ingestion manager so downstream knowledge providers stay fresh.

## Key Behaviour
- **Watcher integration** – Invokes `ArtifactWatcher.processChanges` to classify change events, capture skipped items, and collect inference results for persistence.
- **Ripple analysis** – Uses `RippleAnalyzer` to traverse allowed relationship kinds, deduplicating targets and logging per-artifact impact summaries for debugging.
- **Diagnostic budgeting** – Applies documentation diagnostics first, then reuses the remaining noise-suppression budget when publishing code diagnostics.
- **LLM queueing** – Records artifact identifiers touched by the batch and, when ingestion is available, enqueues them with reason tags (`document-change`, `code-change`).
- **Acknowledgement + hysteresis** – Routes diagnostic contexts through acknowledgement and hysteresis controllers so acknowledged items or ping-pong ripples stay muted across batches.

## Inputs
- Batches of `QueuedChange` events emitted by the debounced change queue.
- Runtime settings derived from provider guard (noise suppression, ripple depth, diagnostic budgets).
- Optional inference output from `ArtifactWatcher` (links + orchestrator errors) and acknowledgement history.

## Outputs
- Persisted document and code change records stored in the graph (via `saveDocumentChange` / `saveCodeChange`).
- Published diagnostics grouped by document/code categories, with noise filter and suppression telemetry reported to the LSP console.
- Optional LLM ingestion jobs enqueued per affected artifact id.

## Edge Handling
- Skips processing entirely when the graph store or artifact watcher are not yet initialised, preventing null dereferences during bootstrap.
- Logs and exits early if the watcher throws or returns no processed changes, while still reporting skipped counts.
- Catches persistence failures per change to keep the remaining batch flowing.
- Guards diagnostics behind `providerGuard.areDiagnosticsEnabled()` so workspace policies can disable emission at runtime.
- Normalises URIs before ripple lookup to avoid duplicate artifacts stemming from different path casings.

## Observability
- Emits structured console messages for inference failures, ripple counts, diagnostic suppression breakdowns, and LLM queueing activity.
- Surfaces ripple debug summaries (up to 10 targets) to help track multi-hop dependencies during incident debugging.
- Logs skipped artifacts and remaining diagnostic budget to support tuning noise suppression thresholds.

## Testing
- Exercised indirectly by integration scenarios such as [`tests/integration/us3/markdownLinkDrift.test.ts`](../../../tests/integration/us3/markdownLinkDrift.test.ts), which rely on persisted document changes and ripple diagnostics.
- Acknowledgement flow verified through [`tests/integration/us3/acknowledgeDiagnostics.test.ts`](../../../tests/integration/us3/acknowledgeDiagnostics.test.ts), ensuring the processor respects acknowledgement suppression when publishing diagnostics.
- Runtime bootstrap suites (see [`packages/server/src/main.ts`](../../../packages/server/src/main.ts)) cover context updates by wiring the processor into the language server lifecycle.

## Follow-ups
- Add focused unit coverage for ripple budgeting and LLM queueing paths once test scaffolding for `ArtifactWatcher` can be reused in isolation.
- Expand observability to emit structured telemetry events (beyond console logs) feeding future dashboards.
- Investigate batching strategies for LLM ingestion to avoid redundant enqueue operations when large batches touch the same artifact repeatedly.
