# packages/shared/src/inference/heuristics/index.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/inference/heuristics/index.ts
- Live Doc ID: LD-implementation-packages-shared-src-inference-heuristics-index-ts
- Generated At: 2025-11-16T02:09:51.854Z

## Authored
### Purpose
Aggregates the suite of fallback heuristics, returning them in execution order so the inference pipeline can apply language- and directive-specific matchers consistently.

### Notes
- Orders heuristics from explicit author intent (`@link`, markdown) through increasingly language-specific detectors, reducing the chance that noisy signals override curated ones.
- Acts as the single place to plug additional heuristics, keeping the fallback graph builder agnostic of concrete implementations.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.854Z","inputHash":"1ef951ee5adb2da1"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `createDefaultHeuristics`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/inference/heuristics/index.ts#L13)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`fallbackHeuristicTypes.FallbackHeuristic`](../fallbackHeuristicTypes.ts.md#fallbackheuristic) (type-only)
- [`cFunctions.createCFunctionHeuristic`](./cFunctions.ts.md#createcfunctionheuristic)
- [`csharp.createCSharpHeuristic`](./csharp.ts.md#createcsharpheuristic)
- [`directives.createDirectiveHeuristic`](./directives.ts.md#createdirectiveheuristic)
- [`imports.createImportHeuristic`](./imports.ts.md#createimportheuristic)
- [`includes.createIncludeHeuristic`](./includes.ts.md#createincludeheuristic)
- [`java.createJavaHeuristic`](./java.ts.md#createjavaheuristic)
- [`markdown.createMarkdownHeuristic`](./markdown.ts.md#createmarkdownheuristic)
- [`ruby.createRubyHeuristic`](./ruby.ts.md#createrubyheuristic)
- [`rust.createRustHeuristic`](./rust.ts.md#createrustheuristic)
- [`webforms.createWebFormsHeuristic`](./webforms.ts.md#createwebformsheuristic)
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
- [fallbackInference.languages.test.ts](../fallbackInference.languages.test.ts.md)
- [fallbackInference.test.ts](../fallbackInference.test.ts.md)
- [linkInference.test.ts](../linkInference.test.ts.md)
- [relationshipRuleProvider.test.ts](../../rules/relationshipRuleProvider.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
