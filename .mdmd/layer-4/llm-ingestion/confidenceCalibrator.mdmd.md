# ConfidenceCalibrator (Layer 4)

## Source Mapping
- Implementation (planned): `packages/shared/src/inference/llm/confidenceCalibrator.ts`
- Collaborators: `RelationshipExtractor`, `KnowledgeGraphBridge`
- Parent design: [LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md)
- Spec references: [FR-019](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T071](../../../specs/001-link-aware-diagnostics/tasks.md)

## Responsibility
Translate model-supplied confidence values into repository-wide `High`, `Medium`, or `Low` tiers, apply decay heuristics, and flag edges that require corroboration before diagnostics consume them.

## Entry Points
- `calibrate(batch: RelationshipBatch, context: CalibrationContext): CalibratedRelationships`
  - Accepts raw relationships, applies thresholds, and annotates edges with `confidenceTier`, `promotionCriteria`, and `shadowed` flags.

## Calibration Rules
- `High` tier requires direct identifier matches or corroboration from existing edges/overrides.
- `Medium` tier applies when identifiers partially match or contextual clues are strong; edges note required corroboration (e.g., “manual confirmation” or “second inference pass”).
- `Low` tier captures speculative edges; mark as `diagnosticsEligible = false` until upgraded.
- Apply hop-based decay when the model proposes multi-step relationships absent in the current graph.

## Metadata Handling
- Preserve `rawConfidence`, `modelId`, `promptHash`, and `supportingChunks` so auditors can trace how the tier was assigned.
- Append `derivedAt` timestamps that record when calibration occurred for change tracking.

## Error Modes
- If thresholds are misconfigured (e.g., `mediumMin > highMin`), throw `ConfigurationError` to prevent inconsistent tiering.
- When required corroboration data is missing, downgrade to `Low` and emit a warning.

## Testing
- Unit tests assert tier boundaries, corroboration promotion rules, and hop-based decay application.
- Golden datasets verify that identical inputs yield consistent tiers across runs.

## Follow-ups
- Allow workspace admins to tweak thresholds via settings surfaced under `linkAwareDiagnostics.llmConfidence`.
- Integrate telemetry that tracks promotion rates from `Medium`/`Low` to `High` for observability.
