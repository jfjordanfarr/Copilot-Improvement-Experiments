# Artifact Domain Types (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/domain/artifacts.ts`](../../../packages/shared/src/domain/artifacts.ts)
- Parent design: [Knowledge Graph Ingestion Architecture](../../layer-3/knowledge-graph-ingestion.mdmd.md)

## Exported Symbols

#### ArtifactLayer
`ArtifactLayer` enumerates the five supported documentation/code layers used across the graph.

#### LinkRelationshipKind
`LinkRelationshipKind` lists the graph relationship kinds (`documents`, `implements`, `depends_on`, `references`).

#### LlmConfidenceTier
`LlmConfidenceTier` defines bucketed confidence tiers used when calibrating LLM-derived links.

#### LlmEdgeProvenance
`LlmEdgeProvenance` records metadata about an LLM-generated link, including template details, confidences, supporting chunks, and promotion flags.

#### ChangeEventType
`ChangeEventType` captures how an artifact changed (`content`, `metadata`, `rename`, `delete`).

#### ChangeEventProvenance
`ChangeEventProvenance` indicates where a change originated (`save`, `git`, `external`).

#### ChangeEventRange
`ChangeEventRange` stores the line-span ranges associated with a change event.

#### DiagnosticStatus
`DiagnosticStatus` enumerates diagnostic lifecycle states (`active`, `acknowledged`, `suppressed`).

#### LlmModelMetadata
`LlmModelMetadata` holds descriptive fields about the model producing an assessment.

#### LlmAssessment
`LlmAssessment` captures AI assessment summaries, confidence, recommended actions, and associated model metadata.

#### KnowledgeSnapshot
`KnowledgeSnapshot` summarises persisted graph snapshots with artifact/link counts and metadata hashes.

#### AcknowledgementActionType
`AcknowledgementActionType` enumerates possible acknowledgement actions (`acknowledge`, `dismiss`, `reopen`).

#### AcknowledgementAction
`AcknowledgementAction` records who performed an acknowledgement action, when, and with optional notes.

#### DriftHistoryStatus
`DriftHistoryStatus` enumerates drift lifecycle states (`emitted`, `acknowledged`).

#### DriftHistoryEntry
`DriftHistoryEntry` stores individual drift history records with severity, actor notes, and metadata.

## Responsibility
Define the shared domain model for knowledge artifacts, relationships, change events, diagnostics, and LLM provenance so both the server and extension operate against the same TypeScript types.

## Evidence
- Referenced extensively across server features (`changeProcessor`, `driftHistoryStore`, `acknowledgementService`) and documented in their respective Layer-4 MDMD files.
