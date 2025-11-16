# packages/shared/src/db/graphStore.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/db/graphStore.ts
- Live Doc ID: LD-implementation-packages-shared-src-db-graphstore-ts
- Generated At: 2025-11-16T02:09:51.783Z

## Authored
### Purpose
Wraps the project’s SQLite knowledge graph in a strongly typed DAO that owns schema bootstrapping, artifact/link CRUD, diagnostic persistence, and drift history queries for both the server and tooling layers.

### Notes
- Guards better-sqlite3 loading by resolving the platform-specific native binding and fails fast with a rebuild hint when the ABI mismatches bundled binaries.
- Persists artifacts, change events, diagnostics, edges, and LLM provenance with deterministic JSON serialization so downstream processes can rebuild caches without ad-hoc migrations.
- Provides reporting helpers such as `summarizeDriftHistory` and `listLinkedArtifacts`, which power diagnostics surfaces, telemetry, and rule engines consuming the same store.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.783Z","inputHash":"72c6bca4aff7d68e"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `GraphStoreOptions`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/db/graphStore.ts#L20)

#### `LinkedArtifactSummary`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/db/graphStore.ts#L25)

#### `GraphStore`
- Type: class
- Source: [source](../../../../../../packages/shared/src/db/graphStore.ts#L67)

##### `GraphStore` — Summary
Thin wrapper around better-sqlite3 that materialises our knowledge-graph projections. The
implementation deliberately keeps schema bootstrapping local so the store can be rebuilt after
cache deletion without bespoke tooling.

#### `DriftHistorySummary`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/db/graphStore.ts#L1189)

#### `ListDriftHistoryOptions`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/db/graphStore.ts#L1209)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `better-sqlite3` - `Database`
- `node:fs` - `fs`
- `node:path` - `path`
- [`artifacts.AcknowledgementAction`](../domain/artifacts.ts.md#acknowledgementaction)
- [`artifacts.ChangeEvent`](../domain/artifacts.ts.md#changeevent)
- [`artifacts.DiagnosticRecord`](../domain/artifacts.ts.md#diagnosticrecord)
- [`artifacts.DiagnosticStatus`](../domain/artifacts.ts.md#diagnosticstatus)
- [`artifacts.DriftHistoryEntry`](../domain/artifacts.ts.md#drifthistoryentry)
- [`artifacts.DriftHistoryStatus`](../domain/artifacts.ts.md#drifthistorystatus)
- [`artifacts.KnowledgeArtifact`](../domain/artifacts.ts.md#knowledgeartifact)
- [`artifacts.KnowledgeSnapshot`](../domain/artifacts.ts.md#knowledgesnapshot)
- [`artifacts.LinkRelationship`](../domain/artifacts.ts.md#linkrelationship)
- [`artifacts.LinkRelationshipKind`](../domain/artifacts.ts.md#linkrelationshipkind)
- [`artifacts.LlmAssessment`](../domain/artifacts.ts.md#llmassessment)
- [`artifacts.LlmEdgeProvenance`](../domain/artifacts.ts.md#llmedgeprovenance)
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
- [graphStore.test.ts](./graphStore.test.ts.md)
- [linkInference.test.ts](../inference/linkInference.test.ts.md)
- [relationshipRuleProvider.test.ts](../rules/relationshipRuleProvider.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
