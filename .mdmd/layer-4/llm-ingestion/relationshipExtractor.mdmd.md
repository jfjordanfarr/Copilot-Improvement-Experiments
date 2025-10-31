# RelationshipExtractor

## Metadata
- Layer: 4
- Code Path: [`packages/shared/src/inference/llm/relationshipExtractor.ts`](../../../packages/shared/src/inference/llm/relationshipExtractor.ts)
- Exports: ConfidenceTier, RelationshipExtractionPrompt, ModelInvocationRequest, ModelUsage, ModelInvocationResult, ModelInvoker, RelationshipExtractionRequest, RawRelationshipCandidate, RelationshipExtractionBatch, RelationshipExtractorOptions, RelationshipExtractorLogger, RelationshipExtractorError, RelationshipExtractor
- Parent designs: [LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md)
- Spec references: [FR-019](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T071](../../../specs/001-link-aware-diagnostics/tasks.md)
- Tests: [`packages/shared/src/inference/llm/relationshipExtractor.test.ts`](../../../packages/shared/src/inference/llm/relationshipExtractor.test.ts)

## Purpose
Wrap the workspace’s `ModelInvoker`, validate raw provider responses, and emit structured relationship batches enriched with provenance and usage metadata so downstream calibration, telemetry, and diagnostics can trust the payload.

## Public Symbols

### ConfidenceTier
Union describing the calibrated confidence labels (`high`, `medium`, `low`) expected by telemetry and diagnostics pipelines.

### RelationshipExtractionPrompt
Metadata captured alongside rendered prompt text (template id/version, hash, timestamp) so provenance survives ingestion and audit flows.

### ModelInvocationRequest
Shape forwarded to the injected model invoker—prompt text, optional JSON schema, and tag map that records template provenance.

### ModelUsage
Token accounting payload returned by model providers; callers persist or aggregate usage across runs.

### ModelInvocationResult
Raw response from the provider (string or object) plus model identifier and optional usage metrics.

### ModelInvoker
Async function signature supplied by runtime hosts; allows server, extension, and tests to substitute real providers or deterministic mocks.

### RelationshipExtractionRequest
Input accepted by `extractRelationships`, bundling prompt metadata, optional schema, and additional tags to forward to the provider.

### RawRelationshipCandidate
Intermediate relationship structure produced by the LLM prior to calibration. Holds identifiers, relationship kind, confidences, rationales, and supporting chunk references.

### RelationshipExtractionBatch
Structured payload returned to callers: prompt metadata, model identifier, usage metrics, raw response text, and validated candidate list.

### RelationshipExtractorOptions
Constructor contract specifying the model invoker and optional logger hooks for warning/error surfacing.

### RelationshipExtractorLogger
Minimal logging surface used to inform orchestrators about malformed responses without crashing the extraction pipeline.

### RelationshipExtractorError
Error subclass raised when JSON parsing or structural validation fails. Carries diagnostic context (`response`, `reason`) for log attribution.

### RelationshipExtractor (class)
Primary class orchestrating invocation, provenance tagging, validation, and batch assembly.

## Responsibilities
- Attach provenance tags (`link-aware.*`) before invoking the model so telemetry and audits can attribute responses.
- Parse string responses as JSON while retaining original text for troubleshooting.
- Validate `relationships` arrays, coercing optional numeric fields into the `[0, 1]` range and filtering malformed chunk references.
- Emit consistent error types when parsing or validation fails, allowing orchestrators to downgrade to mock responses when necessary.

## Collaborators
- [`packages/shared/src/inference/llm/confidenceCalibrator.ts`](../../../packages/shared/src/inference/llm/confidenceCalibrator.ts) consumes `RawRelationshipCandidate` payloads to scale confidences.
- [`packages/server/src/features/knowledge/llmIngestionOrchestrator.ts`](../../../packages/server/src/features/knowledge/llmIngestionOrchestrator.ts) owns the default `ModelInvoker` wiring and error handling.
- [`packages/shared/src/tooling/ollamaClient.ts`](../../../packages/shared/src/tooling/ollamaClient.ts) and [`ollamaMock.ts`](../../../packages/shared/src/tooling/ollamaMock.ts) provide runtime/model implementations for local development.

## Evidence
- Unit tests: [`packages/shared/src/inference/llm/relationshipExtractor.test.ts`](../../../packages/shared/src/inference/llm/relationshipExtractor.test.ts) cover happy path extraction, JSON parsing failures, and validation edge cases.
- Integration: `npm run graph:audit` exercises extraction via mock providers to confirm provenance tags land in the persisted graph.

## Failure Modes
- Invalid JSON responses raise `RelationshipExtractorError` with raw payload for audit logs.
- Structural validation failures identify the missing field or malformed relationship and surface via the logger before throwing.
- Unhandled provider failures bubble from the injected `ModelInvoker`, allowing higher layers to decide on retries or fallbacks.
