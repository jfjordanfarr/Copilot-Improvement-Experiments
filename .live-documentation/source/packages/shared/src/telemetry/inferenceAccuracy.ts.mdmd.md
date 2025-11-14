# packages/shared/src/telemetry/inferenceAccuracy.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/telemetry/inferenceAccuracy.ts
- Live Doc ID: LD-implementation-packages-shared-src-telemetry-inferenceaccuracy-ts
- Generated At: 2025-11-14T18:42:06.849Z

## Authored
### Purpose
Track precision/recall metrics for inferred links across benchmark runs, retaining recent samples for debugging while exposing aggregate summaries.

### Notes
`InferenceAccuracyTracker` normalises artifact URIs, increments weighted TP/FP/FN totals per benchmark, and trims its rolling sample buffer to a configurable size. Snapshots return per-benchmark ratios plus global aggregates, with optional reset semantics so long-lived processes can publish deltas without reallocating the tracker.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.849Z","inputHash":"5ed2f37400dc7e95"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `InferenceOutcome`
- Type: type
- Source: [source](../../../../../../packages/shared/src/telemetry/inferenceAccuracy.ts#L3)

#### `RecordOutcomeOptions`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/telemetry/inferenceAccuracy.ts#L5)

#### `InferenceAccuracyTrackerOptions`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/telemetry/inferenceAccuracy.ts#L15)

#### `AccuracySample`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/telemetry/inferenceAccuracy.ts#L23)

#### `AccuracyTotals`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/telemetry/inferenceAccuracy.ts#L33)

#### `BenchmarkAccuracySummary`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/telemetry/inferenceAccuracy.ts#L43)

#### `InferenceAccuracySummary`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/telemetry/inferenceAccuracy.ts#L47)

#### `InferenceAccuracyTracker`
- Type: class
- Source: [source](../../../../../../packages/shared/src/telemetry/inferenceAccuracy.ts#L64)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`normalizeFileUri.normalizeFileUri`](../uri/normalizeFileUri.ts.mdmd.md#normalizefileuri)
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
- [inferenceAccuracy.test.ts](../../../server/src/telemetry/inferenceAccuracy.test.ts.mdmd.md)
- [latencyTracker.test.ts](../../../server/src/telemetry/latencyTracker.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
