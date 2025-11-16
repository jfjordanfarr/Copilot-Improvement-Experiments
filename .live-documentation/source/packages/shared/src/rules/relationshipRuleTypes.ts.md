# packages/shared/src/rules/relationshipRuleTypes.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/rules/relationshipRuleTypes.ts
- Live Doc ID: LD-implementation-packages-shared-src-rules-relationshipruletypes-ts
- Generated At: 2025-11-16T02:09:52.001Z

## Authored
### Purpose
Describe the configuration, compilation, and runtime data structures that drive relationship rule evaluation and symbol correctness profiling.

### Notes
Defines both author-facing config shapes (rule steps, propagations, symbol profiles) and the compiled counterparts that embed glob matchers, resolvers, and confidence defaults. Shared warning types and chain representations allow loaders, engines, and audits to exchange structured feedback without circular dependencies, while symbol profile lookup contracts feed coverage diagnostics elsewhere in the system.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:52.001Z","inputHash":"b47e9dac95372c4e"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `SymbolProfileRequirementDirection`
- Type: type
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L4)

#### `RelationshipRuleStepConfig`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L6)

#### `RelationshipRulePropagationConfig`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L16)

#### `RelationshipRuleConfig`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L23)

#### `RelationshipRulesConfig`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L31)

#### `RelationshipRuleConfigLoadResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L38)

#### `RelationshipRuleWarning`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L44)

#### `RelationshipResolverResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L50)

#### `RelationshipResolverOptions`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L55)

#### `RelationshipResolver`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L63)

#### `CompiledRelationshipRuleStep`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L68)

#### `CompiledRelationshipRulePropagation`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L79)

#### `CompiledRelationshipRule`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L86)

#### `CompiledRelationshipRules`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L94)

#### `RelationshipRuleChain`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L100)

#### `RelationshipRuleChainStep`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L105)

#### `SymbolProfileSourceConfig`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L111)

#### `SymbolProfileTargetConfig`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L119)

#### `SymbolProfileRequirementConfig`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L125)

#### `SymbolCorrectnessProfileConfig`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L136)

#### `CompiledSymbolProfileTarget`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L145)

#### `CompiledSymbolProfileRequirement`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L152)

#### `CompiledSymbolProfileSource`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L163)

#### `CompiledSymbolProfile`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L171)

#### `SymbolProfileLookup`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleTypes.ts#L180)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`artifacts.ArtifactLayer`](../domain/artifacts.ts.md#artifactlayer) (type-only)
- [`artifacts.LinkRelationshipKind`](../domain/artifacts.ts.md#linkrelationshipkind) (type-only)
- [`fallbackInference.ArtifactSeed`](../inference/fallbackInference.ts.md#artifactseed) (type-only)
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
