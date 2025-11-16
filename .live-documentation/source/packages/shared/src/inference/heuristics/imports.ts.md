# packages/shared/src/inference/heuristics/imports.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/inference/heuristics/imports.ts
- Live Doc ID: LD-implementation-packages-shared-src-inference-heuristics-imports-ts
- Generated At: 2025-11-16T02:09:51.843Z

## Authored
### Purpose
Extracts module import relationships across TypeScript/JavaScript and Python sources, resolving path references into artifacts while filtering out type-only or comment-only matches.

### Notes
- Uses AST analysis for TypeScript to detect whether an import has runtime usage; type-only bindings are ignored so we avoid noisy edges in the knowledge graph.
- Normalizes raw specifiers with shared reference utilities, applies the same resolver as markdown links, and includes support for relative Python `from`/`import` statements with dot-prefix semantics.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.843Z","inputHash":"5af07e8e35e2818c"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `createImportHeuristic`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/inference/heuristics/imports.ts#L23)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- [`fallbackHeuristicTypes.FallbackHeuristic`](../fallbackHeuristicTypes.ts.md#fallbackheuristic) (type-only)
- [`fallbackHeuristicTypes.HeuristicArtifact`](../fallbackHeuristicTypes.ts.md#heuristicartifact) (type-only)
- [`fallbackHeuristicTypes.MatchEmitter`](../fallbackHeuristicTypes.ts.md#matchemitter) (type-only)
- [`artifactLayerUtils.isImplementationLayer`](./artifactLayerUtils.ts.md#isimplementationlayer)
- [`referenceResolver.resolveReference`](./referenceResolver.ts.md#resolvereference)
- [`shared.cleanupReference`](./shared.ts.md#cleanupreference)
- [`shared.computeReferenceStart`](./shared.ts.md#computereferencestart)
- [`shared.isWithinComment`](./shared.ts.md#iswithincomment)
- [`typeScriptAstUtils.collectIdentifierUsage`](../../language/typeScriptAstUtils.ts.md#collectidentifierusage)
- [`typeScriptAstUtils.extractLocalImportNames`](../../language/typeScriptAstUtils.ts.md#extractlocalimportnames)
- [`typeScriptAstUtils.hasRuntimeUsage`](../../language/typeScriptAstUtils.ts.md#hasruntimeusage)
- [`typeScriptAstUtils.isLikelyTypeDefinitionSpecifier`](../../language/typeScriptAstUtils.ts.md#islikelytypedefinitionspecifier)
- `typescript` - `ts`
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
