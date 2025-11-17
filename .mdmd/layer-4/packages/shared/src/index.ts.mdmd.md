# packages/shared/src/index.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/index.ts
- Live Doc ID: LD-implementation-packages-shared-src-index-ts
- Generated At: 2025-11-16T23:18:48.958Z

## Authored
### Purpose
Provides the single `@copilot-improvement/shared` entrypoint that re-exports inference, telemetry, and tooling surfaces so extension, server, and CLI code consume a consistent API ([link inference orchestrator rollout](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-17.SUMMARIZED.md#turn-11-build-link-inference-orchestrator-lines-515-657)).

### Notes
- Carries new Live Documentation configuration exports introduced during the Stage 0 adoption push, letting downstream commands honour the configurable base layer without bespoke wiring ([Stage 0 configuration pass](../../../../../AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-08.SUMMARIZED.md#turn-12-stage-0-complete-with-config--staging-tree-lines-2021-2160)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T23:18:48.958Z","inputHash":"9f4be42d418fc877"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `RelationshipExtractor`
- Type: unknown
- Source: [source](../../../../../packages/shared/src/index.ts#L27)

#### `RelationshipExtractorError`
- Type: unknown
- Source: [source](../../../../../packages/shared/src/index.ts#L28)

#### `RelationshipExtractorLogger`
- Type: type (type-only)
- Source: [source](../../../../../packages/shared/src/index.ts#L29)

#### `RelationshipExtractionBatch`
- Type: type (type-only)
- Source: [source](../../../../../packages/shared/src/index.ts#L30)

#### `RelationshipExtractionPrompt`
- Type: type (type-only)
- Source: [source](../../../../../packages/shared/src/index.ts#L31)

#### `RelationshipExtractionRequest`
- Type: type (type-only)
- Source: [source](../../../../../packages/shared/src/index.ts#L32)

#### `RawRelationshipCandidate`
- Type: type (type-only)
- Source: [source](../../../../../packages/shared/src/index.ts#L33)

#### `ModelInvocationRequest`
- Type: type (type-only)
- Source: [source](../../../../../packages/shared/src/index.ts#L34)

#### `ModelInvocationResult`
- Type: type (type-only)
- Source: [source](../../../../../packages/shared/src/index.ts#L35)

#### `ModelInvoker`
- Type: type (type-only)
- Source: [source](../../../../../packages/shared/src/index.ts#L36)

#### `ModelUsage`
- Type: type (type-only)
- Source: [source](../../../../../packages/shared/src/index.ts#L37)

#### `calibrateConfidence`
- Type: unknown
- Source: [source](../../../../../packages/shared/src/index.ts#L41)

#### `CalibratedRelationship`
- Type: type (type-only)
- Source: [source](../../../../../packages/shared/src/index.ts#L42)

#### `LlmConfidenceTier`
- Type: type (type-only)
- Source: [source](../../../../../packages/shared/src/index.ts#L43)

#### `CalibrationContext`
- Type: type (type-only)
- Source: [source](../../../../../packages/shared/src/index.ts#L44)
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
- [`confidenceCalibrator.LlmConfidenceTier`](./inference/llm/confidenceCalibrator.ts.mdmd.md#confidencetier) (re-export)
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

<!-- LIVE-DOC:BEGIN Re-Exported Symbol Anchors -->
### Re-Exported Symbol Anchors
#### `AccuracySample`
- Re-exported from [`inferenceAccuracy`](./telemetry/inferenceAccuracy.ts.mdmd.md#accuracysample)

#### `AccuracyTotals`
- Re-exported from [`inferenceAccuracy`](./telemetry/inferenceAccuracy.ts.mdmd.md#accuracytotals)

#### `ACKNOWLEDGE_DIAGNOSTIC_REQUEST`
- Re-exported from [`diagnostics`](./contracts/diagnostics.ts.mdmd.md#acknowledge_diagnostic_request)

#### `AcknowledgeDiagnosticParams`
- Re-exported from [`diagnostics`](./contracts/diagnostics.ts.mdmd.md#acknowledgediagnosticparams)

#### `AcknowledgeDiagnosticResult`
- Re-exported from [`diagnostics`](./contracts/diagnostics.ts.mdmd.md#acknowledgediagnosticresult)

#### `AcknowledgeDiagnosticStatus`
- Re-exported from [`diagnostics`](./contracts/diagnostics.ts.mdmd.md#acknowledgediagnosticstatus)

#### `AcknowledgementAction`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#acknowledgementaction)

#### `AcknowledgementActionType`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#acknowledgementactiontype)

#### `ArtifactLayer`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#artifactlayer)

#### `ArtifactSeed`
- Re-exported from [`fallbackInference`](./inference/fallbackInference.ts.mdmd.md#artifactseed)

#### `AssetAuditOptions`
- Re-exported from [`assetPaths`](./tooling/assetPaths.ts.mdmd.md#assetauditoptions)

#### `AssetReferenceIssue`
- Re-exported from [`assetPaths`](./tooling/assetPaths.ts.mdmd.md#assetreferenceissue)

#### `AstAccuracyData`
- Re-exported from [`testReport`](./reporting/testReport.ts.mdmd.md#astaccuracydata)

#### `AstAccuracyFixture`
- Re-exported from [`testReport`](./reporting/testReport.ts.mdmd.md#astaccuracyfixture)

#### `AstAccuracyTotals`
- Re-exported from [`testReport`](./reporting/testReport.ts.mdmd.md#astaccuracytotals)

#### `BenchmarkAccuracySummary`
- Re-exported from [`inferenceAccuracy`](./telemetry/inferenceAccuracy.ts.mdmd.md#benchmarkaccuracysummary)

#### `BenchmarkEnvironment`
- Re-exported from [`testReport`](./reporting/testReport.ts.mdmd.md#benchmarkenvironment)

#### `BenchmarkRecord`
- Re-exported from [`testReport`](./reporting/testReport.ts.mdmd.md#benchmarkrecord)

#### `buildTestReportMarkdown`
- Re-exported from [`testReport`](./reporting/testReport.ts.mdmd.md#buildtestreportmarkdown)

#### `ChangeEvent`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#changeevent)

#### `ChangeEventProvenance`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#changeeventprovenance)

#### `ChangeEventRange`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#changeeventrange)

#### `ChangeEventType`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#changeeventtype)

#### `COLLECT_WORKSPACE_SYMBOLS_REQUEST`
- Re-exported from [`symbols`](./contracts/symbols.ts.mdmd.md#collect_workspace_symbols_request)

#### `collectIdentifierUsage`
- Re-exported from [`typeScriptAstUtils`](./language/typeScriptAstUtils.ts.mdmd.md#collectidentifierusage)

#### `CollectWorkspaceSymbolsParams`
- Re-exported from [`symbols`](./contracts/symbols.ts.mdmd.md#collectworkspacesymbolsparams)

#### `CollectWorkspaceSymbolsResult`
- Re-exported from [`symbols`](./contracts/symbols.ts.mdmd.md#collectworkspacesymbolsresult)

#### `CollectWorkspaceSymbolsResultSummary`
- Re-exported from [`symbols`](./contracts/symbols.ts.mdmd.md#collectworkspacesymbolsresultsummary)

#### `CompiledRelationshipRule`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#compiledrelationshiprule)

#### `CompiledRelationshipRulePropagation`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#compiledrelationshiprulepropagation)

#### `CompiledRelationshipRules`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#compiledrelationshiprules)

#### `CompiledRelationshipRuleStep`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#compiledrelationshiprulestep)

#### `CompiledSymbolProfile`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#compiledsymbolprofile)

#### `CompiledSymbolProfileRequirement`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#compiledsymbolprofilerequirement)

#### `CompiledSymbolProfileSource`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#compiledsymbolprofilesource)

#### `CompiledSymbolProfileTarget`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#compiledsymbolprofiletarget)

#### `compileRelationshipRules`
- Re-exported from [`relationshipRuleEngine`](./rules/relationshipRuleEngine.ts.mdmd.md#compilerelationshiprules)

#### `compileSymbolProfiles`
- Re-exported from [`symbolCorrectnessProfiles`](./rules/symbolCorrectnessProfiles.ts.mdmd.md#compilesymbolprofiles)

#### `CompileSymbolProfilesResult`
- Re-exported from [`symbolCorrectnessProfiles`](./rules/symbolCorrectnessProfiles.ts.mdmd.md#compilesymbolprofilesresult)

#### `createBuiltInResolvers`
- Re-exported from [`relationshipResolvers`](./rules/relationshipResolvers.ts.mdmd.md#createbuiltinresolvers)

#### `createMockOllamaResponse`
- Re-exported from [`ollamaMock`](./tooling/ollamaMock.ts.mdmd.md#createmockollamaresponse)

#### `CreateMockOllamaResponseOptions`
- Re-exported from [`ollamaMock`](./tooling/ollamaMock.ts.mdmd.md#createmockollamaresponseoptions)

#### `createRelationshipRuleProvider`
- Re-exported from [`relationshipRuleProvider`](./rules/relationshipRuleProvider.ts.mdmd.md#createrelationshipruleprovider)

#### `DEFAULT_LIVE_DOCUMENTATION_CONFIG`
- Re-exported from [`liveDocumentationConfig`](./config/liveDocumentationConfig.ts.mdmd.md#default_live_documentation_config)

#### `DEFAULT_OLLAMA_ENDPOINT`
- Re-exported from [`ollamaEndpoint`](./tooling/ollamaEndpoint.ts.mdmd.md#default_ollama_endpoint)

#### `DependencyGraphEdge`
- Re-exported from [`dependencies`](./contracts/dependencies.ts.mdmd.md#dependencygraphedge)

#### `DIAGNOSTIC_ACKNOWLEDGED_NOTIFICATION`
- Re-exported from [`diagnostics`](./contracts/diagnostics.ts.mdmd.md#diagnostic_acknowledged_notification)

#### `DiagnosticAcknowledgedPayload`
- Re-exported from [`diagnostics`](./contracts/diagnostics.ts.mdmd.md#diagnosticacknowledgedpayload)

#### `DiagnosticArtifactSummary`
- Re-exported from [`diagnostics`](./contracts/diagnostics.ts.mdmd.md#diagnosticartifactsummary)

#### `DiagnosticRecord`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#diagnosticrecord)

#### `DiagnosticSeverity`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#diagnosticseverity)

#### `DiagnosticStatus`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#diagnosticstatus)

#### `DriftHistoryEntry`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#drifthistoryentry)

#### `DriftHistoryStatus`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#drifthistorystatus)

#### `DriftHistorySummary`
- Re-exported from [`graphStore`](./db/graphStore.ts.mdmd.md#drifthistorysummary)

#### `evaluateRelationshipCoverage`
- Re-exported from [`relationshipRuleAudit`](./rules/relationshipRuleAudit.ts.mdmd.md#evaluaterelationshipcoverage)

#### `EvaluateRelationshipCoverageOptions`
- Re-exported from [`relationshipRuleAudit`](./rules/relationshipRuleAudit.ts.mdmd.md#evaluaterelationshipcoverageoptions)

#### `EXPORT_DIAGNOSTICS_REQUEST`
- Re-exported from [`diagnostics`](./contracts/diagnostics.ts.mdmd.md#export_diagnostics_request)

#### `ExportDiagnosticsResult`
- Re-exported from [`diagnostics`](./contracts/diagnostics.ts.mdmd.md#exportdiagnosticsresult)

#### `ExternalArtifact`
- Re-exported from [`knowledgeGraphBridge`](./knowledge/knowledgeGraphBridge.ts.mdmd.md#externalartifact)

#### `ExternalLink`
- Re-exported from [`knowledgeGraphBridge`](./knowledge/knowledgeGraphBridge.ts.mdmd.md#externallink)

#### `ExternalSnapshot`
- Re-exported from [`knowledgeGraphBridge`](./knowledge/knowledgeGraphBridge.ts.mdmd.md#externalsnapshot)

#### `ExternalStreamEvent`
- Re-exported from [`knowledgeGraphBridge`](./knowledge/knowledgeGraphBridge.ts.mdmd.md#externalstreamevent)

#### `extractLocalImportNames`
- Re-exported from [`typeScriptAstUtils`](./language/typeScriptAstUtils.ts.mdmd.md#extractlocalimportnames)

#### `FallbackGraphInput`
- Re-exported from [`fallbackInference`](./inference/fallbackInference.ts.mdmd.md#fallbackgraphinput)

#### `FallbackGraphOptions`
- Re-exported from [`fallbackInference`](./inference/fallbackInference.ts.mdmd.md#fallbackgraphoptions)

#### `FallbackInferenceResult`
- Re-exported from [`fallbackInference`](./inference/fallbackInference.ts.mdmd.md#fallbackinferenceresult)

#### `FallbackLLMBridge`
- Re-exported from [`fallbackInference`](./inference/fallbackInference.ts.mdmd.md#fallbackllmbridge)

#### `FEEDS_READY_REQUEST`
- Re-exported from [`diagnostics`](./contracts/diagnostics.ts.mdmd.md#feeds_ready_request)

#### `FeedsReadyResult`
- Re-exported from [`diagnostics`](./contracts/diagnostics.ts.mdmd.md#feedsreadyresult)

#### `findBrokenAssetReferences`
- Re-exported from [`assetPaths`](./tooling/assetPaths.ts.mdmd.md#findbrokenassetreferences)

#### `findBrokenMarkdownLinks`
- Re-exported from [`markdownLinks`](./tooling/markdownLinks.ts.mdmd.md#findbrokenmarkdownlinks)

#### `findSymbolReferenceAnomalies`
- Re-exported from [`symbolReferences`](./tooling/symbolReferences.ts.mdmd.md#findsymbolreferenceanomalies)

#### `formatRelationshipDiagnostics`
- Re-exported from [`relationshipRuleAudit`](./rules/relationshipRuleAudit.ts.mdmd.md#formatrelationshipdiagnostics)

#### `generateRelationshipEvidences`
- Re-exported from [`relationshipRuleEngine`](./rules/relationshipRuleEngine.ts.mdmd.md#generaterelationshipevidences)

#### `GenerateRelationshipEvidencesOptions`
- Re-exported from [`relationshipRuleEngine`](./rules/relationshipRuleEngine.ts.mdmd.md#generaterelationshipevidencesoptions)

#### `GraphStore`
- Re-exported from [`graphStore`](./db/graphStore.ts.mdmd.md#graphstore)

#### `GraphStoreOptions`
- Re-exported from [`graphStore`](./db/graphStore.ts.mdmd.md#graphstoreoptions)

#### `hasRuntimeUsage`
- Re-exported from [`typeScriptAstUtils`](./language/typeScriptAstUtils.ts.mdmd.md#hasruntimeusage)

#### `hasTypeUsage`
- Re-exported from [`typeScriptAstUtils`](./language/typeScriptAstUtils.ts.mdmd.md#hastypeusage)

#### `IdentifierUsage`
- Re-exported from [`typeScriptAstUtils`](./language/typeScriptAstUtils.ts.mdmd.md#identifierusage)

#### `InferenceAccuracySummary`
- Re-exported from [`inferenceAccuracy`](./telemetry/inferenceAccuracy.ts.mdmd.md#inferenceaccuracysummary)

#### `InferenceAccuracyTracker`
- Re-exported from [`inferenceAccuracy`](./telemetry/inferenceAccuracy.ts.mdmd.md#inferenceaccuracytracker)

#### `InferenceAccuracyTrackerOptions`
- Re-exported from [`inferenceAccuracy`](./telemetry/inferenceAccuracy.ts.mdmd.md#inferenceaccuracytrackeroptions)

#### `InferenceOutcome`
- Re-exported from [`inferenceAccuracy`](./telemetry/inferenceAccuracy.ts.mdmd.md#inferenceoutcome)

#### `InferenceTraceEntry`
- Re-exported from [`fallbackInference`](./inference/fallbackInference.ts.mdmd.md#inferencetraceentry)

#### `InferenceTraceOrigin`
- Re-exported from [`fallbackInference`](./inference/fallbackInference.ts.mdmd.md#inferencetraceorigin)

#### `inferFallbackGraph`
- Re-exported from [`fallbackInference`](./inference/fallbackInference.ts.mdmd.md#inferfallbackgraph)

#### `INSPECT_DEPENDENCIES_REQUEST`
- Re-exported from [`dependencies`](./contracts/dependencies.ts.mdmd.md#inspect_dependencies_request)

#### `INSPECT_SYMBOL_NEIGHBORS_REQUEST`
- Re-exported from [`symbols`](./contracts/symbols.ts.mdmd.md#inspect_symbol_neighbors_request)

#### `InspectDependenciesParams`
- Re-exported from [`dependencies`](./contracts/dependencies.ts.mdmd.md#inspectdependenciesparams)

#### `InspectDependenciesResult`
- Re-exported from [`dependencies`](./contracts/dependencies.ts.mdmd.md#inspectdependenciesresult)

#### `InspectDependenciesSummary`
- Re-exported from [`dependencies`](./contracts/dependencies.ts.mdmd.md#inspectdependenciessummary)

#### `InspectSymbolNeighborsParams`
- Re-exported from [`symbols`](./contracts/symbols.ts.mdmd.md#inspectsymbolneighborsparams)

#### `InspectSymbolNeighborsResult`
- Re-exported from [`symbols`](./contracts/symbols.ts.mdmd.md#inspectsymbolneighborsresult)

#### `InspectSymbolNeighborsSummary`
- Re-exported from [`symbols`](./contracts/symbols.ts.mdmd.md#inspectsymbolneighborssummary)

#### `INVOKE_LLM_REQUEST`
- Re-exported from [`llm`](./contracts/llm.ts.mdmd.md#invoke_llm_request)

#### `InvokeLlmRequest`
- Re-exported from [`llm`](./contracts/llm.ts.mdmd.md#invokellmrequest)

#### `InvokeLlmResult`
- Re-exported from [`llm`](./contracts/llm.ts.mdmd.md#invokellmresult)

#### `invokeOllamaChat`
- Re-exported from [`ollamaClient`](./tooling/ollamaClient.ts.mdmd.md#invokeollamachat)

#### `isLikelyTypeDefinitionSpecifier`
- Re-exported from [`typeScriptAstUtils`](./language/typeScriptAstUtils.ts.mdmd.md#islikelytypedefinitionspecifier)

#### `KnowledgeArtifact`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#knowledgeartifact)

#### `KnowledgeFeed`
- Re-exported from [`linkInference`](./inference/linkInference.ts.mdmd.md#knowledgefeed)

#### `KnowledgeFeedSnapshotSource`
- Re-exported from [`linkInference`](./inference/linkInference.ts.mdmd.md#knowledgefeedsnapshotsource)

#### `KnowledgeFeedStreamSource`
- Re-exported from [`linkInference`](./inference/linkInference.ts.mdmd.md#knowledgefeedstreamsource)

#### `KnowledgeFeedSummary`
- Re-exported from [`linkInference`](./inference/linkInference.ts.mdmd.md#knowledgefeedsummary)

#### `KnowledgeGraphBridge`
- Re-exported from [`knowledgeGraphBridge`](./knowledge/knowledgeGraphBridge.ts.mdmd.md#knowledgegraphbridge)

#### `KnowledgeSnapshot`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#knowledgesnapshot)

#### `LATENCY_SUMMARY_REQUEST`
- Re-exported from [`telemetry`](./contracts/telemetry.ts.mdmd.md#latency_summary_request)

#### `LatencyChangeKind`
- Re-exported from [`telemetry`](./contracts/telemetry.ts.mdmd.md#latencychangekind)

#### `LatencySample`
- Re-exported from [`telemetry`](./contracts/telemetry.ts.mdmd.md#latencysample)

#### `LatencySummary`
- Re-exported from [`telemetry`](./contracts/telemetry.ts.mdmd.md#latencysummary)

#### `LatencySummaryRequest`
- Re-exported from [`telemetry`](./contracts/telemetry.ts.mdmd.md#latencysummaryrequest)

#### `LatencySummaryResponse`
- Re-exported from [`telemetry`](./contracts/telemetry.ts.mdmd.md#latencysummaryresponse)

#### `LinkedArtifactSummary`
- Re-exported from [`graphStore`](./db/graphStore.ts.mdmd.md#linkedartifactsummary)

#### `LinkEvidence`
- Re-exported from [`linkInference`](./inference/linkInference.ts.mdmd.md#linkevidence)

#### `LinkInferenceError`
- Re-exported from [`linkInference`](./inference/linkInference.ts.mdmd.md#linkinferenceerror)

#### `LinkInferenceOrchestrator`
- Re-exported from [`linkInference`](./inference/linkInference.ts.mdmd.md#linkinferenceorchestrator)

#### `LinkInferenceRunInput`
- Re-exported from [`linkInference`](./inference/linkInference.ts.mdmd.md#linkinferenceruninput)

#### `LinkInferenceRunResult`
- Re-exported from [`linkInference`](./inference/linkInference.ts.mdmd.md#linkinferencerunresult)

#### `LinkInferenceTraceEntry`
- Re-exported from [`linkInference`](./inference/linkInference.ts.mdmd.md#linkinferencetraceentry)

#### `LinkInferenceTraceOrigin`
- Re-exported from [`linkInference`](./inference/linkInference.ts.mdmd.md#linkinferencetraceorigin)

#### `LinkOverrideReason`
- Re-exported from [`overrides`](./contracts/overrides.ts.mdmd.md#linkoverridereason)

#### `LinkRelationship`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#linkrelationship)

#### `LinkRelationshipKind`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#linkrelationshipkind)

#### `LIST_OUTSTANDING_DIAGNOSTICS_REQUEST`
- Re-exported from [`diagnostics`](./contracts/diagnostics.ts.mdmd.md#list_outstanding_diagnostics_request)

#### `ListDriftHistoryOptions`
- Re-exported from [`graphStore`](./db/graphStore.ts.mdmd.md#listdrifthistoryoptions)

#### `ListOutstandingDiagnosticsResult`
- Re-exported from [`diagnostics`](./contracts/diagnostics.ts.mdmd.md#listoutstandingdiagnosticsresult)

#### `LIVE_DOCUMENTATION_DEFAULT_BASE_LAYER`
- Re-exported from [`liveDocumentationConfig`](./config/liveDocumentationConfig.ts.mdmd.md#live_documentation_default_base_layer)

#### `LIVE_DOCUMENTATION_DEFAULT_GLOBS`
- Re-exported from [`liveDocumentationConfig`](./config/liveDocumentationConfig.ts.mdmd.md#live_documentation_default_globs)

#### `LIVE_DOCUMENTATION_DEFAULT_ROOT`
- Re-exported from [`liveDocumentationConfig`](./config/liveDocumentationConfig.ts.mdmd.md#live_documentation_default_root)

#### `LIVE_DOCUMENTATION_FILE_EXTENSION`
- Re-exported from [`liveDocumentationConfig`](./config/liveDocumentationConfig.ts.mdmd.md#live_documentation_file_extension)

#### `LiveDocumentationArchetype`
- Re-exported from [`liveDocumentationConfig`](./config/liveDocumentationConfig.ts.mdmd.md#livedocumentationarchetype)

#### `LiveDocumentationConfig`
- Re-exported from [`liveDocumentationConfig`](./config/liveDocumentationConfig.ts.mdmd.md#livedocumentationconfig)

#### `LiveDocumentationConfigInput`
- Re-exported from [`liveDocumentationConfig`](./config/liveDocumentationConfig.ts.mdmd.md#livedocumentationconfiginput)

#### `LiveDocumentationEvidenceConfig`
- Re-exported from [`liveDocumentationConfig`](./config/liveDocumentationConfig.ts.mdmd.md#livedocumentationevidenceconfig)

#### `LiveDocumentationEvidenceStrictMode`
- Re-exported from [`liveDocumentationConfig`](./config/liveDocumentationConfig.ts.mdmd.md#livedocumentationevidencestrictmode)

#### `LiveDocumentationSlugDialect`
- Re-exported from [`liveDocumentationConfig`](./config/liveDocumentationConfig.ts.mdmd.md#livedocumentationslugdialect)

#### `LlmAssessment`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#llmassessment)

#### `LlmEdgeProvenance`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#llmedgeprovenance)

#### `LlmModelMetadata`
- Re-exported from [`artifacts`](./domain/artifacts.ts.mdmd.md#llmmodelmetadata)

#### `LLMRelationshipRequest`
- Re-exported from [`fallbackInference`](./inference/fallbackInference.ts.mdmd.md#llmrelationshiprequest)

#### `LLMRelationshipSuggestion`
- Re-exported from [`fallbackInference`](./inference/fallbackInference.ts.mdmd.md#llmrelationshipsuggestion)

#### `loadRelationshipRuleConfig`
- Re-exported from [`relationshipRuleEngine`](./rules/relationshipRuleEngine.ts.mdmd.md#loadrelationshipruleconfig)

#### `loadSymbolCorrectnessProfiles`
- Re-exported from [`symbolCorrectnessProfiles`](./rules/symbolCorrectnessProfiles.ts.mdmd.md#loadsymbolcorrectnessprofiles)

#### `LSIFContainsEdge`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#lsifcontainsedge)

#### `LSIFDefinitionEdge`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#lsifdefinitionedge)

#### `LSIFDefinitionResult`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#lsifdefinitionresult)

#### `LSIFDocument`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#lsifdocument)

#### `LSIFEdge`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#lsifedge)

#### `LSIFEdgeLabel`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#lsifedgelabel)

#### `LSIFElement`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#lsifelement)

#### `LSIFEntry`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#lsifentry)

#### `LSIFItemEdge`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#lsifitemedge)

#### `LSIFMetaData`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#lsifmetadata)

#### `LSIFNextEdge`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#lsifnextedge)

#### `LSIFProject`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#lsifproject)

#### `LSIFRange`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#lsifrange)

#### `LSIFReferenceResult`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#lsifreferenceresult)

#### `LSIFReferencesEdge`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#lsifreferencesedge)

#### `LSIFResultSet`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#lsifresultset)

#### `LSIFVertex`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#lsifvertex)

#### `LSIFVertexLabel`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#lsifvertexlabel)

#### `MarkdownLinkAuditOptions`
- Re-exported from [`markdownLinks`](./tooling/markdownLinks.ts.mdmd.md#markdownlinkauditoptions)

#### `MarkdownLinkIssue`
- Re-exported from [`markdownLinks`](./tooling/markdownLinks.ts.mdmd.md#markdownlinkissue)

#### `MOCK_OLLAMA_MODEL_ID`
- Re-exported from [`ollamaMock`](./tooling/ollamaMock.ts.mdmd.md#mock_ollama_model_id)

#### `MockOllamaResponse`
- Re-exported from [`ollamaMock`](./tooling/ollamaMock.ts.mdmd.md#mockollamaresponse)

#### `normalizeFileUri`
- Re-exported from [`normalizeFileUri`](./uri/normalizeFileUri.ts.mdmd.md#normalizefileuri)

#### `normalizeLiveDocumentationConfig`
- Re-exported from [`liveDocumentationConfig`](./config/liveDocumentationConfig.ts.mdmd.md#normalizelivedocumentationconfig)

#### `normalizeWorkspacePath`
- Re-exported from [`pathUtils`](./tooling/pathUtils.ts.mdmd.md#normalizeworkspacepath)

#### `OllamaChatRequest`
- Re-exported from [`ollamaClient`](./tooling/ollamaClient.ts.mdmd.md#ollamachatrequest)

#### `OllamaChatResult`
- Re-exported from [`ollamaClient`](./tooling/ollamaClient.ts.mdmd.md#ollamachatresult)

#### `OllamaChatUsage`
- Re-exported from [`ollamaClient`](./tooling/ollamaClient.ts.mdmd.md#ollamachatusage)

#### `OllamaInvocationError`
- Re-exported from [`ollamaClient`](./tooling/ollamaClient.ts.mdmd.md#ollamainvocationerror)

#### `OutstandingDiagnosticSummary`
- Re-exported from [`diagnostics`](./contracts/diagnostics.ts.mdmd.md#outstandingdiagnosticsummary)

#### `OVERRIDE_LINK_REQUEST`
- Re-exported from [`overrides`](./contracts/overrides.ts.mdmd.md#override_link_request)

#### `OverrideLinkArtifactInput`
- Re-exported from [`overrides`](./contracts/overrides.ts.mdmd.md#overridelinkartifactinput)

#### `OverrideLinkRequest`
- Re-exported from [`overrides`](./contracts/overrides.ts.mdmd.md#overridelinkrequest)

#### `OverrideLinkResponse`
- Re-exported from [`overrides`](./contracts/overrides.ts.mdmd.md#overridelinkresponse)

#### `ParsedLSIFIndex`
- Re-exported from [`lsif`](./contracts/lsif.ts.mdmd.md#parsedlsifindex)

#### `ParsedSCIPIndex`
- Re-exported from [`scip`](./contracts/scip.ts.mdmd.md#parsedscipindex)

#### `RebindImpactedArtifact`
- Re-exported from [`maintenance`](./contracts/maintenance.ts.mdmd.md#rebindimpactedartifact)

#### `RebindReason`
- Re-exported from [`maintenance`](./contracts/maintenance.ts.mdmd.md#rebindreason)

#### `RebindRequiredArtifact`
- Re-exported from [`maintenance`](./contracts/maintenance.ts.mdmd.md#rebindrequiredartifact)

#### `RebindRequiredPayload`
- Re-exported from [`maintenance`](./contracts/maintenance.ts.mdmd.md#rebindrequiredpayload)

#### `RebuildStabilityData`
- Re-exported from [`testReport`](./reporting/testReport.ts.mdmd.md#rebuildstabilitydata)

#### `RecordOutcomeOptions`
- Re-exported from [`inferenceAccuracy`](./telemetry/inferenceAccuracy.ts.mdmd.md#recordoutcomeoptions)

#### `RelationshipCoverageChain`
- Re-exported from [`relationshipRuleAudit`](./rules/relationshipRuleAudit.ts.mdmd.md#relationshipcoveragechain)

#### `RelationshipCoverageDiagnostic`
- Re-exported from [`relationshipRuleAudit`](./rules/relationshipRuleAudit.ts.mdmd.md#relationshipcoveragediagnostic)

#### `RelationshipCoverageIssue`
- Re-exported from [`relationshipRuleAudit`](./rules/relationshipRuleAudit.ts.mdmd.md#relationshipcoverageissue)

#### `RelationshipCoverageIssueKind`
- Re-exported from [`relationshipRuleAudit`](./rules/relationshipRuleAudit.ts.mdmd.md#relationshipcoverageissuekind)

#### `RelationshipCoverageResult`
- Re-exported from [`relationshipRuleAudit`](./rules/relationshipRuleAudit.ts.mdmd.md#relationshipcoverageresult)

#### `RelationshipCoverageRuleResult`
- Re-exported from [`relationshipRuleAudit`](./rules/relationshipRuleAudit.ts.mdmd.md#relationshipcoverageruleresult)

#### `RelationshipEvidenceGenerationResult`
- Re-exported from [`relationshipRuleEngine`](./rules/relationshipRuleEngine.ts.mdmd.md#relationshipevidencegenerationresult)

#### `RelationshipHint`
- Re-exported from [`fallbackInference`](./inference/fallbackInference.ts.mdmd.md#relationshiphint)

#### `RelationshipResolver`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#relationshipresolver)

#### `RelationshipResolverOptions`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#relationshipresolveroptions)

#### `RelationshipResolverResult`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#relationshipresolverresult)

#### `RelationshipRuleChain`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#relationshiprulechain)

#### `RelationshipRuleChainStep`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#relationshiprulechainstep)

#### `RelationshipRuleConfig`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#relationshipruleconfig)

#### `RelationshipRuleConfigLoadResult`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#relationshipruleconfigloadresult)

#### `RelationshipRulePropagationConfig`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#relationshiprulepropagationconfig)

#### `RelationshipRuleProviderLogger`
- Re-exported from [`relationshipRuleProvider`](./rules/relationshipRuleProvider.ts.mdmd.md#relationshipruleproviderlogger)

#### `RelationshipRuleProviderOptions`
- Re-exported from [`relationshipRuleProvider`](./rules/relationshipRuleProvider.ts.mdmd.md#relationshipruleprovideroptions)

#### `RelationshipRulesConfig`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#relationshiprulesconfig)

#### `RelationshipRuleStepConfig`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#relationshiprulestepconfig)

#### `RelationshipRuleWarning`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#relationshiprulewarning)

#### `ReportSection`
- Re-exported from [`testReport`](./reporting/testReport.ts.mdmd.md#reportsection)

#### `RESET_DIAGNOSTIC_STATE_NOTIFICATION`
- Re-exported from [`diagnostics`](./contracts/diagnostics.ts.mdmd.md#reset_diagnostic_state_notification)

#### `resolveOllamaEndpoint`
- Re-exported from [`ollamaEndpoint`](./tooling/ollamaEndpoint.ts.mdmd.md#resolveollamaendpoint)

#### `ResolveOllamaEndpointOptions`
- Re-exported from [`ollamaEndpoint`](./tooling/ollamaEndpoint.ts.mdmd.md#resolveollamaendpointoptions)

#### `SCIPDiagnostic`
- Re-exported from [`scip`](./contracts/scip.ts.mdmd.md#scipdiagnostic)

#### `SCIPDocument`
- Re-exported from [`scip`](./contracts/scip.ts.mdmd.md#scipdocument)

#### `SCIPIndex`
- Re-exported from [`scip`](./contracts/scip.ts.mdmd.md#scipindex)

#### `SCIPMetadata`
- Re-exported from [`scip`](./contracts/scip.ts.mdmd.md#scipmetadata)

#### `SCIPOccurrence`
- Re-exported from [`scip`](./contracts/scip.ts.mdmd.md#scipoccurrence)

#### `SCIPRelationship`
- Re-exported from [`scip`](./contracts/scip.ts.mdmd.md#sciprelationship)

#### `SCIPSignature`
- Re-exported from [`scip`](./contracts/scip.ts.mdmd.md#scipsignature)

#### `SCIPSymbolInformation`
- Re-exported from [`scip`](./contracts/scip.ts.mdmd.md#scipsymbolinformation)

#### `SCIPSymbolKind`
- Re-exported from [`scip`](./contracts/scip.ts.mdmd.md#scipsymbolkind)

#### `SCIPSymbolRole`
- Re-exported from [`scip`](./contracts/scip.ts.mdmd.md#scipsymbolrole)

#### `SCIPToolInfo`
- Re-exported from [`scip`](./contracts/scip.ts.mdmd.md#sciptoolinfo)

#### `SET_DIAGNOSTIC_ASSESSMENT_REQUEST`
- Re-exported from [`diagnostics`](./contracts/diagnostics.ts.mdmd.md#set_diagnostic_assessment_request)

#### `SetDiagnosticAssessmentParams`
- Re-exported from [`diagnostics`](./contracts/diagnostics.ts.mdmd.md#setdiagnosticassessmentparams)

#### `SetDiagnosticAssessmentResult`
- Re-exported from [`diagnostics`](./contracts/diagnostics.ts.mdmd.md#setdiagnosticassessmentresult)

#### `StreamCheckpoint`
- Re-exported from [`knowledgeGraphBridge`](./knowledge/knowledgeGraphBridge.ts.mdmd.md#streamcheckpoint)

#### `StreamEventKind`
- Re-exported from [`knowledgeGraphBridge`](./knowledge/knowledgeGraphBridge.ts.mdmd.md#streameventkind)

#### `SymbolAuditOptions`
- Re-exported from [`symbolReferences`](./tooling/symbolReferences.ts.mdmd.md#symbolauditoptions)

#### `SymbolCorrectnessProfileConfig`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#symbolcorrectnessprofileconfig)

#### `SymbolIssueKind`
- Re-exported from [`symbolReferences`](./tooling/symbolReferences.ts.mdmd.md#symbolissuekind)

#### `SymbolIssueSeverity`
- Re-exported from [`symbolReferences`](./tooling/symbolReferences.ts.mdmd.md#symbolissueseverity)

#### `SymbolNeighborGroup`
- Re-exported from [`symbols`](./contracts/symbols.ts.mdmd.md#symbolneighborgroup)

#### `SymbolNeighborNode`
- Re-exported from [`symbols`](./contracts/symbols.ts.mdmd.md#symbolneighbornode)

#### `SymbolNeighborPath`
- Re-exported from [`symbols`](./contracts/symbols.ts.mdmd.md#symbolneighborpath)

#### `SymbolProfileLoadResult`
- Re-exported from [`symbolCorrectnessProfiles`](./rules/symbolCorrectnessProfiles.ts.mdmd.md#symbolprofileloadresult)

#### `SymbolProfileLookup`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#symbolprofilelookup)

#### `SymbolProfileRequirementConfig`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#symbolprofilerequirementconfig)

#### `SymbolProfileRequirementDirection`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#symbolprofilerequirementdirection)

#### `SymbolProfileSourceConfig`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#symbolprofilesourceconfig)

#### `SymbolProfileTargetConfig`
- Re-exported from [`relationshipRuleTypes`](./rules/relationshipRuleTypes.ts.mdmd.md#symbolprofiletargetconfig)

#### `SymbolReferenceIssue`
- Re-exported from [`symbolReferences`](./tooling/symbolReferences.ts.mdmd.md#symbolreferenceissue)

#### `SymbolRuleSetting`
- Re-exported from [`symbolReferences`](./tooling/symbolReferences.ts.mdmd.md#symbolrulesetting)

#### `TestReportContext`
- Re-exported from [`testReport`](./reporting/testReport.ts.mdmd.md#testreportcontext)

#### `toWorkspaceFileUri`
- Re-exported from [`pathUtils`](./tooling/pathUtils.ts.mdmd.md#toworkspacefileuri)

#### `toWorkspaceRelativePath`
- Re-exported from [`pathUtils`](./tooling/pathUtils.ts.mdmd.md#toworkspacerelativepath)

#### `WorkspaceConfigurationLike`
- Re-exported from [`ollamaEndpoint`](./tooling/ollamaEndpoint.ts.mdmd.md#workspaceconfigurationlike)

#### `WorkspaceLinkContribution`
- Re-exported from [`linkInference`](./inference/linkInference.ts.mdmd.md#workspacelinkcontribution)

#### `WorkspaceLinkProvider`
- Re-exported from [`linkInference`](./inference/linkInference.ts.mdmd.md#workspacelinkprovider)

#### `WorkspaceLinkProviderContext`
- Re-exported from [`linkInference`](./inference/linkInference.ts.mdmd.md#workspacelinkprovidercontext)

#### `WorkspaceProviderSummary`
- Re-exported from [`linkInference`](./inference/linkInference.ts.mdmd.md#workspaceprovidersummary)
<!-- LIVE-DOC:END Re-Exported Symbol Anchors -->
