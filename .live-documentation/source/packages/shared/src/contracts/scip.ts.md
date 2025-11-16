# packages/shared/src/contracts/scip.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/contracts/scip.ts
- Live Doc ID: LD-implementation-packages-shared-src-contracts-scip-ts
- Generated At: 2025-11-16T02:09:51.766Z

## Authored
### Purpose
Captures the TypeScript shape of SCIP indexes so our parsers and analyzers can reason about Sourcegraph-derived knowledge feeds without treating them as opaque JSON blobs.

### Notes
- Mirrors the subset of SCIP metadata, documents, symbol roles, and relationships that the knowledge ingestion pipeline consumes when building link graphs.
- `ParsedSCIPIndex` reflects the cached maps we populate after parsing, enabling efficient lookups of symbols and occurrences when reconciling diagnostics.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.766Z","inputHash":"e50248c0ce243485"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `SCIPIndex`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L8)

##### `SCIPIndex` — Summary
TypeScript interfaces for SCIP (SCIP Code Intelligence Protocol) data structures.
SCIP is a language-agnostic protocol for indexing code and representing code intelligence data.

Spec: https://github.com/sourcegraph/scip

#### `SCIPMetadata`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L13)

#### `SCIPToolInfo`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L20)

#### `SCIPDocument`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L26)

#### `SCIPOccurrence`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L33)

#### `SCIPSymbolInformation`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L42)

#### `SCIPRelationship`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L51)

#### `SCIPDiagnostic`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L59)

#### `SCIPSignature`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L67)

#### `SCIPSymbolRole`
- Type: enum
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L76)

##### `SCIPSymbolRole` — Summary
SCIP symbol roles (bitflags)

#### `SCIPSymbolKind`
- Type: enum
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L90)

##### `SCIPSymbolKind` — Summary
SCIP symbol kinds

#### `ParsedSCIPIndex`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L125)
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
