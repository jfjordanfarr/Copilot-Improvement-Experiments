# Data Model

## KnowledgeArtifact
- **Description**: Represents any markdown or code asset participating in drift monitoring.
- **Fields**:
  - `id` (UUID) – primary key.
  - `uri` (string) – canonical VS Code URI; unique.
  - `type` (enum: `vision`, `requirements`, `architecture`, `implementation`, `code`) – documentation layer or plain code module.
  - `language` (string) – detected language identifier when applicable.
  - `owner` (string, optional) – team or individual responsible.
  - `lastSynchronizedAt` (datetime, nullable) – most recent acknowledgement timestamp.
  - `hash` (string, nullable) – content fingerprint for drift detection.
  - `metadata` (JSON) – arbitrary attributes including inference provenance or user override markers.
- **Relationships**: One-to-many with `LinkRelationship` (as source or target); one-to-many with `ChangeEvent`; one-to-many with `DiagnosticRecord`.
- **Validation Rules**: `uri` required and unique; `type` required; `metadata` must stay under 32 KB to avoid storage bloat.

## LinkRelationship
- **Description**: Captures a directed association between artifacts (e.g., Requirements → Implementation).
- **Fields**:
  - `id` (UUID).
  - `sourceId` (UUID) – FK to `KnowledgeArtifact`.
  - `targetId` (UUID) – FK to `KnowledgeArtifact`.
  - `kind` (enum: `documents`, `implements`, `depends_on`, `references`).
  - `confidence` (decimal 0-1) – derived from provenance (parser vs. LLM).
  - `createdAt` (datetime).
  - `createdBy` (string) – subsystem that registered the link (user, config, inference).
- **Relationships**: Many-to-one to artifacts; referenced by `DiagnosticRecord` for context.
- **Validation Rules**: Prevent self-loop unless `kind=references`; enforce unique `(sourceId,targetId,kind)` tuple; `confidence` defaults to 1 for explicit links.

## ChangeEvent
- **Description**: Represents a tracked modification affecting an artifact.
- **Fields**:
  - `id` (UUID).
  - `artifactId` (UUID) – FK to `KnowledgeArtifact`.
  - `detectedAt` (datetime).
  - `summary` (string) – short change note or commit message snippet.
  - `changeType` (enum: `content`, `metadata`, `rename`, `delete`).
  - `ranges` (JSON array) – list of line-span objects `{startLine,endLine}`.
  - `provenance` (enum: `save`, `git`, `external`).
- **Relationships**: One-to-many with `DiagnosticRecord` (changes can trigger multiple diagnostics).
- **Validation Rules**: `ranges` required for `content` type; ensure `artifactId` points to existing artifact; cascade soft-delete if artifact removed.

## DiagnosticRecord
- **Description**: User-facing alert linking a triggering change to impacted artifacts.
- **Fields**:
  - `id` (UUID).
  - `artifactId` (UUID) – artifact receiving the diagnostic.
  - `triggerArtifactId` (UUID) – artifact that changed.
  - `message` (string) – localized explanation of required action.
  - `severity` (enum: `warning`, `info`, `hint`).
  - `status` (enum: `active`, `acknowledged`, `suppressed`).
  - `createdAt` (datetime).
  - `acknowledgedAt` (datetime, nullable).
  - `acknowledgedBy` (string, nullable).
  - `linkIds` (JSON array of UUIDs) – relationships involved in the alert.
  - `llmAssessment` (JSON, optional) – structured reasoning outcome when LLM involved (confidence, recommended actions).
- **Relationships**: Many-to-one to both triggering and recipient artifacts; optional link references.
- **Validation Rules**: `status` transitions must follow `active → acknowledged/suppressed`; `llmAssessment` stored only when provider consent enabled; ensure `acknowledgedBy` present when status acknowledged.

## KnowledgeSnapshot
- **Description**: Canonical benchmark capture representing expected graph state for reproducibility checks.
- **Fields**:
  - `id` (UUID).
  - `label` (string) – descriptive name (e.g., `sample-monorepo-v1`).
  - `createdAt` (datetime).
  - `artifactCount` (integer) – total artifacts included in the snapshot.
  - `edgeCount` (integer) – total relationships recorded.
  - `payloadHash` (string) – checksum of serialized nodes/edges for drift detection.
  - `metadata` (JSON) – optional notes such as source repo commit or model version.
- **Relationships**: Used by telemetry to compare current graph runs; no direct FK usage but stored alongside metrics.
- **Validation Rules**: Hash must be deterministic across rebuilds; metadata limited to 16 KB.

## AcknowledgementAction
- **Description**: Audit entry capturing manual follow-up or dismissal of a diagnostic.
- **Fields**:
  - `id` (UUID).
  - `diagnosticId` (UUID) – FK to `DiagnosticRecord`.
  - `actor` (string).
  - `action` (enum: `acknowledge`, `dismiss`, `reopen`).
  - `notes` (string, optional).
  - `timestamp` (datetime).
- **Relationships**: Many-to-one with diagnostics.
- **Validation Rules**: Enforce chronological order, ensure `action=reopen` only valid when diagnostic previously acknowledged/suppressed.

## DriftHistoryEntry
- **Description**: Append-only log correlating diagnostic lifecycle events with change provenance for reporting and restart resilience.
- **Fields**:
  - `id` (UUID).
  - `diagnosticId` (UUID) – FK to `DiagnosticRecord`.
  - `changeEventId` (UUID) – FK to `ChangeEvent`.
  - `triggerArtifactId` (UUID) – FK to `KnowledgeArtifact` (source of the ripple).
  - `targetArtifactId` (UUID) – FK to `KnowledgeArtifact` (recipient of the diagnostic).
  - `status` (enum: `emitted`, `acknowledged`).
  - `severity` (enum matching `DiagnosticSeverity`).
  - `recordedAt` (datetime).
  - `actor` (string, optional) – populated for acknowledgement entries.
  - `notes` (string, optional) – acknowledgement notes snapshot.
  - `metadata` (JSON, optional) – snapshot of link IDs or additional context.
- **Relationships**: Many-to-one with diagnostics and change events; aggregated for reporting by artifact or change series.
- **Validation Rules**: Append-only (no updates after insert); ensure acknowledgement entries reference an existing `emitted` entry; `metadata` size bounded to 8 KB.

## Implementation Traceability
- [`packages/shared/src/domain/artifacts.ts`](../../packages/shared/src/domain/artifacts.ts) defines the TypeScript contracts for every entity documented here.
- [`packages/shared/src/db/graphStore.ts`](../../packages/shared/src/db/graphStore.ts) persists artifacts, links, and change events in SQLite.
- [`packages/server/src/features/changeEvents/saveDocumentChange.ts`](../../packages/server/src/features/changeEvents/saveDocumentChange.ts) and [`saveCodeChange.ts`](../../packages/server/src/features/changeEvents/saveCodeChange.ts) emit the `ChangeEvent` records that feed this model.
- [`tests/integration/us3/acknowledgeDiagnostics.test.ts`](../../tests/integration/us3/acknowledgeDiagnostics.test.ts) and [`tests/integration/us5/transformRipple.test.ts`](../../tests/integration/us5/transformRipple.test.ts) assert the runtime behaviours tied to `DiagnosticRecord` and ripple history.
