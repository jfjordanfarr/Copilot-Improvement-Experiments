# packages/shared/src/knowledge/knowledgeGraphBridge.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/knowledge/knowledgeGraphBridge.ts
- Live Doc ID: LD-implementation-packages-shared-src-knowledge-knowledgegraphbridge-ts
- Generated At: 2025-11-19T15:01:35.097Z

## Authored
### Purpose
Provides the shared bridge that normalises external knowledge snapshots and streaming events into GraphStore artifacts/links, fulfilling the October 21 ingestion requirement captured in [AI-Agent-Workspace/ChatHistory/2025/10/2025-10-21.md#L194](../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-21.md#L194).

### Notes
The server wiring on October 20 relies on this bridge to bootstrap feeds from `data/knowledge-feeds/bootstrap.json`, so updates here should stay aligned with that runtime pipeline—see [AI-Agent-Workspace/ChatHistory/2025/10/2025-10-20.md#L2334](../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-20.md#L2334) for the operational walkthrough.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-19T15:01:35.097Z","inputHash":"9bbbf7ce041106b2"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ExternalArtifact` {#symbol-externalartifact}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/knowledge/knowledgeGraphBridge.ts#L10)

#### `ExternalLink` {#symbol-externallink}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/knowledge/knowledgeGraphBridge.ts#L21)

#### `ExternalSnapshot` {#symbol-externalsnapshot}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/knowledge/knowledgeGraphBridge.ts#L32)

#### `StreamEventKind` {#symbol-streameventkind}
- Type: type
- Source: [source](../../../../../../packages/shared/src/knowledge/knowledgeGraphBridge.ts#L41)

#### `ExternalStreamEvent` {#symbol-externalstreamevent}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/knowledge/knowledgeGraphBridge.ts#L47)

#### `StreamCheckpoint` {#symbol-streamcheckpoint}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/knowledge/knowledgeGraphBridge.ts#L58)

#### `KnowledgeGraphBridge` {#symbol-knowledgegraphbridge}
- Type: class
- Source: [source](../../../../../../packages/shared/src/knowledge/knowledgeGraphBridge.ts#L63)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`graphStore.GraphStore`](../db/graphStore.ts.mdmd.md#symbol-graphstore)
- [`artifacts.ArtifactLayer`](../domain/artifacts.ts.mdmd.md#symbol-artifactlayer)
- [`artifacts.KnowledgeArtifact`](../domain/artifacts.ts.mdmd.md#symbol-knowledgeartifact)
- [`artifacts.KnowledgeSnapshot`](../domain/artifacts.ts.mdmd.md#symbol-knowledgesnapshot)
- [`artifacts.LinkRelationship`](../domain/artifacts.ts.mdmd.md#symbol-linkrelationship)
- [`artifacts.LinkRelationshipKind`](../domain/artifacts.ts.mdmd.md#symbol-linkrelationshipkind)
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
- [linkInference.test.ts](../inference/linkInference.test.ts.mdmd.md)
- [relationshipRuleProvider.test.ts](../rules/relationshipRuleProvider.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
