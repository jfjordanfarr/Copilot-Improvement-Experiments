# packages/shared/src/rules/relationshipRuleEngine.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/rules/relationshipRuleEngine.ts
- Live Doc ID: LD-implementation-packages-shared-src-rules-relationshipruleengine-ts
- Generated At: 2025-11-14T18:42:06.832Z

## Authored
### Purpose
Load relationship rule configuration, compile it into executable chains, and generate link evidences from workspace artifacts.

### Notes
`loadRelationshipRuleConfig` tolerates missing files, upgrades legacy `rules` arrays, and records parsing warnings so providers can surface them. The compiler wires glob matchers, resolver instances, inferred link kinds, and propagations with confidence clamping for stability. During evaluation, the engine walks candidate chains, accumulates deduplicated evidences with provenance rationales, and respects custom `createdBy` tags so link inference can trace rule-sourced relationships.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.832Z","inputHash":"57b9986eadec5564"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `loadRelationshipRuleConfig`
- Type: function
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleEngine.ts#L30)

#### `compileRelationshipRules`
- Type: function
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleEngine.ts#L105)

#### `GenerateRelationshipEvidencesOptions`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleEngine.ts#L128)

#### `RelationshipEvidenceGenerationResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleEngine.ts#L135)

#### `generateRelationshipEvidences`
- Type: function
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleEngine.ts#L140)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `minimatch` - `Minimatch`
- `node:fs` - `fs`
- `node:path` - `path`
- [`fallbackInference.ArtifactSeed`](../inference/fallbackInference.ts.mdmd.md#artifactseed) (type-only)
- [`linkInference.LinkEvidence`](../inference/linkInference.ts.mdmd.md#linkevidence) (type-only)
- [`relationshipResolvers.createBuiltInResolvers`](./relationshipResolvers.ts.mdmd.md#createbuiltinresolvers)
- [`relationshipRuleTypes.CompiledRelationshipRule`](./relationshipRuleTypes.ts.mdmd.md#compiledrelationshiprule) (type-only)
- [`relationshipRuleTypes.CompiledRelationshipRulePropagation`](./relationshipRuleTypes.ts.mdmd.md#compiledrelationshiprulepropagation) (type-only)
- [`relationshipRuleTypes.CompiledRelationshipRuleStep`](./relationshipRuleTypes.ts.mdmd.md#compiledrelationshiprulestep) (type-only)
- [`relationshipRuleTypes.CompiledRelationshipRules`](./relationshipRuleTypes.ts.mdmd.md#compiledrelationshiprules) (type-only)
- [`relationshipRuleTypes.RelationshipResolver`](./relationshipRuleTypes.ts.mdmd.md#relationshipresolver) (type-only)
- [`relationshipRuleTypes.RelationshipRuleChain`](./relationshipRuleTypes.ts.mdmd.md#relationshiprulechain) (type-only)
- [`relationshipRuleTypes.RelationshipRuleConfig`](./relationshipRuleTypes.ts.mdmd.md#relationshipruleconfig) (type-only)
- [`relationshipRuleTypes.RelationshipRuleConfigLoadResult`](./relationshipRuleTypes.ts.mdmd.md#relationshipruleconfigloadresult) (type-only)
- [`relationshipRuleTypes.RelationshipRulePropagationConfig`](./relationshipRuleTypes.ts.mdmd.md#relationshiprulepropagationconfig) (type-only)
- [`relationshipRuleTypes.RelationshipRuleStepConfig`](./relationshipRuleTypes.ts.mdmd.md#relationshiprulestepconfig) (type-only)
- [`relationshipRuleTypes.RelationshipRuleWarning`](./relationshipRuleTypes.ts.mdmd.md#relationshiprulewarning) (type-only)
- [`relationshipRuleTypes.RelationshipRulesConfig`](./relationshipRuleTypes.ts.mdmd.md#relationshiprulesconfig) (type-only)
- [`pathUtils.toWorkspaceRelativePath`](../tooling/pathUtils.ts.mdmd.md#toworkspacerelativepath)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [analyzeWithAI.test.ts](../../../extension/src/commands/analyzeWithAI.test.ts.mdmd.md)
- [exportDiagnostics.test.ts](../../../extension/src/commands/exportDiagnostics.test.ts.mdmd.md)
- [inspectSymbolNeighbors.test.ts](../../../extension/src/commands/inspectSymbolNeighbors.test.ts.mdmd.md)
- [dependencyQuickPick.test.ts](../../../extension/src/diagnostics/dependencyQuickPick.test.ts.mdmd.md)
- [docDiagnosticProvider.test.ts](../../../extension/src/diagnostics/docDiagnosticProvider.test.ts.mdmd.md)
- [localOllamaBridge.test.ts](../../../extension/src/services/localOllamaBridge.test.ts.mdmd.md)
- [symbolBridge.test.ts](../../../extension/src/services/symbolBridge.test.ts.mdmd.md)
- [saveCodeChange.test.ts](../../../server/src/features/changeEvents/saveCodeChange.test.ts.mdmd.md)
- [saveDocumentChange.test.ts](../../../server/src/features/changeEvents/saveDocumentChange.test.ts.mdmd.md)
- [inspectDependencies.test.ts](../../../server/src/features/dependencies/inspectDependencies.test.ts.mdmd.md)
- [symbolNeighbors.test.ts](../../../server/src/features/dependencies/symbolNeighbors.test.ts.mdmd.md)
- [acknowledgementService.test.ts](../../../server/src/features/diagnostics/acknowledgementService.test.ts.mdmd.md)
- [listOutstandingDiagnostics.test.ts](../../../server/src/features/diagnostics/listOutstandingDiagnostics.test.ts.mdmd.md)
- [noiseFilter.test.ts](../../../server/src/features/diagnostics/noiseFilter.test.ts.mdmd.md)
- [publishDocDiagnostics.test.ts](../../../server/src/features/diagnostics/publishDocDiagnostics.test.ts.mdmd.md)
- [feedFormatDetector.test.ts](../../../server/src/features/knowledge/feedFormatDetector.test.ts.mdmd.md)
- [knowledgeFeedManager.test.ts](../../../server/src/features/knowledge/knowledgeFeedManager.test.ts.mdmd.md)
- [knowledgeGraphBridge.test.ts](../../../server/src/features/knowledge/knowledgeGraphBridge.test.ts.mdmd.md)
- [knowledgeGraphIngestor.test.ts](../../../server/src/features/knowledge/knowledgeGraphIngestor.test.ts.mdmd.md)
- [llmIngestionOrchestrator.test.ts](../../../server/src/features/knowledge/llmIngestionOrchestrator.test.ts.mdmd.md)
- [lsifParser.test.ts](../../../server/src/features/knowledge/lsifParser.test.ts.mdmd.md)
- [rippleAnalyzer.test.ts](../../../server/src/features/knowledge/rippleAnalyzer.test.ts.mdmd.md)
- [scipParser.test.ts](../../../server/src/features/knowledge/scipParser.test.ts.mdmd.md)
- [workspaceIndexProvider.test.ts](../../../server/src/features/knowledge/workspaceIndexProvider.test.ts.mdmd.md)
- [artifactWatcher.test.ts](../../../server/src/features/watchers/artifactWatcher.test.ts.mdmd.md)
- [pathReferenceDetector.test.ts](../../../server/src/features/watchers/pathReferenceDetector.test.ts.mdmd.md)
- [environment.test.ts](../../../server/src/runtime/environment.test.ts.mdmd.md)
- [settings.test.ts](../../../server/src/runtime/settings.test.ts.mdmd.md)
- [latencyTracker.test.ts](../../../server/src/telemetry/latencyTracker.test.ts.mdmd.md)
- [relationshipRuleProvider.test.ts](./relationshipRuleProvider.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
