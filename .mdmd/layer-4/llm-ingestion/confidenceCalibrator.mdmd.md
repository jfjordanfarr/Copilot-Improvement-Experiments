# ConfidenceCalibrator (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/inference/llm/confidenceCalibrator.ts`](../../../packages/shared/src/inference/llm/confidenceCalibrator.ts)
- Collaborators:
  - [`RelationshipExtractor`](../../../packages/shared/src/inference/llm/relationshipExtractor.ts) – produces the raw candidates we calibrate.
  - [`LlmIngestionOrchestrator`](../../../packages/server/src/features/knowledge/llmIngestionOrchestrator.ts) – supplies context (existing/corroborated links) and consumes calibrated results.
- Parent design: [LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md)
- Spec references: [FR-019](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T071](../../../specs/001-link-aware-diagnostics/tasks.md)

## Exported Symbols

#### ConfidenceTier
`ConfidenceTier` enumerates the high/medium/low buckets assigned to calibrated relationships.

#### CalibrationContext
`CalibrationContext` supplies existing link metadata so the calibrator can decide when to promote or shadow candidates.

#### CalibratedRelationship
`CalibratedRelationship` is the enriched candidate returned by the calibrator, including eligibility flags and promotion criteria.

## Responsibility
Normalize raw model confidences into repository-wide tiers, decide whether an inferred relationship is safe for diagnostics, and annotate each edge with provenance needed for audits (`confidenceTier`, `shadowed`, `promotionCriteria`).

## Entry Points
- `calibrateConfidence(candidates: RawRelationshipCandidate[], context?: CalibrationContext): CalibratedRelationship[]`
  - Applies label overrides (`high`/`medium`/`low`), numeric thresholds, and corroboration rules to each candidate before returning diagnostics-ready metadata.

## Calibration Rules
- Respect explicit confidence labels from the model when present; otherwise clamp and evaluate numeric confidences against defaults (`high ≥ 0.8`, `medium ≥ 0.5`).
- Mark relationships as `diagnosticsEligible = true` when they land in the `high` tier, or when they are `medium` tier with corroboration (existing or corroborated link keys).
- Flag relationships as `shadowed` when a non-`high` candidate duplicates an existing link and `promoteShadowed` is not set.
- Attach `promotionCriteria: ["requires corroboration"]` to relationships that fail eligibility so downstream tooling knows why they were skipped.

## Metadata Handling
- Preserve raw fields (`confidence`, `confidenceLabel`, `supportingChunks`, `rationale`) while emitting `confidenceTier`, `calibratedConfidence`, `diagnosticsEligible`, `shadowed`, and optional `promotionCriteria`.
- Copy through the model-supplied label into `rawConfidenceLabel` for forensic comparison with calibrated tiers.

## Error Modes
- The current implementation does not throw; when thresholds are omitted or inconsistent the defaults guard behaviour. Future validation hooks may enforce configuration sanity if custom thresholds are introduced.

## Testing
- [`confidenceCalibrator.test.ts`](../../../packages/shared/src/inference/llm/confidenceCalibrator.test.ts) verifies tier boundaries, corroboration gating, and shadowed-link behaviour.

## Follow-ups
- Expose configurable thresholds via server settings once LLM providers ship varied scoring scales.
- Emit telemetry summarising how often calibration downgrades or promotes relationships so operators can tune prompts and corroboration signals.
