# packages/shared/src/contracts/lsif.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/contracts/lsif.ts
- Live Doc ID: LD-implementation-packages-shared-src-contracts-lsif-ts
- Generated At: 2025-11-16T02:09:51.756Z

## Authored
### Purpose
Provides a type-safe mirror of the LSIF vertex and edge schema so both the server importers and downstream processors can parse and traverse LSIF dumps without hand-rolled casting.

### Notes
- Captures the subset of LSIF 0.6 labels and structural fields we rely on when normalizing knowledge feeds into link-aware diagnostics.
- `ParsedLSIFIndex` models the staged maps the parsers build, enabling callers to thread strongly typed ranges/documents through analyzers instead of working with raw JSON.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.756Z","inputHash":"48203a81012d4b91"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LSIFVertexLabel`
- Type: type
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L9)

##### `LSIFVertexLabel` — Summary
TypeScript interfaces for LSIF (Language Server Index Format) data structures.
LSIF is a graph-based index format for code intelligence that captures symbols,
definitions, references, and their relationships.

Spec: https://microsoft.github.io/language-server-protocol/specifications/lsif/0.6.0/specification/

#### `LSIFEdgeLabel`
- Type: type
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L20)

#### `LSIFElement`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L28)

#### `LSIFVertex`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L34)

#### `LSIFEdge`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L38)

#### `LSIFMetaData`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L44)

#### `LSIFProject`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L55)

#### `LSIFDocument`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L62)

#### `LSIFRange`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L69)

#### `LSIFResultSet`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L90)

#### `LSIFDefinitionResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L94)

#### `LSIFReferenceResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L98)

#### `LSIFContainsEdge`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L102)

#### `LSIFItemEdge`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L107)

#### `LSIFNextEdge`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L113)

#### `LSIFDefinitionEdge`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L117)

#### `LSIFReferencesEdge`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L121)

#### `LSIFEntry`
- Type: type
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L128)

##### `LSIFEntry` — Summary
LSIF dump is a newline-delimited JSON stream where each line is a vertex or edge

#### `ParsedLSIFIndex`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/lsif.ts#L143)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_No dependencies documented yet_
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
