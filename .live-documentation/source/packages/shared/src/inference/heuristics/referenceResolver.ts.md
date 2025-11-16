# packages/shared/src/inference/heuristics/referenceResolver.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/inference/heuristics/referenceResolver.ts
- Live Doc ID: LD-implementation-packages-shared-src-inference-heuristics-referenceresolver-ts
- Generated At: 2025-11-16T02:09:51.868Z

## Authored
### Purpose
Provides shared helpers for translating textual references into candidate artifacts, returning consistent confidence scores for markdown, import, and include heuristics.

### Notes
- `resolveReference` expands relative paths into a variant list, applies heuristic scoring via `evaluateVariantMatch`, and stitches the winning rationale into the caller-provided context.
- `resolveIncludeReference` takes a simpler path by normalizing `#include` targets against the source directory and assigns a fixed high confidence for direct matches.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.868Z","inputHash":"89da24ea8ff787f9"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ReferenceResolution`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/inference/heuristics/referenceResolver.ts#L12)

#### `resolveReference`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/inference/heuristics/referenceResolver.ts#L18)

#### `resolveIncludeReference`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/inference/heuristics/referenceResolver.ts#L59)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- [`fallbackHeuristicTypes.HeuristicArtifact`](../fallbackHeuristicTypes.ts.md#heuristicartifact) (type-only)
- [`shared.buildReferenceVariants`](./shared.ts.md#buildreferencevariants)
- [`shared.cleanupReference`](./shared.ts.md#cleanupreference)
- [`shared.evaluateVariantMatch`](./shared.ts.md#evaluatevariantmatch)
- [`shared.isExternalLink`](./shared.ts.md#isexternallink)
- [`shared.toComparablePath`](./shared.ts.md#tocomparablepath)
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
