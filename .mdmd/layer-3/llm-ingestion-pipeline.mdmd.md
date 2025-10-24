# LLM Ingestion Pipeline (Layer 3)

## Purpose & Scope

Describe the next iteration of our ingestion architecture where large language models convert arbitrary workspace text into graph edges that enrich ripple diagnostics. The pipeline must operate when native language servers or external knowledge feeds are absent, emit reproducible outputs, and record confidence grades so downstream consumers can decide how aggressively to trust LLM-sourced relationships.

## Goals

- Enable format-agnostic artifact parsing (code, markdown, config, prose) via a staged, reproducible GraphRAG-style flow.
- Produce relationship candidates annotated with `High`, `Medium`, or `Low` confidence categories plus supporting rationales.
- Preserve provenance (prompt, model id, chunk references) for each inferred edge and allow auditors to rerun the extraction.
- Plug into existing `KnowledgeGraphBridge` persistence without bypassing schema validation or manual overrides.
- Run locally against `vscode.lm` providers and respect Responsible Intelligence consent gates before sending any content to cloud services.

## Pipeline Overview

1. **Artifact Discovery**
   - Extend the watcher to enqueue artifacts that lack high-confidence relationships or have stale embeddings.
   - Reuse existing throttling/debounce settings so LLM jobs do not starve diagnostics.
2. **Chunk & Context Build**
   - Use deterministic chunkers (`packages/shared/src/inference/chunking/*`) to create overlapping windows tagged with artifact metadata (layer, language hints, last change hash).
   - Capture adjacent artifact summaries (e.g., requirements referenced in the same folder) to feed prompt grounding.
3. **Entity & Relationship Extraction**
   - Issue a single `vscode.lm.complete` call with a structured prompt template that enumerates:
     - Known artifact identifiers (from `GraphStore`) to bias selection.
     - Allowed relationship kinds grouped by target layer.
     - Rules for emitting JSON records with `sourceId`, `targetId`, `relationship`, `confidence`, and `rationale` fields.
   - Models must respond with deterministic JSON (enforced through `json` response format or schema-constrained decoding when available).
4. **Confidence Normalisation**
   - Map raw model scores/string labels to repository-wide enums:
     - `High`: explicit references or repeated evidence across chunks.
     - `Medium`: implied relationships with partial evidence or single mention.
     - `Low`: speculative links flagged for human review; these are stored but not used for diagnostics until corroborated.
   - Store derivation metadata (e.g., `supportingChunkIds`) for re-validation runs.
5. **Persistence & Conflict Resolution**
   - Validate emitted JSON with the existing schema validator and persist via `KnowledgeGraphBridge.upsertInferredEdge`.
   - If a manual override contradicts an LLM edge, downgrade the LLM edge to `shadowed` status and record that the override took precedence.
   - Emit telemetry events (`llmIngestion.edgeCreated`, `llmIngestion.edgeShadowed`) for later analytics.

## Component Responsibilities

| Component | Location (planned) | Responsibility |
|-----------|-------------------|----------------|
| `LLMIngestionOrchestrator` | `packages/server/src/features/knowledge/llmIngestionOrchestrator.ts` | Coordinates batching, prompt assembly, and persistence hand-off. |
| `ChunkSummariser` | `packages/shared/src/inference/llm/llmChunker.ts` | Deterministically splits artifacts and tags chunks with metadata for prompts. |
| `RelationshipExtractor` | `packages/shared/src/inference/llm/relationshipExtractor.ts` | Wraps `vscode.lm` calls, enforces schema-constrained decoding, and translates raw outputs into internal DTOs. |
| `ConfidenceCalibrator` | `packages/shared/src/inference/llm/confidenceCalibrator.ts` | Maps model-supplied scores to `High/Medium/Low` and applies decay heuristics when evidence is thin. |
| `LLMIngestionDiagnostics` | `packages/server/src/features/knowledge/llmIngestionDiagnostics.ts` | Surfaces warnings when prompts fail, quotas are exhausted, or outputs violate schema. |

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

- Prompt templates live in `packages/server/src/prompts/llm-ingestion/` and include version hashes so we can replay historical prompts during audits.
- All requests funnel through `ProviderGuard` to enforce consent, offline mode, and cost ceilings.
- The orchestrator honours workspace `maxTokensPerMinute` limits and queues work when models throttle.
- A dry-run mode writes outputs to `AI-Agent-Workspace/llm-ingestion-snapshots/` for regression tests without mutating the graph.

## Open Questions

- How aggressively should we cache chunk embeddings to avoid re-sending unchanged text?
- Should manual reviewers promote `Low` edges to higher confidence via a quick action in diagnostics tooling?
- What heuristics decide when enough corroboration exists to promote `Medium` edges into diagnostic scope automatically?

## Related Spec Touchpoints

- Introduces new functional requirement `FR-019` (see `spec.md`).
- Informs upcoming plan tasks `T068–T072` for implementation and validation sequencing.
- Extends research threads under “LLM Augmentation” with concrete pipeline steps.
