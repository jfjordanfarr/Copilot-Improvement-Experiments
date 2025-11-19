# packages/shared/src/contracts/scip.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/contracts/scip.ts
- Live Doc ID: LD-implementation-packages-shared-src-contracts-scip-ts
- Generated At: 2025-11-19T15:01:34.662Z

## Authored
### Purpose
Provides TypeScript shapes for SCIP indices so the ingestion pipeline can parse Sourcegraph snapshots—added alongside the LSIF/SCIP feed integration in [AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-22.SUMMARIZED.md#turn-04-option-b-kickoff--lsifscip-ingestion-lines-1181-1950](../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-22.SUMMARIZED.md#turn-04-option-b-kickoff--lsifscip-ingestion-lines-1181-1950).

### Notes
`scipParser.ts` and the feed format detector depend on these enums/records; refer to [AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-22.SUMMARIZED.md#turn-05-integration-harness--workspace-index-overhaul-lines-1951-2800](../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-22.SUMMARIZED.md#turn-05-integration-harness--workspace-index-overhaul-lines-1951-2800) for the parser fixes that keep this contract aligned with ingest reality.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-19T15:01:34.662Z","inputHash":"e50248c0ce243485"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `SCIPIndex` {#symbol-scipindex}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L8)

##### `SCIPIndex` — Summary
TypeScript interfaces for SCIP (SCIP Code Intelligence Protocol) data structures.
SCIP is a language-agnostic protocol for indexing code and representing code intelligence data.

Spec: https://github.com/sourcegraph/scip

#### `SCIPMetadata` {#symbol-scipmetadata}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L13)

#### `SCIPToolInfo` {#symbol-sciptoolinfo}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L20)

#### `SCIPDocument` {#symbol-scipdocument}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L26)

#### `SCIPOccurrence` {#symbol-scipoccurrence}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L33)

#### `SCIPSymbolInformation` {#symbol-scipsymbolinformation}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L42)

#### `SCIPRelationship` {#symbol-sciprelationship}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L51)

#### `SCIPDiagnostic` {#symbol-scipdiagnostic}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L59)

#### `SCIPSignature` {#symbol-scipsignature}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L67)

#### `SCIPSymbolRole` {#symbol-scipsymbolrole}
- Type: enum
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L76)

##### `SCIPSymbolRole` — Summary
SCIP symbol roles (bitflags)

#### `SCIPSymbolKind` {#symbol-scipsymbolkind}
- Type: enum
- Source: [source](../../../../../../packages/shared/src/contracts/scip.ts#L90)

##### `SCIPSymbolKind` — Summary
SCIP symbol kinds

#### `ParsedSCIPIndex` {#symbol-parsedscipindex}
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
