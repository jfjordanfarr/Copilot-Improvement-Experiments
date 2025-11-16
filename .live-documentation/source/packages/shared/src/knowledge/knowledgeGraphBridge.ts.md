# packages/shared/src/knowledge/knowledgeGraphBridge.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/knowledge/knowledgeGraphBridge.ts
- Live Doc ID: LD-implementation-packages-shared-src-knowledge-knowledgegraphbridge-ts
- Generated At: 2025-11-16T02:09:51.929Z

## Authored
### Purpose
Normalize external knowledge snapshots and stream events into the shared `GraphStore`, keeping artifact/link identifiers stable while tracking ingestion checkpoints.

### Notes
Snapshots convert external artifacts/links into canonical records, persist them, and compute a simple payload hash so later runs can detect drift. Alias bookkeeping lets follow-up link events reference either external or canonical ids, and stream handlers guard against missing payloads before mutating the store. Removal logic handles id- or URI-driven deletes, while telemetry-friendly checkpoints capture the latest processed sequence id to support resumable ingestors.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.929Z","inputHash":"037012ee3bb33625"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ExternalArtifact`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/knowledge/knowledgeGraphBridge.ts#L10)

#### `ExternalLink`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/knowledge/knowledgeGraphBridge.ts#L21)

#### `ExternalSnapshot`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/knowledge/knowledgeGraphBridge.ts#L32)

#### `StreamEventKind`
- Type: type
- Source: [source](../../../../../../packages/shared/src/knowledge/knowledgeGraphBridge.ts#L41)

#### `ExternalStreamEvent`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/knowledge/knowledgeGraphBridge.ts#L47)

#### `StreamCheckpoint`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/knowledge/knowledgeGraphBridge.ts#L58)

#### `KnowledgeGraphBridge`
- Type: class
- Source: [source](../../../../../../packages/shared/src/knowledge/knowledgeGraphBridge.ts#L63)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`graphStore.GraphStore`](../db/graphStore.ts.md#graphstore)
- [`artifacts.ArtifactLayer`](../domain/artifacts.ts.md#artifactlayer)
- [`artifacts.KnowledgeArtifact`](../domain/artifacts.ts.md#knowledgeartifact)
- [`artifacts.KnowledgeSnapshot`](../domain/artifacts.ts.md#knowledgesnapshot)
- [`artifacts.LinkRelationship`](../domain/artifacts.ts.md#linkrelationship)
- [`artifacts.LinkRelationshipKind`](../domain/artifacts.ts.md#linkrelationshipkind)
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
- [linkInference.test.ts](../inference/linkInference.test.ts.md)
- [relationshipRuleProvider.test.ts](../rules/relationshipRuleProvider.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
