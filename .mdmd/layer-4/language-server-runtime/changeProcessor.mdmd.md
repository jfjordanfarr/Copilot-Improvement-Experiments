# Change Processor

## Metadata
- Layer: 4
- Implementation ID: IMP-103
- Code Path: [`packages/server/src/runtime/changeProcessor.ts`](../../../packages/server/src/runtime/changeProcessor.ts)
- Exports: ChangeProcessorContext, ChangeProcessor, ChangeProcessorOptions, createChangeProcessor

## Purpose
Coordinate debounced change batches, persist graph updates, emit diagnostics, and enqueue LLM ingestion so ripple guarantees remain deterministic.

## Public Symbols

### ChangeProcessorContext
Carries live collaborators (graph store, artifact watcher, runtime settings, acknowledgement service, LLM manager) required to process changes.

### ChangeProcessor
Exposes the runtime contract with `process` and `updateContext`, handling queued change batches and runtime collaborator refreshes.

### ChangeProcessorOptions
Initial wiring of the LSP connection, provider guard, hysteresis controller, initial context, and diagnostic sender used to evaluate ripples.

### createChangeProcessor
Factory that builds a stateful processor, wiring watcher integration, persistence, diagnostics publication, and LLM ingestion bridging.

## Responsibilities
- Normalise and persist code/document changes via the graph store before ripple analysis begins.
- Invoke `ArtifactWatcher.processChanges` to classify events and collect inference outputs.
- Traverse ripple impacts using `RippleAnalyzer`, deduplicating targets and logging per-artifact summaries.
- Publish documentation first, then code diagnostics, applying shared suppression budgets and acknowledgement policies.
- Record affected artifacts for LLM ingestion so downstream providers stay in sync.

## Collaborators
- [`packages/server/src/features/watchers/artifactWatcher.ts`](../../../packages/server/src/features/watchers/artifactWatcher.ts) classifies change events and emits inference hints.
- [`packages/server/src/features/diagnostics/publishDocDiagnostics.ts`](../../../packages/server/src/features/diagnostics/publishDocDiagnostics.ts) and [`publishCodeDiagnostics.ts`](../../../packages/server/src/features/diagnostics/publishCodeDiagnostics.ts) deliver ripple diagnostics to clients.
- [`packages/server/src/runtime/llmIngestion.ts`](../../../packages/server/src/runtime/llmIngestion.ts) queues artifacts for further LLM-backed extraction.
- [`packages/shared/src/db/graphStore.ts`](../../../packages/shared/src/db/graphStore.ts) persists change history and diagnostic records.

## Linked Components
- [COMP-001 – Diagnostics Pipeline](../../layer-3/diagnostics-pipeline.mdmd.md)
- [COMP-003 – Language Server Runtime](../../layer-3/language-server-architecture.mdmd.md)
- [COMP-006 – LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md)

## Evidence
- Integration suites: `tests/integration/us3/markdownLinkDrift.test.ts`, `tests/integration/us3/acknowledgeDiagnostics.test.ts`, and US5 transform pipelines rely on this processor to emit diagnostics and queue ingestion.
- Runtime bootstrap tests in [`packages/server/src/main.ts`](../../../packages/server/src/main.ts) wire the processor during language server startup.

## Operational Notes
- Skips processing when the graph store or watcher are uninitialised, avoiding null dereferences during bootstrap.
- Logs ripple summaries (≤10 targets) plus suppression breakdowns to aid incident debugging.
- TODO: add isolated unit coverage for ripple budgeting/LLM queueing once `ArtifactWatcher` test scaffolding improves.
