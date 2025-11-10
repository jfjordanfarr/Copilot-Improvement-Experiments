# packages/shared/src/inference/fallbackInference.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/inference/fallbackInference.ts
- Live Doc ID: LD-implementation-packages-shared-src-inference-fallbackinference-ts
- Generated At: 2025-11-09T22:52:11.885Z

## Authored
### Purpose
Builds a knowledge-graph proposal from seed artifacts using deterministic heuristics, user hints, and optional LLM suggestions whenever richer feeds are unavailable.

### Notes
- Normalizes duplicate seeds by URI, synthesizing IDs and merging metadata so repeated inputs still yield a single artifact record with latest context.
- Runs path- and content-aware heuristics first, records trace entries for every inferred edge, and then optionally calls an `FallbackLLMBridge` when documents exceed the configured content threshold.
- Returns both the inferred edges and the trace log so callers can surface provenance (heuristic vs. hint vs. LLM) alongside suggestions in the UI.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:11.885Z","inputHash":"34f3099b95e3c28f"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ArtifactSeed`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/fallbackInference.ts#L14)

#### `RelationshipHint`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/fallbackInference.ts#L26)

#### `LLMRelationshipSuggestion`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/fallbackInference.ts#L36)

#### `LLMRelationshipRequest`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/fallbackInference.ts#L44)

#### `FallbackLLMBridge`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/fallbackInference.ts#L51)

#### `FallbackGraphInput`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/fallbackInference.ts#L56)

#### `FallbackGraphOptions`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/fallbackInference.ts#L62)

#### `InferenceTraceOrigin`
- Type: type
- Source: [source](../../../../../../packages/shared/src/inference/fallbackInference.ts#L68)

#### `InferenceTraceEntry`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/fallbackInference.ts#L70)

#### `FallbackInferenceResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/fallbackInference.ts#L82)

#### `inferFallbackGraph`
- Type: function
- Source: [source](../../../../../../packages/shared/src/inference/fallbackInference.ts#L97)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- [`artifacts.ArtifactLayer`](../domain/artifacts.ts.mdmd.md#artifactlayer) (type-only)
- [`artifacts.KnowledgeArtifact`](../domain/artifacts.ts.mdmd.md#knowledgeartifact) (type-only)
- [`artifacts.LinkRelationship`](../domain/artifacts.ts.mdmd.md#linkrelationship) (type-only)
- [`artifacts.LinkRelationshipKind`](../domain/artifacts.ts.mdmd.md#linkrelationshipkind) (type-only)
- [`fallbackHeuristicTypes.HeuristicArtifact`](./fallbackHeuristicTypes.ts.mdmd.md#heuristicartifact) (type-only)
- [`fallbackHeuristicTypes.MatchCandidate`](./fallbackHeuristicTypes.ts.mdmd.md#matchcandidate) (type-only)
- [`fallbackHeuristicTypes.MatchContext`](./fallbackHeuristicTypes.ts.mdmd.md#matchcontext) (type-only)
- [`artifactLayerUtils.isDocumentLayer`](./heuristics/artifactLayerUtils.ts.mdmd.md#isdocumentlayer)
- [`artifactLayerUtils.isImplementationLayer`](./heuristics/artifactLayerUtils.ts.mdmd.md#isimplementationlayer)
- [`index.createDefaultHeuristics`](./heuristics/index.ts.mdmd.md#createdefaultheuristics)
- [`shared.stem`](./heuristics/shared.ts.mdmd.md#stem)
- [`shared.toComparablePath`](./heuristics/shared.ts.mdmd.md#tocomparablepath)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [analyzeWithAI.test.ts](../../../extension/src/commands/analyzeWithAI.test.ts.mdmd.md)
- [exportDiagnostics.test.ts](../../../extension/src/commands/exportDiagnostics.test.ts.mdmd.md)
- [inspectSymbolNeighbors.test.ts](../../../extension/src/commands/inspectSymbolNeighbors.test.ts.mdmd.md)
- [dependencyQuickPick.test.ts](../../../extension/src/diagnostics/dependencyQuickPick.test.ts.mdmd.md)
- [docDiagnosticProvider.test.ts](../../../extension/src/diagnostics/docDiagnosticProvider.test.ts.mdmd.md)
- [localOllamaBridge.test.ts](../../../extension/src/services/localOllamaBridge.test.ts.mdmd.md)
- [symbolBridge.test.ts](../../../extension/src/services/symbolBridge.test.ts.mdmd.md)
- [saveCodeChange.test.ts](../../../server/src/features/changeEvents/saveCodeChange.test.ts.mdmd.md)
- [saveDocumentChange.test.ts](../../../server/src/features/changeEvents/saveDocumentChange.test.ts.mdmd.md)
- [inspectDependencies.test.ts](../../../server/src/features/dependencies/inspectDependencies.test.ts.mdmd.md)
- [symbolNeighbors.test.ts](../../../server/src/features/dependencies/symbolNeighbors.test.ts.mdmd.md)
- [acknowledgementService.test.ts](../../../server/src/features/diagnostics/acknowledgementService.test.ts.mdmd.md)
- [listOutstandingDiagnostics.test.ts](../../../server/src/features/diagnostics/listOutstandingDiagnostics.test.ts.mdmd.md)
- [noiseFilter.test.ts](../../../server/src/features/diagnostics/noiseFilter.test.ts.mdmd.md)
- [publishDocDiagnostics.test.ts](../../../server/src/features/diagnostics/publishDocDiagnostics.test.ts.mdmd.md)
- [feedFormatDetector.test.ts](../../../server/src/features/knowledge/feedFormatDetector.test.ts.mdmd.md)
- [knowledgeFeedManager.test.ts](../../../server/src/features/knowledge/knowledgeFeedManager.test.ts.mdmd.md)
- [knowledgeGraphBridge.test.ts](../../../server/src/features/knowledge/knowledgeGraphBridge.test.ts.mdmd.md)
- [knowledgeGraphIngestor.test.ts](../../../server/src/features/knowledge/knowledgeGraphIngestor.test.ts.mdmd.md)
- [llmIngestionOrchestrator.test.ts](../../../server/src/features/knowledge/llmIngestionOrchestrator.test.ts.mdmd.md)
- [lsifParser.test.ts](../../../server/src/features/knowledge/lsifParser.test.ts.mdmd.md)
- [rippleAnalyzer.test.ts](../../../server/src/features/knowledge/rippleAnalyzer.test.ts.mdmd.md)
- [scipParser.test.ts](../../../server/src/features/knowledge/scipParser.test.ts.mdmd.md)
- [workspaceIndexProvider.test.ts](../../../server/src/features/knowledge/workspaceIndexProvider.test.ts.mdmd.md)
- [artifactWatcher.test.ts](../../../server/src/features/watchers/artifactWatcher.test.ts.mdmd.md)
- [pathReferenceDetector.test.ts](../../../server/src/features/watchers/pathReferenceDetector.test.ts.mdmd.md)
- [environment.test.ts](../../../server/src/runtime/environment.test.ts.mdmd.md)
- [settings.test.ts](../../../server/src/runtime/settings.test.ts.mdmd.md)
- [latencyTracker.test.ts](../../../server/src/telemetry/latencyTracker.test.ts.mdmd.md)
- [fallbackInference.languages.test.ts](./fallbackInference.languages.test.ts.mdmd.md)
- [fallbackInference.test.ts](./fallbackInference.test.ts.mdmd.md)
- [linkInference.test.ts](./linkInference.test.ts.mdmd.md)
- [relationshipRuleProvider.test.ts](../rules/relationshipRuleProvider.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
