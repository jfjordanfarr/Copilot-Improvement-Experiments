# Fallback Inference (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/inference/fallbackInference.ts`](../../../packages/shared/src/inference/fallbackInference.ts)
- Tests: [`packages/shared/src/inference/fallbackInference.test.ts`](../../../packages/shared/src/inference/fallbackInference.test.ts)
- Workspace providers: [`packages/shared/src/inference/linkInference.ts`](../../../packages/shared/src/inference/linkInference.ts)
- Parent design: [Language Server Architecture](../language-server-runtime/linkInferenceOrchestrator.mdmd.md)

## Exported Symbols

#### ArtifactSeed
`ArtifactSeed` captures the minimal artifact description supplied by watchers ahead of inference.

#### KnowledgeArtifactSummary
`KnowledgeArtifactSummary` summarises persisted artifacts and assists with deduplication during inference.

#### RelationshipHint
`RelationshipHint` encodes manual hints, giving fallback inference authoritative signals when heuristics are ambiguous.

#### LLMRelationshipSuggestion
`LLMRelationshipSuggestion` records model-proposed relationships with confidence and rationale.

#### TraceOrigin
`TraceOrigin` tags inference traces with their provenance (heuristic, hint, or llm).

#### FallbackInferenceResult
`FallbackInferenceResult` aggregates inferred artifacts, relationships, and trace entries produced by the pipeline.

#### inferFallbackGraph
`inferFallbackGraph` executes the fallback pipeline, merging heuristics, hints, and optional LLM suggestions into a deduplicated graph.

## Responsibility
Generate provisional knowledge graph artifacts and links when external feeds are unavailable. Combines lightweight heuristics, optional LLM suggestions, and explicit hints to infer relationships that keep diagnostics functional in the absence of authoritative data.

## Key Concepts
- **ArtifactSeed**: Minimal description of workspace files provided by watchers and providers; may include inline content.
- **Heuristic passes**: Markdown links, wiki links, import statements, and `@link` directives produce candidate relationships.
- **LLM bridge**: Optional `FallbackLLMBridge` augments heuristics with model-driven suggestions when content volume justifies the cost.
- **Inference traces**: Every generated link records origin (heuristic, llm, or hint) plus rationale for debugging and audit.

## Public API
- `inferFallbackGraph(input, options?): Promise<FallbackInferenceResult>`
- Supporting types: `FallbackInferenceInput`, `FallbackInferenceOptions`, `InferenceTraceEntry`, `LLMRelationshipRequest`

## Internal Flow
1. Enrich seeds into normalized artifacts with deterministic IDs, optionally loading content via provided `contentProvider`.
2. Run heuristic passes to detect references within documentation and code, producing candidate matches ranked by context.
3. Invoke the LLM bridge when configured and content length exceeds the threshold, merging higher-confidence suggestions.
4. Apply explicit hints supplied by workspace providers to ensure manual knowledge embeds remain authoritative.
5. Accumulate links in a map keyed by source/target/kind, keeping the highest-confidence version.
6. Return artifacts, deduplicated links, and trace entries for downstream orchestrators to consume.

## Error Handling
- Suppresses content load failures, treating them as missing data rather than aborting inference.
- Ignores self-links and candidates lacking resolvable targets to keep output clean.
- LLM suggestions referencing unknown artifacts are skipped silently to prevent spurious edges.

## Observability Hooks
- Trace entries surface origin, confidence, and rationale—callers can persist or display them for transparency.
- Deterministic IDs (hashes of URIs) help diff successive runs when seeds stay stable.

## Integration Notes
- Used by `LinkInferenceOrchestrator` as the baseline inference layer before merging workspace evidences and knowledge feeds.
- Confidence calibration defaults to 0.7 for heuristics/LLM but clamps to `[0,1]`, enabling later tuning without schema changes.
- Tests cover markdown link discovery, LLM integration, and trace propagation to guard against regression in relationship scoring.
