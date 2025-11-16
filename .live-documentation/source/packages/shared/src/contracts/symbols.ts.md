# packages/shared/src/contracts/symbols.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/contracts/symbols.ts
- Live Doc ID: LD-implementation-packages-shared-src-contracts-symbols-ts
- Generated At: 2025-11-16T02:09:51.769Z

## Authored
### Purpose
Defines the shared contracts for collecting workspace symbols and inspecting their neighbor graph so the extension can drive graph exploration via the language-server transport.

### Notes
- `CollectWorkspaceSymbolsParams` seeds the traversal with known artifacts and lets the client cap work via `maxSeeds`, while the result bundles both the contribution payload and traversal summary metrics.
- Symbol neighbor inspection accepts artifact IDs or URIs, and groups responses by relationship kind with per-neighbor path metadata so the UI can render hop-by-hop provenance.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.769Z","inputHash":"8b263be8a82f6c9f"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `COLLECT_WORKSPACE_SYMBOLS_REQUEST`
- Type: const
- Source: [source](../../../../../../packages/shared/src/contracts/symbols.ts#L5)

#### `CollectWorkspaceSymbolsParams`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/symbols.ts#L7)

#### `CollectWorkspaceSymbolsResultSummary`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/symbols.ts#L16)

#### `CollectWorkspaceSymbolsResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/symbols.ts#L23)

#### `INSPECT_SYMBOL_NEIGHBORS_REQUEST`
- Type: const
- Source: [source](../../../../../../packages/shared/src/contracts/symbols.ts#L28)

#### `InspectSymbolNeighborsParams`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/symbols.ts#L30)

#### `SymbolNeighborPath`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/symbols.ts#L43)

#### `SymbolNeighborNode`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/symbols.ts#L47)

#### `SymbolNeighborGroup`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/symbols.ts#L57)

#### `InspectSymbolNeighborsSummary`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/symbols.ts#L62)

#### `InspectSymbolNeighborsResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/symbols.ts#L67)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`artifacts.KnowledgeArtifact`](../domain/artifacts.ts.md#knowledgeartifact) (type-only)
- [`artifacts.LinkRelationshipKind`](../domain/artifacts.ts.md#linkrelationshipkind) (type-only)
- [`fallbackInference.ArtifactSeed`](../inference/fallbackInference.ts.md#artifactseed) (type-only)
- [`linkInference.WorkspaceLinkContribution`](../inference/linkInference.ts.md#workspacelinkcontribution) (type-only)
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
