# packages/shared/src/inference/llm/relationshipExtractor.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/inference/llm/relationshipExtractor.ts
- Live Doc ID: LD-implementation-packages-shared-src-inference-llm-relationshipextractor-ts
- Generated At: 2025-11-16T02:09:51.924Z

## Authored
### Purpose
Wrap an LLM invocation that extracts cross-artifact relationships, enforcing the prompt tagging contract and validating the structured response before it flows into link inference.

### Notes
Supplies telemetry tags identifying the prompt template/version/hash and preserves provider usage metadata on the returned batch. Responses must decode to JSON containing a `relationships` array; otherwise the extractor logs a warning and throws a typed `RelationshipExtractorError` that carries the offending payload. The local validator normalizes confidence values, strips invalid chunk references, and records raw rationale data so later calibrators can enrich or filter the relationships.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.924Z","inputHash":"8e56a46b94a5ef47"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ConfidenceTier`
- Type: type
- Source: [source](../../../../../../../packages/shared/src/inference/llm/relationshipExtractor.ts#L3)

#### `RelationshipExtractionPrompt`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/inference/llm/relationshipExtractor.ts#L5)

#### `ModelInvocationRequest`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/inference/llm/relationshipExtractor.ts#L13)

#### `ModelUsage`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/inference/llm/relationshipExtractor.ts#L19)

#### `ModelInvocationResult`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/inference/llm/relationshipExtractor.ts#L25)

#### `ModelInvoker`
- Type: type
- Source: [source](../../../../../../../packages/shared/src/inference/llm/relationshipExtractor.ts#L31)

#### `RelationshipExtractionRequest`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/inference/llm/relationshipExtractor.ts#L33)

#### `RawRelationshipCandidate`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/inference/llm/relationshipExtractor.ts#L39)

#### `RelationshipExtractionBatch`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/inference/llm/relationshipExtractor.ts#L49)

#### `RelationshipExtractorOptions`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/inference/llm/relationshipExtractor.ts#L59)

#### `RelationshipExtractorLogger`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/inference/llm/relationshipExtractor.ts#L64)

#### `RelationshipExtractorError`
- Type: class
- Source: [source](../../../../../../../packages/shared/src/inference/llm/relationshipExtractor.ts#L69)

#### `RelationshipExtractor`
- Type: class
- Source: [source](../../../../../../../packages/shared/src/inference/llm/relationshipExtractor.ts#L75)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`artifacts.LinkRelationshipKind`](../../domain/artifacts.ts.md#linkrelationshipkind) (type-only)
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
- [relationshipExtractor.test.ts](./relationshipExtractor.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
