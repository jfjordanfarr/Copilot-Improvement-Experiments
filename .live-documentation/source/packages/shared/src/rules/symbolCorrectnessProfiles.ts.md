# packages/shared/src/rules/symbolCorrectnessProfiles.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/rules/symbolCorrectnessProfiles.ts
- Live Doc ID: LD-implementation-packages-shared-src-rules-symbolcorrectnessprofiles-ts
- Generated At: 2025-11-16T02:09:52.006Z

## Authored
### Purpose
Parse and compile symbol correctness profiles so coverage audits can reason about expected cross-layer relationships for specific artifact glob sets.

### Notes
Loader helpers validate profile ids, sources, and requirement wiring, emitting structured warnings instead of throwing when configs are incomplete. Compilation turns glob patterns into `Minimatch` predicates, normalises optional identifier regexes and metadata fields, and produces lookup functions that filter profiles by workspace-relative paths plus MDMD layers—allowing the rule audit to pair artifacts with the right requirement set.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:52.006Z","inputHash":"8f1187e50bbebde6"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `SymbolProfileLoadResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/symbolCorrectnessProfiles.ts#L21)

#### `CompileSymbolProfilesResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/symbolCorrectnessProfiles.ts#L26)

#### `loadSymbolCorrectnessProfiles`
- Type: function
- Source: [source](../../../../../../packages/shared/src/rules/symbolCorrectnessProfiles.ts#L32)

#### `compileSymbolProfiles`
- Type: function
- Source: [source](../../../../../../packages/shared/src/rules/symbolCorrectnessProfiles.ts#L53)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `minimatch` - `Minimatch`
- [`relationshipRuleTypes.CompiledSymbolProfile`](./relationshipRuleTypes.ts.md#compiledsymbolprofile) (type-only)
- [`relationshipRuleTypes.CompiledSymbolProfileRequirement`](./relationshipRuleTypes.ts.md#compiledsymbolprofilerequirement) (type-only)
- [`relationshipRuleTypes.CompiledSymbolProfileSource`](./relationshipRuleTypes.ts.md#compiledsymbolprofilesource) (type-only)
- [`relationshipRuleTypes.CompiledSymbolProfileTarget`](./relationshipRuleTypes.ts.md#compiledsymbolprofiletarget) (type-only)
- [`relationshipRuleTypes.RelationshipRuleWarning`](./relationshipRuleTypes.ts.md#relationshiprulewarning) (type-only)
- [`relationshipRuleTypes.RelationshipRulesConfig`](./relationshipRuleTypes.ts.md#relationshiprulesconfig) (type-only)
- [`relationshipRuleTypes.SymbolCorrectnessProfileConfig`](./relationshipRuleTypes.ts.md#symbolcorrectnessprofileconfig) (type-only)
- [`relationshipRuleTypes.SymbolProfileLookup`](./relationshipRuleTypes.ts.md#symbolprofilelookup) (type-only)
- [`relationshipRuleTypes.SymbolProfileRequirementConfig`](./relationshipRuleTypes.ts.md#symbolprofilerequirementconfig) (type-only)
- [`relationshipRuleTypes.SymbolProfileRequirementDirection`](./relationshipRuleTypes.ts.md#symbolprofilerequirementdirection) (type-only)
- [`relationshipRuleTypes.SymbolProfileSourceConfig`](./relationshipRuleTypes.ts.md#symbolprofilesourceconfig) (type-only)
- [`relationshipRuleTypes.SymbolProfileTargetConfig`](./relationshipRuleTypes.ts.md#symbolprofiletargetconfig) (type-only)
- [`pathUtils.toWorkspaceRelativePath`](../tooling/pathUtils.ts.md#toworkspacerelativepath)
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
<!-- LIVE-DOC:END Observed Evidence -->
