# RelationshipExtractor (Layer 4)

## Source Mapping
- Implementation (planned): `packages/shared/src/inference/llm/relationshipExtractor.ts`
- Collaborators: `ProviderGuard`, `ConfidenceCalibrator`, `PromptTemplates`
- Parent design: [LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md)
- Spec references: [FR-019](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T071](../../../specs/001-link-aware-diagnostics/tasks.md)

## Responsibility
Issue constrained `vscode.lm` completions using repository-defined prompt templates, enforce JSON adherence, and translate model responses into strongly typed relationship descriptors with provenance metadata.

## Entry Points
- `extractRelationships(request: ExtractionRequest): Promise<ExtractionResult>`
  - Prepares the prompt, executes the model call, and returns structured relationships plus raw response metadata.
- `validateResponse(raw: string | object): RelationshipBatch` converts model output into DTOs, throwing typed errors when schema validation fails.

## Workflow
1. Combine chunked artifact data, known artifact identifiers, and allowed relationship kinds into the prompt template.
2. Invoke `vscode.lm.complete` with deterministic options (`temperature = 0`, `top_p = 0`, schema-constrained response mode when available).
3. Parse the response; if schema-constrained decoding fails, attempt a fallback JSON parse and emit diagnostics with the offending text.
4. Map each relationship to internal structures (`sourceId`, `targetId`, `kind`, `modelConfidence`, `supportingChunks`, `rationale`).
5. Return structured data alongside provider telemetry (tokens used, duration, model id) for logging.

## Confidence Handling
- Raw confidence values from the model (`"high"`, `0-1`, etc.) are normalised upstream by `ConfidenceCalibrator`.
- Record original values in `rawConfidence` for audit.

## Error Modes
- **Schema violation**: Throw `SchemaError` with contextual metadata; orchestrator logs via `LLMIngestionDiagnostics`.
- **Provider rejection**: Wrap errors from `vscode.lm` (quota, policy) in `ProviderError` to allow retry/backoff.
- **Empty output**: Return an empty relationship batch while warning telemetry so we can flag prompt regressions.

## Testing
- Unit tests mock `vscode.lm` to simulate well-formed JSON, malformed responses, and provider failures.
- Golden prompt fixtures ensure chunk identifiers and allowed relationship lists render deterministically.

## Follow-ups
- Investigate streaming completion support to reduce latency once `vscode.lm` exposes JSON streaming APIs.
- Add cost estimation helpers so orchestrator can budget per-artifact token spend before executing requests.
