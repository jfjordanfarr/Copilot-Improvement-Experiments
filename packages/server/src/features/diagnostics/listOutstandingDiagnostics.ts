import {
  type DiagnosticRecord,
  type GraphStore,
  type ListOutstandingDiagnosticsResult,
  type OutstandingDiagnosticSummary,
  type KnowledgeArtifact
} from "@copilot-improvement/shared";

export function buildOutstandingDiagnosticsResult(
  records: DiagnosticRecord[],
  store: GraphStore,
  now: () => Date = () => new Date()
): ListOutstandingDiagnosticsResult {
  const diagnostics = records.map(record => mapOutstandingDiagnostic(record, store));

  return {
    generatedAt: now().toISOString(),
    diagnostics
  } satisfies ListOutstandingDiagnosticsResult;
}

export function mapOutstandingDiagnostic(
  record: DiagnosticRecord,
  store: GraphStore
): OutstandingDiagnosticSummary {
  const targetArtifact = record.artifactId ? store.getArtifactById(record.artifactId) : undefined;
  const triggerArtifact = record.triggerArtifactId
    ? store.getArtifactById(record.triggerArtifactId)
    : undefined;

  return {
    recordId: record.id,
    message: record.message,
    severity: record.severity,
    changeEventId: record.changeEventId,
    createdAt: record.createdAt,
    acknowledgedAt: record.acknowledgedAt,
    acknowledgedBy: record.acknowledgedBy,
    linkIds: record.linkIds,
    target: mapArtifactSummary(targetArtifact),
    trigger: mapArtifactSummary(triggerArtifact),
    llmAssessment: record.llmAssessment
  } satisfies OutstandingDiagnosticSummary;
}

function mapArtifactSummary(
  artifact: KnowledgeArtifact | undefined
): OutstandingDiagnosticSummary["target"] {
  if (!artifact) {
    return undefined;
  }

  return {
    id: artifact.id,
    uri: artifact.uri,
    layer: artifact.layer,
    language: artifact.language
  };
}
