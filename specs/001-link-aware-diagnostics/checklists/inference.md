# Checklist: Inference & Knowledge Graph Requirements

**Purpose**: Self-check for author to validate requirements covering auto-inferred links, cache rebuilds, and knowledge-graph integration.
**Created**: 2025-10-16

## Requirement Completeness
- [x] CHK001 Are all inference data sources (language-server symbols, references, diagnostics, external graphs) explicitly enumerated for each artifact type? [Completeness, Spec §FR-001; Research §Link Establishment Strategy]
- [x] CHK002 Is the full lifecycle for rebuilding the link graph (initial startup, cache deletion, stale data detection) described end-to-end? [Completeness, Research §Graph Rebuild & Freshness; Plan §Phase 2]
- [x] CHK003 Do requirements specify how manual overrides coexist with auto-inferred relationships, including persistence and precedence rules? [Completeness, Spec §FR-001; Quickstart §Configuration]

## Requirement Clarity
- [x] CHK004 Is the "workspace index data" term broken down into precise provider calls or API contracts so implementers know what must be queried? [Clarity, Spec §FR-001; Research §Symbol Ingestion Strategy]
- [x] CHK005 Are knowledge-graph feeds defined with expected schema/format and scope (e.g., GitLab GKG vs. LSIF) to avoid ambiguity? [Clarity, Spec §FR-014; Plan §Phase 0]
- [x] CHK006 Are override commands documented with user-facing naming, trigger conditions, and resulting state changes? [Clarity, Tasks §T027; Quickstart §Configuration]

## Requirement Consistency
- [x] CHK007 Do plan phases, tasks, and quickstart instructions all agree that link inference is automatic by default with optional overrides? [Consistency, Plan §Summary; Tasks §T028; Quickstart §Configuration]
- [x] CHK008 Are consent gating requirements aligned so diagnostics remain disabled until provider selection, including when inference runs headless? [Consistency, Spec §FR-010; Plan §Phase 3; Tasks §T018–T019]

## Acceptance Criteria Quality
- [x] CHK009 Do success criteria or metrics quantify inference accuracy or rebuild latency to prove SC-001/SC-005 are met? [Acceptance Criteria, Spec §Success Criteria]

## Scenario Coverage
- [x] CHK011 Are workflows described for importing external knowledge-graph snapshots on-demand vs. streaming updates? [Coverage, Spec §FR-014; Plan §Phase 4]
- [x] CHK012 Are failure behaviors defined when knowledge-graph feeds are unreachable, stale, or return partial data? [Edge Case, Spec §Edge Cases; Tasks §T040–T041]
- [x] CHK013 Is there guidance on resolving conflicts between inferred links and manual overrides (e.g., tie-breakers, audit trail)? [Edge Case, Spec §FR-001; Tasks §T027]

## Non-Functional Requirements
- [x] CHK014 Are performance targets for inference runs (e.g., debounce window, rebuild duration) measurable and tied to plan or success criteria? [Non-Functional, Spec §FR-012; Plan §Performance Goals]

## Dependencies & Assumptions
- [x] CHK015 Are assumptions about external knowledge graphs (availability, authentication, update cadence) captured and validated? [Dependencies, Spec §Assumptions; Research §Workspace Indexing]

## Ambiguities & Conflicts
- [x] CHK016 Are there unresolved ambiguities around cache storage location, retention, or privacy that need clarification before implementation? [Ambiguity, Spec §FR-010; Quickstart §Configuration]

## Implementation Traceability
- [`packages/server/src/runtime/changeProcessor.ts`](../../packages/server/src/runtime/changeProcessor.ts) owns the inference merge pipeline referenced throughout this checklist.
- [`packages/server/src/runtime/knowledgeFeeds.ts`](../../packages/server/src/runtime/knowledgeFeeds.ts) wires knowledge-feed ingestion for snapshot and streaming scenarios.
- [`packages/server/src/features/knowledge/knowledgeFeedManager.ts`](../../packages/server/src/features/knowledge/knowledgeFeedManager.ts) and [`knowledgeGraphIngestor.ts`](../../packages/server/src/features/knowledge/knowledgeGraphIngestor.ts) enforce the availability and validation requirements covered above.
- [`tests/integration/us5/transformRipple.test.ts`](../../tests/integration/us5/transformRipple.test.ts) proves the ripple inference behaviours this checklist guards.
