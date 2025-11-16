# packages/shared/src/contracts/diagnostics.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/contracts/diagnostics.ts
- Live Doc ID: LD-implementation-packages-shared-src-contracts-diagnostics-ts
- Generated At: 2025-11-16T02:09:51.750Z

## Authored
### Purpose
Defines the request/notification strings and payload contracts the extension and server share for diagnostics workflows, including acknowledging findings, exporting summaries, updating LLM assessments, and reporting feed readiness.

### Notes
- Constants keep the bidirectional message surface deterministic for the language client while interfaces model the shape of acknowledgements, outstanding diagnostic summaries, and export payloads.
- `OutstandingDiagnosticSummary` carries both triggering/target artifact metadata and an optional `LlmAssessment`, mirroring what the server publishes and the extension renders in quick picks.
- Health reporting uses `FEEDS_READY_REQUEST` so the extension can gate UI on knowledge-feed readiness without inspecting internal telemetry structures directly.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.750Z","inputHash":"3bbee5eef2b54bf3"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ACKNOWLEDGE_DIAGNOSTIC_REQUEST`
- Type: const
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L3)

#### `AcknowledgeDiagnosticParams`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L5)

#### `AcknowledgeDiagnosticStatus`
- Type: type
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L11)

#### `AcknowledgeDiagnosticResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L13)

#### `DIAGNOSTIC_ACKNOWLEDGED_NOTIFICATION`
- Type: const
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L22)

#### `DiagnosticAcknowledgedPayload`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L24)

#### `RESET_DIAGNOSTIC_STATE_NOTIFICATION`
- Type: const
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L30)

#### `LIST_OUTSTANDING_DIAGNOSTICS_REQUEST`
- Type: const
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L32)

#### `DiagnosticArtifactSummary`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L34)

#### `OutstandingDiagnosticSummary`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L41)

#### `ListOutstandingDiagnosticsResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L55)

#### `SET_DIAGNOSTIC_ASSESSMENT_REQUEST`
- Type: const
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L60)

#### `SetDiagnosticAssessmentParams`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L62)

#### `SetDiagnosticAssessmentResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L67)

#### `EXPORT_DIAGNOSTICS_REQUEST`
- Type: const
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L73)

#### `ExportDiagnosticsResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L75)

#### `FEEDS_READY_REQUEST`
- Type: const
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L83)

#### `FeedsReadyResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L84)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`artifacts.LlmAssessment`](../domain/artifacts.ts.md#llmassessment) (type-only)
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
