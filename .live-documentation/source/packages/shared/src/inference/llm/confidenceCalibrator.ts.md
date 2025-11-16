# packages/shared/src/inference/llm/confidenceCalibrator.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/inference/llm/confidenceCalibrator.ts
- Live Doc ID: LD-implementation-packages-shared-src-inference-llm-confidencecalibrator-ts
- Generated At: 2025-11-16T02:09:51.917Z

## Authored
### Purpose
Convert raw LLM relationship candidates into `CalibratedRelationship` records with normalized confidence tiers, numeric scores, and eligibility metadata that downstream diagnostics and reporters can rely on.

### Notes
Maps optional string labels to canonical tiers first, then falls back to numeric confidences constrained by configurable thresholds (defaulting to 0.8/0.5). Corroborated or previously stored link keys promote medium-strength relationships to diagnostics eligibility, while existing high-confidence links can shadow weaker duplicates unless `promoteShadowed` is requested. Each calibrated item keeps the raw label, flags whether more evidence is required, and records simple promotion criteria for debugging dashboards.

#### LlmConfidenceTier
Alias exported via `packages/shared/src/index.ts` for downstream convenience; resolves to [`ConfidenceTier`](#confidencetier).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.917Z","inputHash":"a688b699a353de15"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ConfidenceTier`
- Type: type
- Source: [source](../../../../../../../packages/shared/src/inference/llm/confidenceCalibrator.ts#L3)

#### `CalibratedRelationship`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/inference/llm/confidenceCalibrator.ts#L5)

#### `CalibrationContext`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/inference/llm/confidenceCalibrator.ts#L14)

#### `calibrateConfidence`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/inference/llm/confidenceCalibrator.ts#L35)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`relationshipExtractor.RawRelationshipCandidate`](./relationshipExtractor.ts.md#rawrelationshipcandidate) (type-only)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [analyzeWithAI.test.ts](../../../../extension/src/commands/analyzeWithAI.test.ts.md)
- [exportDiagnostics.test.ts](../../../../extension/src/commands/exportDiagnostics.test.ts.md)
- [inspectSymbolNeighbors.test.ts](../../../../extension/src/commands/inspectSymbolNeighbors.test.ts.md)
- [dependencyQuickPick.test.ts](../../../../extension/src/diagnostics/dependencyQuickPick.test.ts.md)
- [docDiagnosticProvider.test.ts](../../../../extension/src/diagnostics/docDiagnosticProvider.test.ts.md)
- [localOllamaBridge.test.ts](../../../../extension/src/services/localOllamaBridge.test.ts.md)
- [symbolBridge.test.ts](../../../../extension/src/services/symbolBridge.test.ts.md)
- [saveCodeChange.test.ts](../../../../server/src/features/changeEvents/saveCodeChange.test.ts.md)
- [saveDocumentChange.test.ts](../../../../server/src/features/changeEvents/saveDocumentChange.test.ts.md)
- [inspectDependencies.test.ts](../../../../server/src/features/dependencies/inspectDependencies.test.ts.md)
- [symbolNeighbors.test.ts](../../../../server/src/features/dependencies/symbolNeighbors.test.ts.md)
- [acknowledgementService.test.ts](../../../../server/src/features/diagnostics/acknowledgementService.test.ts.md)
- [listOutstandingDiagnostics.test.ts](../../../../server/src/features/diagnostics/listOutstandingDiagnostics.test.ts.md)
- [noiseFilter.test.ts](../../../../server/src/features/diagnostics/noiseFilter.test.ts.md)
- [publishDocDiagnostics.test.ts](../../../../server/src/features/diagnostics/publishDocDiagnostics.test.ts.md)
- [feedFormatDetector.test.ts](../../../../server/src/features/knowledge/feedFormatDetector.test.ts.md)
- [knowledgeFeedManager.test.ts](../../../../server/src/features/knowledge/knowledgeFeedManager.test.ts.md)
- [knowledgeGraphBridge.test.ts](../../../../server/src/features/knowledge/knowledgeGraphBridge.test.ts.md)
- [knowledgeGraphIngestor.test.ts](../../../../server/src/features/knowledge/knowledgeGraphIngestor.test.ts.md)
- [llmIngestionOrchestrator.test.ts](../../../../server/src/features/knowledge/llmIngestionOrchestrator.test.ts.md)
- [lsifParser.test.ts](../../../../server/src/features/knowledge/lsifParser.test.ts.md)
- [rippleAnalyzer.test.ts](../../../../server/src/features/knowledge/rippleAnalyzer.test.ts.md)
- [scipParser.test.ts](../../../../server/src/features/knowledge/scipParser.test.ts.md)
- [workspaceIndexProvider.test.ts](../../../../server/src/features/knowledge/workspaceIndexProvider.test.ts.md)
- [artifactWatcher.test.ts](../../../../server/src/features/watchers/artifactWatcher.test.ts.md)
- [pathReferenceDetector.test.ts](../../../../server/src/features/watchers/pathReferenceDetector.test.ts.md)
- [environment.test.ts](../../../../server/src/runtime/environment.test.ts.md)
- [settings.test.ts](../../../../server/src/runtime/settings.test.ts.md)
- [latencyTracker.test.ts](../../../../server/src/telemetry/latencyTracker.test.ts.md)
- [confidenceCalibrator.test.ts](./confidenceCalibrator.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
