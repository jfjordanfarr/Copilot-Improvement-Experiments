# packages/shared/src/rules/relationshipRuleAudit.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/rules/relationshipRuleAudit.ts
- Live Doc ID: LD-implementation-packages-shared-src-rules-relationshipruleaudit-ts
- Generated At: 2025-11-16T02:09:51.983Z

## Authored
### Purpose
Evaluate how well compiled relationship rules are satisfied by the persisted knowledge graph and emit actionable diagnostics for missing hops or propagations.

### Notes
Collects candidate artifacts per step, then walks stored edges to confirm chains exist from source to sink; gaps become `RelationshipCoverageIssue` records annotated with expected link kinds and workspace-relative paths. Propagation checks ensure implicit hops materialise as actual graph edges, and `formatRelationshipDiagnostics` distils findings into sorted, human-readable messages for tooling like SlopCop or command output.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.983Z","inputHash":"371a84c1153162b9"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `RelationshipCoverageChain`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleAudit.ts#L11)

#### `RelationshipCoverageIssueKind`
- Type: type
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleAudit.ts#L17)

#### `RelationshipCoverageIssue`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleAudit.ts#L19)

#### `RelationshipCoverageRuleResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleAudit.ts#L31)

#### `RelationshipCoverageResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleAudit.ts#L38)

#### `EvaluateRelationshipCoverageOptions`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleAudit.ts#L42)

#### `evaluateRelationshipCoverage`
- Type: function
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleAudit.ts#L48)

#### `RelationshipCoverageDiagnostic`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleAudit.ts#L345)

#### `formatRelationshipDiagnostics`
- Type: function
- Source: [source](../../../../../../packages/shared/src/rules/relationshipRuleAudit.ts#L354)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`graphStore.GraphStore`](../db/graphStore.ts.md#graphstore) (type-only)
- [`artifacts.KnowledgeArtifact`](../domain/artifacts.ts.md#knowledgeartifact) (type-only)
- [`artifacts.LinkRelationshipKind`](../domain/artifacts.ts.md#linkrelationshipkind) (type-only)
- [`relationshipRuleTypes.CompiledRelationshipRule`](./relationshipRuleTypes.ts.md#compiledrelationshiprule) (type-only)
- [`relationshipRuleTypes.CompiledRelationshipRuleStep`](./relationshipRuleTypes.ts.md#compiledrelationshiprulestep) (type-only)
- [`relationshipRuleTypes.CompiledRelationshipRules`](./relationshipRuleTypes.ts.md#compiledrelationshiprules) (type-only)
- [`relationshipRuleTypes.RelationshipRuleWarning`](./relationshipRuleTypes.ts.md#relationshiprulewarning) (type-only)
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
