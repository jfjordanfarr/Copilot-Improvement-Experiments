# packages/shared/src/contracts/dependencies.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/contracts/dependencies.ts
- Live Doc ID: LD-implementation-packages-shared-src-contracts-dependencies-ts
- Generated At: 2025-11-19T15:01:34.630Z

## Authored
### Purpose
Defines the shared request/response contract that powers dependency traversal over LSP—introduced while delivering the dependency quick pick in [AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-20.SUMMARIZED.md#turn-06-deliver-t039-dependency-quick-pick-lines-1186-1548](../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-20.SUMMARIZED.md#turn-06-deliver-t039-dependency-quick-pick-lines-1186-1548).

### Notes
Server handlers (`packages/server/src/features/dependencies/inspectDependencies.ts`) and the VS Code dependency quick pick share these shapes; later wiring and integration hardening are captured in [AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-23.SUMMARIZED.md#turn-24-lsp--command-implementation-kickoff-lines-2701-3000](../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-23.SUMMARIZED.md#turn-24-lsp--command-implementation-kickoff-lines-2701-3000), so any schema change requires coordinated updates across those surfaces and their tests.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-19T15:01:34.630Z","inputHash":"176dce59cd9be8d3"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `INSPECT_DEPENDENCIES_REQUEST` {#symbol-inspect_dependencies_request}
- Type: const
- Source: [source](../../../../../../packages/shared/src/contracts/dependencies.ts#L3)

#### `InspectDependenciesParams` {#symbol-inspectdependenciesparams}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/dependencies.ts#L5)

#### `DependencyGraphEdge` {#symbol-dependencygraphedge}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/dependencies.ts#L16)

#### `InspectDependenciesSummary` {#symbol-inspectdependenciessummary}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/dependencies.ts#L28)

#### `InspectDependenciesResult` {#symbol-inspectdependenciesresult}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/dependencies.ts#L33)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`artifacts.KnowledgeArtifact`](../domain/artifacts.ts.mdmd.md#symbol-knowledgeartifact) (type-only)
- [`artifacts.LinkRelationshipKind`](../domain/artifacts.ts.mdmd.md#symbol-linkrelationshipkind) (type-only)
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
<!-- LIVE-DOC:END Observed Evidence -->
