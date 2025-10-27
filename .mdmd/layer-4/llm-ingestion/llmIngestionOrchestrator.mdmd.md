# LLMIngestionOrchestrator (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/knowledge/llmIngestionOrchestrator.ts`](../../../packages/server/src/features/knowledge/llmIngestionOrchestrator.ts)
- Collaborators:
	- [`GraphStore`](../../../packages/shared/src/db/graphStore.ts)
	- [`ProviderGuard`](../../../packages/server/src/features/settings/providerGuard.ts)
	- [`RelationshipExtractor`](../../../packages/shared/src/inference/llm/relationshipExtractor.ts)
	- [`calibrateConfidence`](../../../packages/shared/src/inference/llm/confidenceCalibrator.ts)
	- [`LlmIngestionManager`](../../../packages/server/src/runtime/llmIngestion.ts)
- Parent design: [LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md)
- Spec references: [FR-019](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T070](../../../specs/001-link-aware-diagnostics/tasks.md)

## Exported Symbols

#### LlmIngestionLogger
`LlmIngestionLogger` defines the info, warn, and error hooks the orchestrator uses so callers can route ingestion telemetry to custom sinks.

#### EnqueueOptions
`EnqueueOptions` lets the runtime provide artifact identifiers and the enqueue reason, giving operators traceability for why work entered the queue.

#### LlmIngestionResult
`LlmIngestionResult` captures per-artifact outcomes (stored, skipped, error, dry-run payload), enabling managers to roll up ingestion health.

#### LlmIngestionOrchestratorOptions
`LlmIngestionOrchestratorOptions` wires together the `GraphStore`, prompt renderer, calibrator, file reader, and configuration knobs used to run ingestion loops.

#### LlmIngestionOrchestrator
`LlmIngestionOrchestrator` drains queued artifact ids, renders prompts, invokes the relationship extractor, calibrates responses, and persists eligible relationships (or writes dry-run snapshots).

## Responsibility
Drain queued artifact ids, build prompts, invoke the configured `RelationshipExtractor`, and persist calibrated relationships with provenance. The orchestrator owns chunk creation, dry-run snapshot generation, and logging warnings when ingestion is skipped or fails.

## Entry Points
- `enqueueArtifacts(artifactIds, reason)` deduplicates requested artifacts in the in-memory queue.
- `runOnce()` processes a bounded batch (default size `1`) and returns per-artifact ingestion results.
- `runDryRun(snapshotDirectory)` mirrors `runOnce()` but writes JSON snapshots instead of updating the graph.

## Workflow
1. Pop up to `maxConcurrentJobs` items from the queue.
2. Consult [`ProviderGuard`](../../../packages/server/src/features/settings/providerGuard.ts) settings; skip work when `llmProviderMode === "disabled"`.
3. Resolve the artifact via [`GraphStore`](../../../packages/shared/src/db/graphStore.ts), read file content, and build deterministic chunks (SHA-1 hashed, line scoped).
4. Gather neighbouring artifacts for grounding and render the relationship prompt using the versioned template under [`prompts/llm-ingestion/relationshipTemplate.ts`](../../../packages/server/src/prompts/llm-ingestion/relationshipTemplate.ts).
5. Call [`RelationshipExtractor.extractRelationships`](../../../packages/shared/src/inference/llm/relationshipExtractor.ts), attaching template + artifact tags for provenance.
6. Pass responses through [`calibrateConfidence`](../../../packages/shared/src/inference/llm/confidenceCalibrator.ts), marking diagnostics eligibility and promotion metadata.
7. Persist eligible links through [`GraphStore.upsertLink`](../../../packages/shared/src/db/graphStore.ts) and `storeLlmEdgeProvenance`, or emit dry-run snapshots when requested.
8. Return stored/skipped counts and surface warnings for missing artifacts, unreadable files, or failed requests.

## Configuration
- `maxConcurrentJobs` (defaults to `1`) keeps the loop single-threaded until rate-limiting heuristics are introduced.
- `maxChunkCharacters` (defaults to `1600`) defines the chunk window used when slicing file content.
- `storageDirectory` hosts dry-run snapshot output under `llm-ingestion-snapshots/`.
- Injected dependencies (`fileReader`, `now`, `calibrate`) make unit tests deterministic.

## Failure Handling
- Missing artifacts, unreadable files, or unsupported URIs emit warnings and count as skipped work.
- Exceptions from the extractor bubble up as `LlmIngestionResult.error` entries; the manager logs these without halting future runs.
- Non-diagnostics relationships are skipped with info-level logging so operators can audit confidence gating decisions.

## Testing
- Unit coverage should mock `GraphStore`, `RelationshipExtractor`, and `ProviderGuard` to assert queue draining, chunk boundaries, and provenance writes (see [`llmIngestionOrchestrator.test.ts`](../../../packages/server/src/features/knowledge/llmIngestionOrchestrator.test.ts)).
- Integration coverage should exercise dry-run output to verify snapshot shape while the default extractor is stubbed.

## Follow-ups
- Wire provider consent and rate-limit enforcement once real model calls replace the stubbed invoker.
- Surface queue depth and last-run metadata through telemetry or a dedicated extension view.
- Extend chunk metadata with language + symbol hints before enabling high-confidence persistence by default.
