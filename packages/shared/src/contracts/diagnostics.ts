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
