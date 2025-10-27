# Diagnostic Contracts (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/contracts/diagnostics.ts`](../../../packages/shared/src/contracts/diagnostics.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md)

## Exported Symbols

#### ACKNOWLEDGE_DIAGNOSTIC_REQUEST
`ACKNOWLEDGE_DIAGNOSTIC_REQUEST` identifies the LSP request that acknowledges drift diagnostics.

#### AcknowledgeDiagnosticParams
`AcknowledgeDiagnosticParams` carries the diagnostic id plus actor metadata when recording acknowledgements.

#### AcknowledgeDiagnosticStatus
`AcknowledgeDiagnosticStatus` enumerates acknowledgement outcomes (acknowledged, already_acknowledged, not_found).

#### AcknowledgeDiagnosticResult
`AcknowledgeDiagnosticResult` reports the acknowledgement status, target identifiers, and timestamps back to the client.

#### DIAGNOSTIC_ACKNOWLEDGED_NOTIFICATION
`DIAGNOSTIC_ACKNOWLEDGED_NOTIFICATION` is the server-to-client notification sent once a diagnostic acknowledgement is recorded.

#### DiagnosticAcknowledgedPayload
`DiagnosticAcknowledgedPayload` contains the drift history record id and affected artifact URIs for acknowledgement notifications.

#### LIST_OUTSTANDING_DIAGNOSTICS_REQUEST
`LIST_OUTSTANDING_DIAGNOSTICS_REQUEST` triggers the server to enumerate unresolved diagnostics for the summary panel.

#### DiagnosticArtifactSummary
`DiagnosticArtifactSummary` describes the minimal artifact metadata embedded within outstanding diagnostic entries.

#### OutstandingDiagnosticSummary
`OutstandingDiagnosticSummary` is the primary DTO surfaced to the extension, including severity, triggers, targets, link ids, and optional LLM assessments.

#### ListOutstandingDiagnosticsResult
`ListOutstandingDiagnosticsResult` wraps the outstanding diagnostic list with a generation timestamp for caching.

#### SET_DIAGNOSTIC_ASSESSMENT_REQUEST
`SET_DIAGNOSTIC_ASSESSMENT_REQUEST` names the LSP request used to record AI-powered assessments on diagnostics.

#### SetDiagnosticAssessmentParams
`SetDiagnosticAssessmentParams` contains the diagnostic id plus optional assessment payload the client submits.

#### SetDiagnosticAssessmentResult
`SetDiagnosticAssessmentResult` echoes the diagnostic id and the updated assessment metadata once persisted.

#### EXPORT_DIAGNOSTICS_REQUEST
`EXPORT_DIAGNOSTICS_REQUEST` initiates a report generation run that serialises diagnostics into markdown or JSON.

#### ExportDiagnosticsResult
`ExportDiagnosticsResult` wraps the generated report text, format, timestamp, and total diagnostic count.

#### FEEDS_READY_REQUEST
`FEEDS_READY_REQUEST` lets the client poll whether knowledge feeds have initialised.

#### FeedsReadyResult
`FeedsReadyResult` reports whether feeds are ready along with counts for configured and healthy feeds.

## Responsibility
Define the diagnostic-related request/response pairs so the server and extension maintain a consistent contract for acknowledging, listing, exporting, and annotating ripple diagnostics.

## Evidence
- Extension surfaces such as the diagnostics tree view and acknowledgement quick pick depend on these contracts (see [`packages/extension/src/views/diagnosticsTree.ts`](../../../packages/extension/src/views/diagnosticsTree.ts) and [`packages/extension/src/diagnostics/dependencyQuickPick.ts`](../../../packages/extension/src/diagnostics/dependencyQuickPick.ts)).
