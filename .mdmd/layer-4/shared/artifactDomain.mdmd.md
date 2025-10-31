# Artifact Domain Types

## Metadata
- Layer: 4
- Code Path: [`packages/shared/src/domain/artifacts.ts`](../../../packages/shared/src/domain/artifacts.ts)
- Exports: ArtifactLayer, KnowledgeArtifact, LinkRelationship, LinkRelationshipKind, ChangeEvent, ChangeEventType, ChangeEventProvenance, ChangeEventRange, DiagnosticRecord, DiagnosticSeverity, DiagnosticStatus, LlmConfidenceTier, LlmEdgeProvenance, LlmModelMetadata, LlmAssessment, KnowledgeSnapshot, AcknowledgementActionType, AcknowledgementAction, DriftHistoryStatus, DriftHistoryEntry
- Parent design: [Knowledge Graph Ingestion Architecture](../../layer-3/knowledge-graph-ingestion.mdmd.md)

## Purpose
Define the shared domain model for knowledge artifacts, relationships, change events, diagnostics, and LLM provenance so both the server and extension operate against the same TypeScript types.

## Public Symbols

### ArtifactLayer
Enumerates the supported documentation/code layers and enables runtime checks for layer-aware features.

### KnowledgeArtifact
Canonical representation of a graph artifact (id, uri, layer, metadata) persisted by `GraphStore` and consumed across inference, diagnostics, and auditing flows.

### LinkRelationship
Describes stored graph edges, capturing relationship kind, direction, confidence, and related artifact identifiers.

### LinkRelationshipKind
Lists the graph relationship kinds (`documents`, `implements`, `depends_on`, `references`) referenced throughout rule engines and diagnostics.

### ChangeEvent
Persists change metadata (artifact id, summary, timestamps, provenance) for ripple analysis and acknowledgement workflows.

### ChangeEventType
Enumerates the types of changes (`content`, `metadata`, `rename`, `delete`) recorded in change events.

### ChangeEventProvenance
Indicates how a change originated (manual save, git sync, external import) to support audit trails.

### ChangeEventRange
Stores optional line-span ranges associated with a change event for richer diagnostics.

### DiagnosticRecord
Primary persistence payload for diagnostics, including status, severity, related artifact ids, and optional LLM assessments.

### DiagnosticSeverity
Enum-like type that mirrors VS Code diagnostic severities while remaining extension-agnostic.

### DiagnosticStatus
Lifecycle state of a diagnostic (`active`, `acknowledged`, `suppressed`), used by acknowledgement services.

### LlmConfidenceTier
Bucketed confidence tiers powering telemetry aggregation and downstream heuristics.

### LlmEdgeProvenance
Metadata block describing how an LLM produced a relationship, including model info, supporting text, and rationale.

### LlmModelMetadata
Captures identifying information about the model (provider, family, version) responsible for an assessment or link.

### LlmAssessment
Stores structured AI assessments attached to diagnostics, including conclusions, suggested actions, and provenance.

### KnowledgeSnapshot
Summarises persisted graph snapshot metrics, enabling diffing and telemetry across runs.

### AcknowledgementActionType
Enumerates acknowledgement operations (`acknowledge`, `dismiss`, `reopen`) recorded in drift history.

### AcknowledgementAction
Stores acknowledgement actor, timestamp, action type, and optional notes for auditing and UI replay.

### DriftHistoryStatus
Lifecycle status applied to drift history entries (`emitted`, `acknowledged`).

### DriftHistoryEntry
Represents individual drift history records, including status, actor context, severity, and snapshot of related diagnostics.

## Evidence
- Referenced extensively across server features (`changeProcessor`, `driftHistoryStore`, `acknowledgementService`) and documented in their respective Layer-4 MDMD files.
