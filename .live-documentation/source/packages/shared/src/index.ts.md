# packages/shared/src/index.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/index.ts
- Live Doc ID: LD-implementation-packages-shared-src-index-ts
- Generated At: 2025-11-16T02:09:51.797Z

## Authored
### Purpose
Aggregates the shared package surface so extension, server, and scripts can consume consistent domain contracts, tooling helpers, and LLM utilities from a single entry point.

### Notes
- Re-exports core graph/domain primitives, Live Documentation config, inference layers, telemetry trackers, and rule engines to avoid deep relative imports across packages.
- Hoists selective named exports (e.g., relationship extractor types, confidence calibration helpers) alongside module-level re-exports to provide tree-shakable access for callers.

#### LlmConfidenceTier
Alias for [`ConfidenceTier`](./inference/llm/confidenceCalibrator.ts.md#confidencetier), exposed so consumers can import LLM calibration tiers from the package root.

#### OllamaChatUsage
Re-export of [`OllamaChatUsage`](./tooling/ollamaClient.ts.md#ollamachatusage) used by CLI and diagnostics telemetry when summarising token counts.

#### OllamaInvocationError
Funnels callers to [`OllamaInvocationError`](./tooling/ollamaClient.ts.md#ollamainvocationerror) without requiring deep tooling paths.

#### invokeOllamaChat
Surface-level entry point for [`invokeOllamaChat`](./tooling/ollamaClient.ts.md#invokeollamachat), enabling downstream scripts to import from `@copilot-improvement/shared` directly.

#### createMockOllamaResponse
Re-export of [`createMockOllamaResponse`](./tooling/ollamaMock.ts.md#createmockollamaresponse) for deterministic demos when Ollama access is unavailable.

#### resolveOllamaEndpoint
Convenience alias for [`resolveOllamaEndpoint`](./tooling/ollamaEndpoint.ts.md#resolveollamaendpoint) so extension and server code reference a single package entry.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.797Z","inputHash":"7de19b180fdb988a"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`liveDocumentationConfig`](./config/liveDocumentationConfig.ts.md) (re-export)
- [`dependencies`](./contracts/dependencies.ts.md) (re-export)
- [`diagnostics`](./contracts/diagnostics.ts.md) (re-export)
- [`llm`](./contracts/llm.ts.md) (re-export)
- [`lsif`](./contracts/lsif.ts.md) (re-export)
- [`maintenance`](./contracts/maintenance.ts.md) (re-export)
- [`overrides`](./contracts/overrides.ts.md) (re-export)
- [`scip`](./contracts/scip.ts.md) (re-export)
- [`symbols`](./contracts/symbols.ts.md) (re-export)
- [`telemetry`](./contracts/telemetry.ts.md) (re-export)
- [`graphStore`](./db/graphStore.ts.md) (re-export)
- [`artifacts`](./domain/artifacts.ts.md) (re-export)
- [`fallbackInference`](./inference/fallbackInference.ts.md) (re-export)
- [`linkInference`](./inference/linkInference.ts.md) (re-export)
- [`confidenceCalibrator.CalibratedRelationship`](./inference/llm/confidenceCalibrator.ts.md#calibratedrelationship) (re-export)
- [`confidenceCalibrator.CalibrationContext`](./inference/llm/confidenceCalibrator.ts.md#calibrationcontext) (re-export)
- [`confidenceCalibrator.LlmConfidenceTier`](./inference/llm/confidenceCalibrator.ts.md#llmconfidencetier) (re-export)
- [`confidenceCalibrator.calibrateConfidence`](./inference/llm/confidenceCalibrator.ts.md#calibrateconfidence) (re-export)
- [`relationshipExtractor.ModelInvocationRequest`](./inference/llm/relationshipExtractor.ts.md#modelinvocationrequest) (re-export)
- [`relationshipExtractor.ModelInvocationResult`](./inference/llm/relationshipExtractor.ts.md#modelinvocationresult) (re-export)
- [`relationshipExtractor.ModelInvoker`](./inference/llm/relationshipExtractor.ts.md#modelinvoker) (re-export)
- [`relationshipExtractor.ModelUsage`](./inference/llm/relationshipExtractor.ts.md#modelusage) (re-export)
- [`relationshipExtractor.RawRelationshipCandidate`](./inference/llm/relationshipExtractor.ts.md#rawrelationshipcandidate) (re-export)
- [`relationshipExtractor.RelationshipExtractionBatch`](./inference/llm/relationshipExtractor.ts.md#relationshipextractionbatch) (re-export)
- [`relationshipExtractor.RelationshipExtractionPrompt`](./inference/llm/relationshipExtractor.ts.md#relationshipextractionprompt) (re-export)
- [`relationshipExtractor.RelationshipExtractionRequest`](./inference/llm/relationshipExtractor.ts.md#relationshipextractionrequest) (re-export)
- [`relationshipExtractor.RelationshipExtractor`](./inference/llm/relationshipExtractor.ts.md#relationshipextractor) (re-export)
- [`relationshipExtractor.RelationshipExtractorError`](./inference/llm/relationshipExtractor.ts.md#relationshipextractorerror) (re-export)
- [`relationshipExtractor.RelationshipExtractorLogger`](./inference/llm/relationshipExtractor.ts.md#relationshipextractorlogger) (re-export)
- [`knowledgeGraphBridge`](./knowledge/knowledgeGraphBridge.ts.md) (re-export)
- [`typeScriptAstUtils`](./language/typeScriptAstUtils.ts.md) (re-export)
- [`coActivation`](./live-docs/analysis/coActivation.ts.md) (re-export)
- [`markdown`](./live-docs/markdown.ts.md) (re-export)
- [`schema`](./live-docs/schema.ts.md) (re-export)
- [`types`](./live-docs/types.ts.md) (re-export)
- [`testReport`](./reporting/testReport.ts.md) (re-export)
- [`relationshipResolvers`](./rules/relationshipResolvers.ts.md) (re-export)
- [`relationshipRuleAudit`](./rules/relationshipRuleAudit.ts.md) (re-export)
- [`relationshipRuleEngine`](./rules/relationshipRuleEngine.ts.md) (re-export)
- [`relationshipRuleProvider`](./rules/relationshipRuleProvider.ts.md) (re-export)
- [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.md) (re-export)
- [`symbolCorrectnessProfiles`](./rules/symbolCorrectnessProfiles.ts.md) (re-export)
- [`inferenceAccuracy`](./telemetry/inferenceAccuracy.ts.md) (re-export)
- [`assetPaths`](./tooling/assetPaths.ts.md) (re-export)
- [`markdownLinks`](./tooling/markdownLinks.ts.md) (re-export)
- [`ollamaClient`](./tooling/ollamaClient.ts.md) (re-export)
- [`ollamaEndpoint`](./tooling/ollamaEndpoint.ts.md) (re-export)
- [`ollamaMock`](./tooling/ollamaMock.ts.md) (re-export)
- [`pathUtils`](./tooling/pathUtils.ts.md) (re-export)
- [`symbolReferences`](./tooling/symbolReferences.ts.md) (re-export)
- [`normalizeFileUri`](./uri/normalizeFileUri.ts.md) (re-export)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [analyzeWithAI.test.ts](../../extension/src/commands/analyzeWithAI.test.ts.md)
- [exportDiagnostics.test.ts](../../extension/src/commands/exportDiagnostics.test.ts.md)
- [inspectSymbolNeighbors.test.ts](../../extension/src/commands/inspectSymbolNeighbors.test.ts.md)
- [dependencyQuickPick.test.ts](../../extension/src/diagnostics/dependencyQuickPick.test.ts.md)
- [docDiagnosticProvider.test.ts](../../extension/src/diagnostics/docDiagnosticProvider.test.ts.md)
- [localOllamaBridge.test.ts](../../extension/src/services/localOllamaBridge.test.ts.md)
- [symbolBridge.test.ts](../../extension/src/services/symbolBridge.test.ts.md)
- [saveCodeChange.test.ts](../../server/src/features/changeEvents/saveCodeChange.test.ts.md)
- [saveDocumentChange.test.ts](../../server/src/features/changeEvents/saveDocumentChange.test.ts.md)
- [inspectDependencies.test.ts](../../server/src/features/dependencies/inspectDependencies.test.ts.md)
- [symbolNeighbors.test.ts](../../server/src/features/dependencies/symbolNeighbors.test.ts.md)
- [acknowledgementService.test.ts](../../server/src/features/diagnostics/acknowledgementService.test.ts.md)
- [listOutstandingDiagnostics.test.ts](../../server/src/features/diagnostics/listOutstandingDiagnostics.test.ts.md)
- [noiseFilter.test.ts](../../server/src/features/diagnostics/noiseFilter.test.ts.md)
- [publishDocDiagnostics.test.ts](../../server/src/features/diagnostics/publishDocDiagnostics.test.ts.md)
- [feedFormatDetector.test.ts](../../server/src/features/knowledge/feedFormatDetector.test.ts.md)
- [knowledgeFeedManager.test.ts](../../server/src/features/knowledge/knowledgeFeedManager.test.ts.md)
- [knowledgeGraphBridge.test.ts](../../server/src/features/knowledge/knowledgeGraphBridge.test.ts.md)
- [knowledgeGraphIngestor.test.ts](../../server/src/features/knowledge/knowledgeGraphIngestor.test.ts.md)
- [llmIngestionOrchestrator.test.ts](../../server/src/features/knowledge/llmIngestionOrchestrator.test.ts.md)
- [lsifParser.test.ts](../../server/src/features/knowledge/lsifParser.test.ts.md)
- [rippleAnalyzer.test.ts](../../server/src/features/knowledge/rippleAnalyzer.test.ts.md)
- [scipParser.test.ts](../../server/src/features/knowledge/scipParser.test.ts.md)
- [workspaceIndexProvider.test.ts](../../server/src/features/knowledge/workspaceIndexProvider.test.ts.md)
- [artifactWatcher.test.ts](../../server/src/features/watchers/artifactWatcher.test.ts.md)
- [pathReferenceDetector.test.ts](../../server/src/features/watchers/pathReferenceDetector.test.ts.md)
- [environment.test.ts](../../server/src/runtime/environment.test.ts.md)
- [settings.test.ts](../../server/src/runtime/settings.test.ts.md)
- [latencyTracker.test.ts](../../server/src/telemetry/latencyTracker.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
