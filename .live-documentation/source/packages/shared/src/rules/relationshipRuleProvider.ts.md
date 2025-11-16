# packages/shared/src/rules/relationshipRuleProvider.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/rules/relationshipRuleProvider.ts
- Live Doc ID: LD-implementation-packages-shared-src-rules-relationshipruleprovider-ts
- Generated At: 2025-11-16T02:09:51.997Z

## Authored
### Purpose
Expose relationship rules as a `WorkspaceLinkProvider`, wiring config loading, compilation, and evidence generation into the link inference pipeline.

### Notes
Each collection run reloads the JSON rules file, logs parser/compiler warnings through an optional logger, and short-circuits when no rules or chains compile. When evidences are produced, the provider stamps them with a configurable creator id and surfaces volume metrics via `info` logs so operators can gauge impact without inspecting raw traces.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.997Z","inputHash":"255364b67d33ab28"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `RelationshipRuleProviderLogger`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleProvider.ts#L5)

#### `RelationshipRuleProviderOptions`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleProvider.ts#L10)

#### `createRelationshipRuleProvider`
- Type: function
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleProvider.ts#L22)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`linkInference.WorkspaceLinkContribution`](../inference/linkInference.ts.md#workspacelinkcontribution) (type-only)
- [`linkInference.WorkspaceLinkProvider`](../inference/linkInference.ts.md#workspacelinkprovider) (type-only)
- [`relationshipRuleEngine.compileRelationshipRules`](./relationshipRuleEngine.ts.md#compilerelationshiprules)
- [`relationshipRuleEngine.generateRelationshipEvidences`](./relationshipRuleEngine.ts.md#generaterelationshipevidences)
- [`relationshipRuleEngine.loadRelationshipRuleConfig`](./relationshipRuleEngine.ts.md#loadrelationshipruleconfig)
- [`relationshipRuleTypes.RelationshipRuleWarning`](./relationshipRuleTypes.ts.md#relationshiprulewarning) (type-only)
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
- [relationshipRuleProvider.test.ts](./relationshipRuleProvider.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
