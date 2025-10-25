# LlmIngestionManager (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/runtime/llmIngestion.ts`](../../../packages/server/src/runtime/llmIngestion.ts)
- Collaborators:
	- [`LlmIngestionOrchestrator`](../../../packages/server/src/features/knowledge/llmIngestionOrchestrator.ts)
	- `Connection` (from `vscode-languageserver`)
	- [`ProviderGuard`](../../../packages/server/src/features/settings/providerGuard.ts)
	- [`RelationshipExtractor`](../../../packages/shared/src/inference/llm/relationshipExtractor.ts)
- Parent design: [LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md)
- Spec references: [FR-019](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T068](../../../specs/001-link-aware-diagnostics/tasks.md)

## Responsibility
Queue artifact ids for ingestion, trigger the orchestrator run loop, and surface ingestion outcomes to the language server console. Also exposes a default `RelationshipExtractor` factory that operates deterministically when no provider is configured.

## Entry Points
- `enqueue(artifactIds, reason?)` deduplicates artifact ids, pushes them into the orchestrator queue, and schedules an asynchronous run.
- `createDefaultRelationshipExtractor({ connection, providerGuard })` returns a `RelationshipExtractor` backed by a stub `ModelInvoker` that logs once and yields no relationships.

## Workflow
1. Accept artifact ids from change processors or other runtime callers (notably [`changeProcessor.ts`](../../../packages/server/src/runtime/changeProcessor.ts)); ignore empty batches to avoid needless runs.
2. Forward ids to [`LlmIngestionOrchestrator.enqueueArtifacts`](../../../packages/server/src/features/knowledge/llmIngestionOrchestrator.ts) and fire `triggerRun()` unless a run is already in progress.
3. Drain the orchestrator’s results via `runOnce()`, logging stored/skipped/error counts and warning for per-artifact failures.
4. Surface errors from the orchestrator to the LSP console so operators know when ingestion silently fails.
5. When using the default extractor, guard against provider consent: log the active `llmProviderMode` and return empty relationships until a real provider is wired.

## Logging & Telemetry
- Aggregated run summaries are logged at `info` level (`processed`, `stored`, `skipped`, `errors`) via [`logResults`](../../../packages/server/src/runtime/llmIngestion.ts).
- Individual failures log at `warn` level with the artifact id and error string; this mirrors what future diagnostics surfacing will show.
- The stub model invoker logs once per session so teams know the pipeline is intentionally inert in local-only mode (see [`createDefaultRelationshipExtractor`](../../../packages/server/src/runtime/llmIngestion.ts)).

## Integration Points
- Instantiated during server bootstrap ([`packages/server/src/main.ts`](../../../packages/server/src/main.ts)) and disposed alongside the language server connection.
- [`changeProcessor.ts`](../../../packages/server/src/runtime/changeProcessor.ts) calls `enqueue` after graph mutations so ingestion stays reactive to edits.
- The orchestrator dependency remains injectable; tests can substitute fakes to assert queuing behaviour without touching disk or SQLite.

## Follow-ups
- Replace the stub model invoker with provider-specific implementations (local `vscode.lm`, remote API) while reusing the logging hooks.
- Add rate-limit awareness so multiple rapid enqueue calls coalesce into bounded orchestrator runs.
- Emit structured telemetry once the extension pipeline starts reporting ingestion health metrics.
