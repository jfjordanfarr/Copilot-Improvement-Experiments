# packages/shared/src/index.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/index.ts
- Live Doc ID: LD-implementation-packages-shared-src-index-ts
- Generated At: 2025-11-12T00:39:23.981Z

## Authored
### Purpose
Aggregates the shared package surface so extension, server, and scripts can consume consistent domain contracts, tooling helpers, and LLM utilities from a single entry point.

### Notes
- Re-exports core graph/domain primitives, Live Documentation config, inference layers, telemetry trackers, and rule engines to avoid deep relative imports across packages.
- Hoists selective named exports (e.g., relationship extractor types, confidence calibration helpers) alongside module-level re-exports to provide tree-shakable access for callers.

#### LlmConfidenceTier
Alias for [`ConfidenceTier`](./inference/llm/confidenceCalibrator.ts.mdmd.md#confidencetier), exposed so consumers can import LLM calibration tiers from the package root.

#### OllamaChatUsage
Re-export of [`OllamaChatUsage`](./tooling/ollamaClient.ts.mdmd.md#ollamachatusage) used by CLI and diagnostics telemetry when summarising token counts.

#### OllamaInvocationError
Funnels callers to [`OllamaInvocationError`](./tooling/ollamaClient.ts.mdmd.md#ollamainvocationerror) without requiring deep tooling paths.

#### invokeOllamaChat
Surface-level entry point for [`invokeOllamaChat`](./tooling/ollamaClient.ts.mdmd.md#invokeollamachat), enabling downstream scripts to import from `@copilot-improvement/shared` directly.

#### createMockOllamaResponse
Re-export of [`createMockOllamaResponse`](./tooling/ollamaMock.ts.mdmd.md#createmockollamaresponse) for deterministic demos when Ollama access is unavailable.

#### resolveOllamaEndpoint
Convenience alias for [`resolveOllamaEndpoint`](./tooling/ollamaEndpoint.ts.mdmd.md#resolveollamaendpoint) so extension and server code reference a single package entry.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-12T00:39:23.981Z","inputHash":"9f7d2ead65fffa92"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`liveDocumentationConfig`](./config/liveDocumentationConfig.ts.mdmd.md) (re-export)
- [`dependencies`](./contracts/dependencies.ts.mdmd.md) (re-export)
- [`diagnostics`](./contracts/diagnostics.ts.mdmd.md) (re-export)
- [`llm`](./contracts/llm.ts.mdmd.md) (re-export)
- [`lsif`](./contracts/lsif.ts.mdmd.md) (re-export)
- [`maintenance`](./contracts/maintenance.ts.mdmd.md) (re-export)
- [`overrides`](./contracts/overrides.ts.mdmd.md) (re-export)
- [`scip`](./contracts/scip.ts.mdmd.md) (re-export)
- [`symbols`](./contracts/symbols.ts.mdmd.md) (re-export)
- [`telemetry`](./contracts/telemetry.ts.mdmd.md) (re-export)
- [`graphStore`](./db/graphStore.ts.mdmd.md) (re-export)
- [`artifacts`](./domain/artifacts.ts.mdmd.md) (re-export)
- [`fallbackInference`](./inference/fallbackInference.ts.mdmd.md) (re-export)
- [`linkInference`](./inference/linkInference.ts.mdmd.md) (re-export)
- [`confidenceCalibrator.CalibratedRelationship`](./inference/llm/confidenceCalibrator.ts.mdmd.md#calibratedrelationship) (re-export)
- [`confidenceCalibrator.CalibrationContext`](./inference/llm/confidenceCalibrator.ts.mdmd.md#calibrationcontext) (re-export)
- [`confidenceCalibrator.LlmConfidenceTier`](./inference/llm/confidenceCalibrator.ts.mdmd.md#llmconfidencetier) (re-export)
- [`confidenceCalibrator.calibrateConfidence`](./inference/llm/confidenceCalibrator.ts.mdmd.md#calibrateconfidence) (re-export)
- [`relationshipExtractor.ModelInvocationRequest`](./inference/llm/relationshipExtractor.ts.mdmd.md#modelinvocationrequest) (re-export)
- [`relationshipExtractor.ModelInvocationResult`](./inference/llm/relationshipExtractor.ts.mdmd.md#modelinvocationresult) (re-export)
- [`relationshipExtractor.ModelInvoker`](./inference/llm/relationshipExtractor.ts.mdmd.md#modelinvoker) (re-export)
- [`relationshipExtractor.ModelUsage`](./inference/llm/relationshipExtractor.ts.mdmd.md#modelusage) (re-export)
- [`relationshipExtractor.RawRelationshipCandidate`](./inference/llm/relationshipExtractor.ts.mdmd.md#rawrelationshipcandidate) (re-export)
- [`relationshipExtractor.RelationshipExtractionBatch`](./inference/llm/relationshipExtractor.ts.mdmd.md#relationshipextractionbatch) (re-export)
- [`relationshipExtractor.RelationshipExtractionPrompt`](./inference/llm/relationshipExtractor.ts.mdmd.md#relationshipextractionprompt) (re-export)
- [`relationshipExtractor.RelationshipExtractionRequest`](./inference/llm/relationshipExtractor.ts.mdmd.md#relationshipextractionrequest) (re-export)
- [`relationshipExtractor.RelationshipExtractor`](./inference/llm/relationshipExtractor.ts.mdmd.md#relationshipextractor) (re-export)
- [`relationshipExtractor.RelationshipExtractorError`](./inference/llm/relationshipExtractor.ts.mdmd.md#relationshipextractorerror) (re-export)
- [`relationshipExtractor.RelationshipExtractorLogger`](./inference/llm/relationshipExtractor.ts.mdmd.md#relationshipextractorlogger) (re-export)
- [`knowledgeGraphBridge`](./knowledge/knowledgeGraphBridge.ts.mdmd.md) (re-export)
- [`typeScriptAstUtils`](./language/typeScriptAstUtils.ts.mdmd.md) (re-export)
- [`coActivation`](./live-docs/analysis/coActivation.ts.mdmd.md) (re-export)
- [`markdown`](./live-docs/markdown.ts.mdmd.md) (re-export)
- [`schema`](./live-docs/schema.ts.mdmd.md) (re-export)
- [`types`](./live-docs/types.ts.mdmd.md) (re-export)
- [`testReport`](./reporting/testReport.ts.mdmd.md) (re-export)
- [`relationshipResolvers`](./rules/relationshipResolvers.ts.mdmd.md) (re-export)
- [`relationshipRuleAudit`](./rules/relationshipRuleAudit.ts.mdmd.md) (re-export)
- [`relationshipRuleEngine`](./rules/relationshipRuleEngine.ts.mdmd.md) (re-export)
- [`relationshipRuleProvider`](./rules/relationshipRuleProvider.ts.mdmd.md) (re-export)
- [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md) (re-export)
- [`symbolCorrectnessProfiles`](./rules/symbolCorrectnessProfiles.ts.mdmd.md) (re-export)
- [`inferenceAccuracy`](./telemetry/inferenceAccuracy.ts.mdmd.md) (re-export)
- [`assetPaths`](./tooling/assetPaths.ts.mdmd.md) (re-export)
- [`markdownLinks`](./tooling/markdownLinks.ts.mdmd.md) (re-export)
- [`ollamaClient`](./tooling/ollamaClient.ts.mdmd.md) (re-export)
- [`ollamaEndpoint`](./tooling/ollamaEndpoint.ts.mdmd.md) (re-export)
- [`ollamaMock`](./tooling/ollamaMock.ts.mdmd.md) (re-export)
- [`pathUtils`](./tooling/pathUtils.ts.mdmd.md) (re-export)
- [`symbolReferences`](./tooling/symbolReferences.ts.mdmd.md) (re-export)
- [`normalizeFileUri`](./uri/normalizeFileUri.ts.mdmd.md) (re-export)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [analyzeWithAI.test.ts](../../extension/src/commands/analyzeWithAI.test.ts.mdmd.md)
- [exportDiagnostics.test.ts](../../extension/src/commands/exportDiagnostics.test.ts.mdmd.md)
- [inspectSymbolNeighbors.test.ts](../../extension/src/commands/inspectSymbolNeighbors.test.ts.mdmd.md)
- [dependencyQuickPick.test.ts](../../extension/src/diagnostics/dependencyQuickPick.test.ts.mdmd.md)
- [docDiagnosticProvider.test.ts](../../extension/src/diagnostics/docDiagnosticProvider.test.ts.mdmd.md)
- [localOllamaBridge.test.ts](../../extension/src/services/localOllamaBridge.test.ts.mdmd.md)
- [symbolBridge.test.ts](../../extension/src/services/symbolBridge.test.ts.mdmd.md)
- [saveCodeChange.test.ts](../../server/src/features/changeEvents/saveCodeChange.test.ts.mdmd.md)
- [saveDocumentChange.test.ts](../../server/src/features/changeEvents/saveDocumentChange.test.ts.mdmd.md)
- [inspectDependencies.test.ts](../../server/src/features/dependencies/inspectDependencies.test.ts.mdmd.md)
- [symbolNeighbors.test.ts](../../server/src/features/dependencies/symbolNeighbors.test.ts.mdmd.md)
- [acknowledgementService.test.ts](../../server/src/features/diagnostics/acknowledgementService.test.ts.mdmd.md)
- [listOutstandingDiagnostics.test.ts](../../server/src/features/diagnostics/listOutstandingDiagnostics.test.ts.mdmd.md)
- [noiseFilter.test.ts](../../server/src/features/diagnostics/noiseFilter.test.ts.mdmd.md)
- [publishDocDiagnostics.test.ts](../../server/src/features/diagnostics/publishDocDiagnostics.test.ts.mdmd.md)
- [feedFormatDetector.test.ts](../../server/src/features/knowledge/feedFormatDetector.test.ts.mdmd.md)
- [knowledgeFeedManager.test.ts](../../server/src/features/knowledge/knowledgeFeedManager.test.ts.mdmd.md)
- [knowledgeGraphBridge.test.ts](../../server/src/features/knowledge/knowledgeGraphBridge.test.ts.mdmd.md)
- [knowledgeGraphIngestor.test.ts](../../server/src/features/knowledge/knowledgeGraphIngestor.test.ts.mdmd.md)
- [llmIngestionOrchestrator.test.ts](../../server/src/features/knowledge/llmIngestionOrchestrator.test.ts.mdmd.md)
- [lsifParser.test.ts](../../server/src/features/knowledge/lsifParser.test.ts.mdmd.md)
- [rippleAnalyzer.test.ts](../../server/src/features/knowledge/rippleAnalyzer.test.ts.mdmd.md)
- [scipParser.test.ts](../../server/src/features/knowledge/scipParser.test.ts.mdmd.md)
- [workspaceIndexProvider.test.ts](../../server/src/features/knowledge/workspaceIndexProvider.test.ts.mdmd.md)
- [artifactWatcher.test.ts](../../server/src/features/watchers/artifactWatcher.test.ts.mdmd.md)
- [pathReferenceDetector.test.ts](../../server/src/features/watchers/pathReferenceDetector.test.ts.mdmd.md)
- [environment.test.ts](../../server/src/runtime/environment.test.ts.mdmd.md)
- [settings.test.ts](../../server/src/runtime/settings.test.ts.mdmd.md)
- [latencyTracker.test.ts](../../server/src/telemetry/latencyTracker.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
