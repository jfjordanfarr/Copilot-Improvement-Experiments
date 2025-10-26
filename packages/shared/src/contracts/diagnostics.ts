import type { LlmAssessment } from "../domain/artifacts";

export const ACKNOWLEDGE_DIAGNOSTIC_REQUEST = "linkDiagnostics/diagnostics/acknowledge";

export interface AcknowledgeDiagnosticParams {
  diagnosticId: string;
  actor: string;
  notes?: string;
}

export type AcknowledgeDiagnosticStatus = "acknowledged" | "already_acknowledged" | "not_found";

export interface AcknowledgeDiagnosticResult {
  status: AcknowledgeDiagnosticStatus;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  recordId?: string;
  targetUri?: string;
  triggerUri?: string;
}

export const DIAGNOSTIC_ACKNOWLEDGED_NOTIFICATION = "linkDiagnostics/diagnostics/acknowledged";

export interface DiagnosticAcknowledgedPayload {
  recordId: string;
  targetUri?: string;
  triggerUri?: string;
}

export const LIST_OUTSTANDING_DIAGNOSTICS_REQUEST = "linkDiagnostics/diagnostics/list";

export interface DiagnosticArtifactSummary {
  id: string;
  uri?: string;
  layer?: string;
  language?: string;
}

export interface OutstandingDiagnosticSummary {
  recordId: string;
  message: string;
  severity: "warning" | "info" | "hint";
  changeEventId: string;
  createdAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  linkIds: string[];
  target?: DiagnosticArtifactSummary;
  trigger?: DiagnosticArtifactSummary;
  llmAssessment?: LlmAssessment;
}

export interface ListOutstandingDiagnosticsResult {
  generatedAt: string;
  diagnostics: OutstandingDiagnosticSummary[];
}

export const SET_DIAGNOSTIC_ASSESSMENT_REQUEST = "linkDiagnostics/diagnostics/setAssessment";

export interface SetDiagnosticAssessmentParams {
  diagnosticId: string;
  assessment?: LlmAssessment;
}

export interface SetDiagnosticAssessmentResult {
  diagnosticId: string;
  updatedAt: string;
  assessment?: LlmAssessment;
}

export const EXPORT_DIAGNOSTICS_REQUEST = "linkDiagnostics/diagnostics/export";

export interface ExportDiagnosticsResult {
  generatedAt: string;
  format: "markdown" | "json";
  content: string;
  total: number;
}

// Health/ready signals
export const FEEDS_READY_REQUEST = "linkDiagnostics/feeds/ready";
export interface FeedsReadyResult {
  ready: boolean;
  configuredFeeds: number;
  healthyFeeds: number;
}
