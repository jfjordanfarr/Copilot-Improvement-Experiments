export type ArtifactLayer =
  | "vision"
  | "requirements"
  | "architecture"
  | "implementation"
  | "code";

export interface KnowledgeArtifact {
  id: string;
  uri: string;
  layer: ArtifactLayer;
  language?: string;
  owner?: string;
  lastSynchronizedAt?: string;
  hash?: string;
  metadata?: Record<string, unknown>;
}

export type LinkRelationshipKind =
  | "documents"
  | "implements"
  | "depends_on"
  | "references";

export interface LinkRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  kind: LinkRelationshipKind;
  confidence: number;
  createdAt: string;
  createdBy: string;
}

export type LlmConfidenceTier = "high" | "medium" | "low";

export interface LlmEdgeProvenance {
  linkId: string;
  templateId: string;
  templateVersion: string;
  promptHash: string;
  modelId: string;
  issuedAt: string;
  createdAt: string;
  confidenceTier: LlmConfidenceTier;
  calibratedConfidence: number;
  rawConfidence?: number;
  supportingChunks?: string[];
  rationale?: string;
  diagnosticsEligible?: boolean;
  shadowed?: boolean;
  promotionCriteria?: string[];
}

export type ChangeEventType = "content" | "metadata" | "rename" | "delete";

export type ChangeEventProvenance = "save" | "git" | "external";

export interface ChangeEventRange {
  startLine: number;
  endLine: number;
}

export interface ChangeEvent {
  id: string;
  artifactId: string;
  detectedAt: string;
  summary: string;
  changeType: ChangeEventType;
  ranges: ChangeEventRange[];
  provenance: ChangeEventProvenance;
}

export type DiagnosticSeverity = "warning" | "info" | "hint";

export type DiagnosticStatus = "active" | "acknowledged" | "suppressed";

export interface DiagnosticRecord {
  id: string;
  artifactId: string;
  triggerArtifactId: string;
  changeEventId: string;
  message: string;
  severity: DiagnosticSeverity;
  status: DiagnosticStatus;
  createdAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  linkIds: string[];
  llmAssessment?: Record<string, unknown>;
}

export interface KnowledgeSnapshot {
  id: string;
  label: string;
  createdAt: string;
  artifactCount: number;
  edgeCount: number;
  payloadHash: string;
  metadata?: Record<string, unknown>;
}

export type AcknowledgementActionType = "acknowledge" | "dismiss" | "reopen";

export interface AcknowledgementAction {
  id: string;
  diagnosticId: string;
  actor: string;
  action: AcknowledgementActionType;
  notes?: string;
  timestamp: string;
}

export type DriftHistoryStatus = "emitted" | "acknowledged";

export interface DriftHistoryEntry {
  id: string;
  diagnosticId: string;
  changeEventId: string;
  triggerArtifactId: string;
  targetArtifactId: string;
  status: DriftHistoryStatus;
  severity: DiagnosticSeverity;
  recordedAt: string;
  actor?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}
