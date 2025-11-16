# packages/shared/src/tooling/markdownShared.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/tooling/markdownShared.ts
- Live Doc ID: LD-implementation-packages-shared-src-tooling-markdownshared-ts
- Generated At: 2025-11-16T02:09:52.122Z

## Authored
### Purpose
Supplies lightweight markdown helpers used by link- and asset-auditing tools to map indices to coordinates and resolve reference definitions uniformly.

### Notes
- Extracts `[id]: url` definitions with source indices so auditors can highlight the correct line when reference-style links break.
- Precomputes line starts and converts character offsets into 1-based line/column tuples, avoiding repeated scans during multi-link audits.
- Handles angle-bracket escaping and surrounding whitespace through `parseLinkTarget`, centralising URL sanitisation for both markdown and documentation tooling.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:52.122Z","inputHash":"9ef3a326d9374485"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ReferenceDefinition`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/tooling/markdownShared.ts#L1)

#### `extractReferenceDefinitions`
- Type: function
- Source: [source](../../../../../../packages/shared/src/tooling/markdownShared.ts#L6)

#### `computeLineStarts`
- Type: function
- Source: [source](../../../../../../packages/shared/src/tooling/markdownShared.ts#L28)

#### `toLineAndColumn`
- Type: function
- Source: [source](../../../../../../packages/shared/src/tooling/markdownShared.ts#L39)

#### `parseLinkTarget`
- Type: function
- Source: [source](../../../../../../packages/shared/src/tooling/markdownShared.ts#L63)
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
- [relationshipRuleProvider.test.ts](../rules/relationshipRuleProvider.test.ts.md)
- [documentationLinks.test.ts](./documentationLinks.test.ts.md)
- [markdownLinks.test.ts](./markdownLinks.test.ts.md)
- [symbolReferences.test.ts](./symbolReferences.test.ts.md)
- [enforce-documentation-links.test.ts](../../../../scripts/doc-tools/enforce-documentation-links.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
