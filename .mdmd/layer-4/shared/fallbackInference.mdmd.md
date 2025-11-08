# Fallback Inference

## Metadata
- Layer: 4
- Implementation ID: IMP-042
- Code Path: [`packages/shared/src/inference/fallbackInference.ts`](../../../packages/shared/src/inference/fallbackInference.ts)
- Exports: ArtifactSeed, RelationshipHint, LLMRelationshipSuggestion, LLMRelationshipRequest, FallbackLLMBridge, FallbackGraphInput, FallbackGraphOptions, InferenceTraceEntry, InferenceTraceOrigin, FallbackInferenceResult, inferFallbackGraph
- Tests: [`packages/shared/src/inference/fallbackInference.test.ts`](../../../packages/shared/src/inference/fallbackInference.test.ts), [`packages/shared/src/inference/fallbackInference.languages.test.ts`](../../../packages/shared/src/inference/fallbackInference.languages.test.ts)
- Collaborator: [`packages/shared/src/inference/linkInference.ts`](../../../packages/shared/src/inference/linkInference.ts)
- Parent design: [Language Server Architecture](../language-server-runtime/linkInferenceOrchestrator.mdmd.md)

## Purpose
Generate provisional knowledge graph artifacts and links when external feeds are unavailable by combining heuristics, hints, and optional LLM suggestions.

## Public Symbols

### ArtifactSeed
Minimal artifact description supplied by watchers ahead of inference (uri, language, optional content).

### RelationshipHint
Explicit signal describing known relationships that should be injected into the fallback graph despite heuristic ambiguity; callers may omit `kind` and let the orchestrator infer it from artifact layers.

### LLMRelationshipSuggestion
Model-proposed relationship payload including confidence, rationale, and supporting evidence metadata.

### FallbackGraphInput
Aggregated seeds, hints, and runtime hooks passed into the fallback pipeline.

### FallbackGraphOptions
Execution toggles controlling LLM invocation thresholds, time providers, and other runtime toggles.

### FallbackLLMBridge
Interface that adapters implement to invoke external LLMs for additional relationship context.

### InferenceTraceEntry
Structured trace describing how a relationship was produced, including origin, confidence, and rationale text.

### InferenceTraceOrigin
Enumerates the provenance (`"heuristic" | "hint" | "llm"`) associated with each inference trace entry.

### LLMRelationshipRequest
Request payload sent to the LLM bridge, containing prompt metadata and candidate seeds.

### FallbackInferenceResult
Aggregated output: deduplicated artifacts, relationships, and trace entries ready for orchestrator consumption.

### inferFallbackGraph
Executes the fallback pipeline, merging heuristics, hints, and optional LLM suggestions into a deduplicated graph result.

## Key Concepts
- **ArtifactSeed**: Minimal description of workspace files provided by watchers and providers; may include inline content.
- **Heuristic passes**: Markdown links, wiki links, import statements, and `@link` directives produce candidate relationships.
- **Polyglot heuristics**: Regression coverage locks in C call detection, Rust module resolution, Java import classification, and Ruby `require_relative` discovery against dedicated language fixtures.
- **Comment-aware import parsing**: Module specifiers detected by the import heuristic are ignored when they originate inside block or line comments (for example, documentation code samples), preventing fixtures like Ky from reporting phantom dependencies.
- **LLM bridge**: Optional `FallbackLLMBridge` augments heuristics with model-driven suggestions when content volume justifies the cost.
- **Inference traces**: Every generated link records origin (heuristic, llm, or hint) plus rationale for debugging and audit.

## Public API
- `inferFallbackGraph(input, options?): Promise<FallbackInferenceResult>`
- Supporting types: `FallbackGraphInput`, `FallbackGraphOptions`, `InferenceTraceEntry`, `InferenceTraceOrigin`, `LLMRelationshipRequest`

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
