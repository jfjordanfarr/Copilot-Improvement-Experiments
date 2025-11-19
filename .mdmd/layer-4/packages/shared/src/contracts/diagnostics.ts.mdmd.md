# packages/shared/src/contracts/diagnostics.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/contracts/diagnostics.ts
- Live Doc ID: LD-implementation-packages-shared-src-contracts-diagnostics-ts
- Generated At: 2025-11-19T15:01:34.636Z

## Authored
### Purpose
Collects the Live Diagnostics LSP contracts—acknowledgement, outstanding diagnostics, assessments, export, and feed readiness—added while delivering the acknowledgement service in [AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-21.SUMMARIZED.md#turn-20-implement-t043-acknowledgement-service-lines-4101-4585-continued](../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-21.SUMMARIZED.md#turn-20-implement-t043-acknowledgement-service-lines-4101-4585-continued).

### Notes
Feed readiness telemetry and export workflows extend these shapes; see [AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-22.SUMMARIZED.md#turn-06-better-sqlite3-rebuild-discipline--feed-readiness-lines-2801-3600](../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-22.SUMMARIZED.md#turn-06-better-sqlite3-rebuild-discipline--feed-readiness-lines-2801-3600) for the readiness gating and [AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-23.SUMMARIZED.md#turn-23-documentation-expansion-lines-2581-2700](../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-23.SUMMARIZED.md#turn-23-documentation-expansion-lines-2581-2700) for the drift-history acknowledgement hardening that depends on this contract.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-19T15:01:34.636Z","inputHash":"4550041eb4e6995f"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ACKNOWLEDGE_DIAGNOSTIC_REQUEST` {#symbol-acknowledge_diagnostic_request}
- Type: const
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L3)

#### `AcknowledgeDiagnosticParams` {#symbol-acknowledgediagnosticparams}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L5)

#### `AcknowledgeDiagnosticStatus` {#symbol-acknowledgediagnosticstatus}
- Type: type
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L11)

#### `AcknowledgeDiagnosticResult` {#symbol-acknowledgediagnosticresult}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L13)

#### `DIAGNOSTIC_ACKNOWLEDGED_NOTIFICATION` {#symbol-diagnostic_acknowledged_notification}
- Type: const
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L22)

#### `DiagnosticAcknowledgedPayload` {#symbol-diagnosticacknowledgedpayload}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L24)

#### `RESET_DIAGNOSTIC_STATE_NOTIFICATION` {#symbol-reset_diagnostic_state_notification}
- Type: const
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L30)

#### `LIST_OUTSTANDING_DIAGNOSTICS_REQUEST` {#symbol-list_outstanding_diagnostics_request}
- Type: const
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L32)

#### `DiagnosticArtifactSummary` {#symbol-diagnosticartifactsummary}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L34)

#### `OutstandingDiagnosticSummary` {#symbol-outstandingdiagnosticsummary}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L41)

#### `ListOutstandingDiagnosticsResult` {#symbol-listoutstandingdiagnosticsresult}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L55)

#### `SET_DIAGNOSTIC_ASSESSMENT_REQUEST` {#symbol-set_diagnostic_assessment_request}
- Type: const
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L60)

#### `SetDiagnosticAssessmentParams` {#symbol-setdiagnosticassessmentparams}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L62)

#### `SetDiagnosticAssessmentResult` {#symbol-setdiagnosticassessmentresult}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L67)

#### `EXPORT_DIAGNOSTICS_REQUEST` {#symbol-export_diagnostics_request}
- Type: const
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L73)

#### `ExportDiagnosticsResult` {#symbol-exportdiagnosticsresult}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L75)

#### `FEEDS_READY_REQUEST` {#symbol-feeds_ready_request}
- Type: const
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L83)

#### `FeedsReadyResult` {#symbol-feedsreadyresult}
- Type: interface
- Source: [source](../../../../../../packages/shared/src/contracts/diagnostics.ts#L84)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`artifacts.LlmAssessment`](../domain/artifacts.ts.mdmd.md#symbol-llmassessment) (type-only)
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
