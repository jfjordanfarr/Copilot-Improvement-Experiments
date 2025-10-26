# LLM Ingestion Pipeline (Layer 3)

## Purpose & Scope

Describe the ingestion architecture that turns workspace artifacts into graph edges through the LLM-backed orchestrator. The current milestone focuses on queueing artifacts, invoking the orchestration loop, and persisting calibrated relationships while a stubbed extractor keeps behaviour deterministic until live providers are enabled.

## Goals

- Keep ingestion opt-in friendly: honour workspace consent settings and fall back to a no-op extractor when external providers are unavailable.
- Ensure every artifact passes through a deterministic chunking + calibration flow before results can influence diagnostics.
- Persist LLM-sourced edges through `GraphStore` while attaching provenance data (template id, prompt hash, rationale) for audits.
- Record orchestration outcomes so operators can trace stored, skipped, and failed artifacts.
- Preserve upgrade paths for richer prompt grounding and cloud providers without breaking the local-only flow.

## Pipeline Overview

1. **Artifact Discovery**
   - [`ArtifactWatcher`](../../packages/server/src/features/watchers/artifactWatcher.ts) and [`ChangeProcessor`](../../packages/server/src/runtime/changeProcessor.ts) enqueue impacted artifact ids via [`LlmIngestionManager.enqueue`](../../packages/server/src/runtime/llmIngestion.ts).
   - The manager collapses duplicate requests and schedules the orchestrator run loop on demand.
2. **Chunk & Context Build**
   - The orchestrator loads artifact content from disk, builds deterministic chunks in-process, and gathers neighbouring graph entries for grounding.
   - Allowed relationship kinds remain scoped (`depends_on`, `implements`, `documents`, `references`) to avoid runaway outputs.
3. **Relationship Extraction**
   - The orchestrator uses [`RelationshipExtractor`](../../packages/shared/src/inference/llm/relationshipExtractor.ts) with a runtime-supplied `ModelInvoker`; the default invoker lives in [`llmIngestion.ts`](../../packages/server/src/runtime/llmIngestion.ts), logs once, and returns an empty batch.
   - Prompt metadata tags every request with template and artifact identifiers for downstream auditing.
4. **Confidence Calibration**
   - Raw model confidences feed [`calibrateConfidence`](../../packages/shared/src/inference/llm/confidenceCalibrator.ts), producing diagnostics-eligible flags and promotion metadata.
   - Calibration currently treats existing edges as corroboration, ensuring new edges start conservative.
5. **Persistence & Reporting**
   - Graph updates flow through [`GraphStore.upsertLink`](../../packages/shared/src/db/graphStore.ts) and `storeLlmEdgeProvenance` inside the orchestrator, preserving prompt hashes and rationales.
   - The manager summarises stored, skipped, and failed artifacts to the LSP connection console for operator visibility (see [`logResults`](../../packages/server/src/runtime/llmIngestion.ts)).

## Component Responsibilities

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `LlmIngestionManager` | [`packages/server/src/runtime/llmIngestion.ts`](../../packages/server/src/runtime/llmIngestion.ts) | Queues artifacts, triggers orchestrator runs, and logs aggregated ingestion outcomes. |
| `LlmIngestionOrchestrator` | [`packages/server/src/features/knowledge/llmIngestionOrchestrator.ts`](../../packages/server/src/features/knowledge/llmIngestionOrchestrator.ts) | Builds prompts, invokes the extractor, calibrates relationships, and persists results (or snapshots during dry runs). |
| `RelationshipExtractor` | [`packages/shared/src/inference/llm/relationshipExtractor.ts`](../../packages/shared/src/inference/llm/relationshipExtractor.ts) | Calls the supplied `ModelInvoker`, validates JSON payloads, and returns relationship batches with provenance. |
| `GraphStore` | [`packages/shared/src/db/graphStore.ts`](../../packages/shared/src/db/graphStore.ts) | Supplies artifacts, neighbours, and writes inferred links plus provenance records. |
| `ProviderGuard` | [`packages/server/src/features/settings/providerGuard.ts`](../../packages/server/src/features/settings/providerGuard.ts) | Exposes consent settings and determines whether ingestion is permitted (`disabled`, `local-only`, `prompt`). |
| `calibrateConfidence` | [`packages/shared/src/inference/llm/confidenceCalibrator.ts`](../../packages/shared/src/inference/llm/confidenceCalibrator.ts) | Normalises raw confidences and marks diagnostics eligibility. |

## Interaction Diagram

```
ArtifactWatcher ──► LLMIngestionOrchestrator ──► ChunkSummariser
                                         │             │
                                         │             ├─► RelationshipExtractor ──► ConfidenceCalibrator
                                         │                                        ▼
                                         │                               KnowledgeGraphBridge
                                         ▼
                               LLMIngestionDiagnostics
```

## Confidence Taxonomy

- `High`: Model cites direct code symbols, explicit import paths, or cross-references that match canonical identifiers. These edges become eligible for diagnostics immediately.
- `Medium`: Model infers relationships from implied language (e.g., “updates the controller endpoint”) with partial identifier matches; diagnostics consume them only when corroborated by a second signal (manual override, existing edge, or code change).
- `Low`: Model speculates with weak evidence; edges remain in the graph but are excluded from diagnostics and surfaced in audit tooling for human triage.

## Safeguards

- Prompt templates live in [`packages/server/src/prompts/llm-ingestion/relationshipTemplate.ts`](../../packages/server/src/prompts/llm-ingestion/relationshipTemplate.ts) and versioned hashes are stored with every provenance record.
- [`ProviderGuard`](../../packages/server/src/features/settings/providerGuard.ts) settings gate execution; when `llmProviderMode` is `disabled` the orchestrator skips work without mutating state.
- Dry-run snapshots write JSON fixtures under `llm-ingestion-snapshots/`, preserving prompt + calibration metadata for reproducibility (see [`writeDryRunSnapshot`](../../packages/server/src/features/knowledge/llmIngestionOrchestrator.ts)).
- The default `ModelInvoker` returns empty relationships, ensuring local-only environments stay deterministic until a provider is wired (see [`createDefaultRelationshipExtractor`](../../packages/server/src/runtime/llmIngestion.ts)).

## Open Questions

- Which provider will replace the stubbed `ModelInvoker`, and what authentication flow keeps the manager stateless?
- Do we need richer chunk metadata (language, symbols) before enabling relationship creation in diagnostics by default?
- How should we surface ingestion health to users beyond connection console logs (e.g., tree item, notification, telemetry)?

## Related Spec Touchpoints

- Introduces new functional requirement `FR-019` (see [`spec.md`](../../specs/001-link-aware-diagnostics/spec.md#functional-requirements)).
- Informs upcoming plan tasks `T068–T072` for implementation and validation sequencing (see [`tasks.md`](../../specs/001-link-aware-diagnostics/tasks.md)).
- Extends research threads under “LLM Augmentation” with concrete pipeline steps (see [`research.md`](../../specs/001-link-aware-diagnostics/research.md#llm-augmentation--ingestion)).
