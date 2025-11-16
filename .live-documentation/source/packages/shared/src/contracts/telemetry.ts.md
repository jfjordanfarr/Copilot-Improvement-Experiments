# packages/shared/src/contracts/telemetry.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/contracts/telemetry.ts
- Live Doc ID: LD-implementation-packages-shared-src-contracts-telemetry-ts
- Generated At: 2025-11-16T02:09:51.772Z

## Authored
### Purpose
Declares the telemetry request contract that powers latency dashboards, letting the extension ask the server for change-processing latencies and recent samples.

### Notes
- `LatencySummary` aggregates totals, percentiles, and per-change-type stats so UX surfaces can distinguish document and code flows without re-deriving metrics.
- The request supports optional resets and sample limits, enabling ad-hoc troubleshooting without forcing the server to stream the full history.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.772Z","inputHash":"78f6f2dd48080ca8"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LATENCY_SUMMARY_REQUEST`
- Type: const
- Source: [source](../../../../../../packages/shared/src/contracts/telemetry.ts#L1)

#### `LatencyChangeKind`
- Type: type
- Source: [source](../../../../../../packages/shared/src/contracts/telemetry.ts#L3)

#### `LatencySample`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/telemetry.ts#L5)

#### `LatencySummary`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/telemetry.ts#L15)

#### `LatencySummaryRequest`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/telemetry.ts#L34)

#### `LatencySummaryResponse`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/telemetry.ts#L39)
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
