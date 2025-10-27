# RelationshipExtractor (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/inference/llm/relationshipExtractor.ts`](../../../packages/shared/src/inference/llm/relationshipExtractor.ts)
- Collaborators: runtime-supplied `ModelInvoker`, [`calibrateConfidence`](../../../packages/shared/src/inference/llm/confidenceCalibrator.ts) (downstream), [`LlmIngestionOrchestrator`](../../../packages/server/src/features/knowledge/llmIngestionOrchestrator.ts)
- Parent design: [LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md)
- Spec references: [FR-019](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T071](../../../specs/001-link-aware-diagnostics/tasks.md)

## Exported Symbols

#### ConfidenceTier
`ConfidenceTier` mirrors the high/medium/low tiers used throughout LLM ingestion, matching the calibrator output.

#### ModelInvocationRequest
`ModelInvocationRequest` is the payload sent to the underlying model invoker (prompt, schema, metadata tags).

#### ModelInvocationResult
`ModelInvocationResult` represents the raw model response, including usage telemetry and optional parsed relationships.

#### ModelUsage
`ModelUsage` holds token accounting information returned by the provider.

#### RawRelationshipCandidate
`RawRelationshipCandidate` is a single relationship emitted by the model prior to calibration.

#### RelationshipExtractionPrompt
`RelationshipExtractionPrompt` captures the template metadata and rendered prompt shared with the model.

#### RelationshipExtractionRequest
`RelationshipExtractionRequest` combines the prompt, template metadata, and optional schema passed to `extractRelationships`.

#### RelationshipExtractionBatch
`RelationshipExtractionBatch` packages the candidate relationships, prompt info, and usage details returned by the extractor.

#### RelationshipExtractorLogger
`RelationshipExtractorLogger` defines the `warn`/`error` hooks used to surface provider issues.

#### RelationshipExtractorOptions
`RelationshipExtractorOptions` wires the model invoker and logger into a constructed extractor.

#### RelationshipExtractor
`RelationshipExtractor` wraps the model invoker, validates output, and emits structured relationship batches.

## Responsibility
Wrap a provided `ModelInvoker`, enforce JSON response shape, and emit typed relationship batches enriched with provenance metadata (template id, version, prompt hash, model id, usage stats).

## Entry Points
- `extractRelationships(request: RelationshipExtractionRequest): Promise<RelationshipExtractionBatch>` invokes the model, validates output, and returns structured relationships + usage metadata.

## Workflow
1. Augment the outgoing request with template + prompt hash tags so downstream telemetry can attribute results.
2. Invoke the injected `ModelInvoker` (default stub lives in [`LlmIngestionManager`](../../../packages/server/src/runtime/llmIngestion.ts)) with prompt text and optional schema.
3. Parse string responses as JSON, or accept object responses as-is, retaining the raw text for debugging.
4. Validate `response.relationships` using an internal structural check, coercing optional fields (`confidence`, `supportingChunks`).
5. Return a batch payload containing relationships, prompt metadata, and provider usage numbers for provenance storage.

## Confidence Handling
- Leaves raw confidence values untouched; downstream calibration converts them into tiered diagnostics eligibility.
- Clamps numeric confidences to the `0..1` range to avoid invalid inputs.

## Error Modes
- Invalid JSON raises `RelationshipExtractorError` with the offending payload for the orchestrator to log.
- Missing or malformed `relationships` arrays trigger validation failures with detailed reasons.
- All other errors propagate so callers can attribute them to provider unavailability or runtime faults.

## Testing
- Unit tests should stub `ModelInvoker` to cover valid output, malformed JSON, and structural validation failures (see [`relationshipExtractor.test.ts`](../../../packages/shared/src/inference/llm/relationshipExtractor.test.ts)).
- Snapshot-style tests can assert that provenance tags (`link-aware.template`, `link-aware.prompt-hash`) are attached when requests are issued.

## Follow-ups
- Layer on schema-based validation once providers expose JSON mode guarantees.
- Capture token cost telemetry per request to inform orchestrator budgeting and throttling decisions.
