# packages/shared/src/domain/artifacts.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/domain/artifacts.ts
- Live Doc ID: LD-implementation-packages-shared-src-domain-artifacts-ts
- Generated At: 2025-11-16T02:09:51.787Z

## Authored
### Purpose
Centralises the shared domain types that describe knowledge artifacts, graph relationships, diagnostics, change events, and LLM provenance so both the extension and server speak the same schema.

### Notes
- Enumerates canonical artifact layers and link kinds to keep persistence, rule evaluation, and UI rendering in sync.
- Wraps diagnostic-related structures—records, acknowledgements, drift history, and LLM assessments—so telemetry, export flows, and GraphStore storage can reuse the same interfaces.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.787Z","inputHash":"0716ab01f7ce6f70"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ArtifactLayer`
- Type: type
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L1)

#### `KnowledgeArtifact`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L8)

#### `LinkRelationshipKind`
- Type: type
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L19)

#### `LinkRelationship`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L26)

#### `LlmConfidenceTier`
- Type: type
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L36)

#### `LlmEdgeProvenance`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L38)

#### `ChangeEventType`
- Type: type
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L56)

#### `ChangeEventProvenance`
- Type: type
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L58)

#### `ChangeEventRange`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L60)

#### `ChangeEvent`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L65)

#### `DiagnosticSeverity`
- Type: type
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L75)

#### `DiagnosticStatus`
- Type: type
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L77)

#### `LlmModelMetadata`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L79)

#### `LlmAssessment`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L87)

#### `DiagnosticRecord`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L98)

#### `KnowledgeSnapshot`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L113)

#### `AcknowledgementActionType`
- Type: type
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L123)

#### `AcknowledgementAction`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L125)

#### `DriftHistoryStatus`
- Type: type
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L134)

#### `DriftHistoryEntry`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/domain/artifacts.ts#L136)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_No dependencies documented yet_
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
- [graphStore.test.ts](../db/graphStore.test.ts.md)
- [fallbackInference.languages.test.ts](../inference/fallbackInference.languages.test.ts.md)
- [fallbackInference.test.ts](../inference/fallbackInference.test.ts.md)
- [linkInference.test.ts](../inference/linkInference.test.ts.md)
- [confidenceCalibrator.test.ts](../inference/llm/confidenceCalibrator.test.ts.md)
- [relationshipExtractor.test.ts](../inference/llm/relationshipExtractor.test.ts.md)
- [relationshipRuleProvider.test.ts](../rules/relationshipRuleProvider.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
