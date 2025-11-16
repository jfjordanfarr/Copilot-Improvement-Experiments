# packages/shared/src/inference/linkInference.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/inference/linkInference.ts
- Live Doc ID: LD-implementation-packages-shared-src-inference-linkinference-ts
- Generated At: 2025-11-16T02:09:51.903Z

## Authored
### Purpose
Coordinates workspace providers, knowledge feeds, and fallback heuristics to build a consolidated link graph, returning deduplicated artifacts, relationships, and provenance traces.

### Notes
- `LinkAccumulator` normalizes artifacts by URI, merges metadata, and promotes the strongest confidence for each link while preserving trace entries describing the origin (workspace, feed, heuristic, or LLM).
- Workspace providers contribute seeds, hints, and evidences; the orchestrator summarizes their output alongside knowledge-feed snapshots/streams, surfacing partial failures through structured `LinkInferenceError`s.
- Falls back to `inferFallbackGraph` when providers leave gaps, threading optional LLM bridges and content loaders to enrich suggestions without duplicating trace logic.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.903Z","inputHash":"8745e7dc2c77c715"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LinkInferenceTraceOrigin`
- Type: type
- Source: [source](../../../../../../packages/shared/src/inference/linkInference.ts#L26)

#### `LinkInferenceTraceEntry`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/linkInference.ts#L28)

#### `LinkEvidence`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/linkInference.ts#L38)

#### `WorkspaceLinkContribution`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/linkInference.ts#L47)

#### `WorkspaceLinkProviderContext`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/linkInference.ts#L53)

#### `WorkspaceLinkProvider`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/linkInference.ts#L57)

#### `WorkspaceProviderSummary`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/linkInference.ts#L63)

#### `KnowledgeFeedSnapshotSource`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/linkInference.ts#L71)

#### `KnowledgeFeedStreamSource`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/linkInference.ts#L76)

#### `KnowledgeFeed`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/linkInference.ts#L81)

#### `KnowledgeFeedSummary`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/linkInference.ts#L87)

#### `LinkInferenceRunInput`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/linkInference.ts#L95)

#### `LinkInferenceError`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/linkInference.ts#L106)

#### `LinkInferenceRunResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/inference/linkInference.ts#L112)

#### `LinkInferenceOrchestrator`
- Type: class
- Source: [source](../../../../../../packages/shared/src/inference/linkInference.ts#L386)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`artifacts.KnowledgeArtifact`](../domain/artifacts.ts.md#knowledgeartifact)
- [`artifacts.LinkRelationship`](../domain/artifacts.ts.md#linkrelationship)
- [`artifacts.LinkRelationshipKind`](../domain/artifacts.ts.md#linkrelationshipkind)
- [`fallbackInference.ArtifactSeed`](./fallbackInference.ts.md#artifactseed)
- [`fallbackInference.FallbackLLMBridge`](./fallbackInference.ts.md#fallbackllmbridge)
- [`fallbackInference.InferenceTraceEntry`](./fallbackInference.ts.md#inferencetraceentry)
- [`fallbackInference.RelationshipHint`](./fallbackInference.ts.md#relationshiphint)
- [`fallbackInference.inferFallbackGraph`](./fallbackInference.ts.md#inferfallbackgraph)
- [`knowledgeGraphBridge.ExternalArtifact`](../knowledge/knowledgeGraphBridge.ts.md#externalartifact) (type-only)
- [`knowledgeGraphBridge.ExternalLink`](../knowledge/knowledgeGraphBridge.ts.md#externallink) (type-only)
- [`knowledgeGraphBridge.ExternalSnapshot`](../knowledge/knowledgeGraphBridge.ts.md#externalsnapshot) (type-only)
- [`knowledgeGraphBridge.ExternalStreamEvent`](../knowledge/knowledgeGraphBridge.ts.md#externalstreamevent) (type-only)
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
- [linkInference.test.ts](./linkInference.test.ts.md)
- [relationshipRuleProvider.test.ts](../rules/relationshipRuleProvider.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
