# packages/shared/src/inference/fallbackInference.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/inference/fallbackInference.ts
- Live Doc ID: LD-implementation-packages-shared-src-inference-fallbackinference-ts
- Generated At: 2025-11-16T02:09:51.817Z

## Authored
### Purpose
Builds a knowledge-graph proposal from seed artifacts using deterministic heuristics, user hints, and optional LLM suggestions whenever richer feeds are unavailable.

### Notes
- Normalizes duplicate seeds by URI, synthesizing IDs and merging metadata so repeated inputs still yield a single artifact record with latest context.
- Runs path- and content-aware heuristics first, records trace entries for every inferred edge, and then optionally calls an `FallbackLLMBridge` when documents exceed the configured content threshold.
- Returns both the inferred edges and the trace log so callers can surface provenance (heuristic vs. hint vs. LLM) alongside suggestions in the UI.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.817Z","inputHash":"373c19057ae0e5f1"}]} -->
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
- [`artifacts.ArtifactLayer`](../domain/artifacts.ts.md#artifactlayer) (type-only)
- [`artifacts.KnowledgeArtifact`](../domain/artifacts.ts.md#knowledgeartifact) (type-only)
- [`artifacts.LinkRelationship`](../domain/artifacts.ts.md#linkrelationship) (type-only)
- [`artifacts.LinkRelationshipKind`](../domain/artifacts.ts.md#linkrelationshipkind) (type-only)
- [`fallbackHeuristicTypes.HeuristicArtifact`](./fallbackHeuristicTypes.ts.md#heuristicartifact) (type-only)
- [`fallbackHeuristicTypes.MatchCandidate`](./fallbackHeuristicTypes.ts.md#matchcandidate) (type-only)
- [`fallbackHeuristicTypes.MatchContext`](./fallbackHeuristicTypes.ts.md#matchcontext) (type-only)
- [`artifactLayerUtils.isDocumentLayer`](./heuristics/artifactLayerUtils.ts.md#isdocumentlayer)
- [`artifactLayerUtils.isImplementationLayer`](./heuristics/artifactLayerUtils.ts.md#isimplementationlayer)
- [`index.createDefaultHeuristics`](./heuristics/index.ts.md#createdefaultheuristics)
- [`shared.stem`](./heuristics/shared.ts.md#stem)
- [`shared.toComparablePath`](./heuristics/shared.ts.md#tocomparablepath)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [analyzeWithAI.test.ts](../../../extension/src/commands/analyzeWithAI.test.ts.md)
- [exportDiagnostics.test.ts](../../../extension/src/commands/exportDiagnostics.test.ts.md)
- [inspectSymbolNeighbors.test.ts](../../../extension/src/commands/inspectSymbolNeighbors.test.ts.md)
- [dependencyQuickPick.test.ts](../../../extension/src/diagnostics/dependencyQuickPick.test.ts.md)
- [docDiagnosticProvider.test.ts](../../../extension/src/diagnostics/docDiagnosticProvider.test.ts.md)
- [localOllamaBridge.test.ts](../../../extension/src/services/localOllamaBridge.test.ts.md)
- [symbolBridge.test.ts](../../../extension/src/services/symbolBridge.test.ts.md)
- [saveCodeChange.test.ts](../../../server/src/features/changeEvents/saveCodeChange.test.ts.md)
- [saveDocumentChange.test.ts](../../../server/src/features/changeEvents/saveDocumentChange.test.ts.md)
- [inspectDependencies.test.ts](../../../server/src/features/dependencies/inspectDependencies.test.ts.md)
- [symbolNeighbors.test.ts](../../../server/src/features/dependencies/symbolNeighbors.test.ts.md)
- [acknowledgementService.test.ts](../../../server/src/features/diagnostics/acknowledgementService.test.ts.md)
- [listOutstandingDiagnostics.test.ts](../../../server/src/features/diagnostics/listOutstandingDiagnostics.test.ts.md)
- [noiseFilter.test.ts](../../../server/src/features/diagnostics/noiseFilter.test.ts.md)
- [publishDocDiagnostics.test.ts](../../../server/src/features/diagnostics/publishDocDiagnostics.test.ts.md)
- [feedFormatDetector.test.ts](../../../server/src/features/knowledge/feedFormatDetector.test.ts.md)
- [knowledgeFeedManager.test.ts](../../../server/src/features/knowledge/knowledgeFeedManager.test.ts.md)
- [knowledgeGraphBridge.test.ts](../../../server/src/features/knowledge/knowledgeGraphBridge.test.ts.md)
- [knowledgeGraphIngestor.test.ts](../../../server/src/features/knowledge/knowledgeGraphIngestor.test.ts.md)
- [llmIngestionOrchestrator.test.ts](../../../server/src/features/knowledge/llmIngestionOrchestrator.test.ts.md)
- [lsifParser.test.ts](../../../server/src/features/knowledge/lsifParser.test.ts.md)
- [rippleAnalyzer.test.ts](../../../server/src/features/knowledge/rippleAnalyzer.test.ts.md)
- [scipParser.test.ts](../../../server/src/features/knowledge/scipParser.test.ts.md)
- [workspaceIndexProvider.test.ts](../../../server/src/features/knowledge/workspaceIndexProvider.test.ts.md)
- [artifactWatcher.test.ts](../../../server/src/features/watchers/artifactWatcher.test.ts.md)
- [pathReferenceDetector.test.ts](../../../server/src/features/watchers/pathReferenceDetector.test.ts.md)
- [environment.test.ts](../../../server/src/runtime/environment.test.ts.md)
- [settings.test.ts](../../../server/src/runtime/settings.test.ts.md)
- [latencyTracker.test.ts](../../../server/src/telemetry/latencyTracker.test.ts.md)
- [fallbackInference.languages.test.ts](./fallbackInference.languages.test.ts.md)
- [fallbackInference.test.ts](./fallbackInference.test.ts.md)
- [linkInference.test.ts](./linkInference.test.ts.md)
- [relationshipRuleProvider.test.ts](../rules/relationshipRuleProvider.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
