# Knowledge Graph Ingestion Architecture (Layer 3)

## Purpose & Scope

Establish the server-side pipeline that ingests external knowledge-graph data and folds it into the unified dependency graph that powers diagnostics. The architecture covers KnowledgeSnapshot imports, streaming delta feeds, validation, persistence, and their interaction with the link inference orchestrator. This design satisfies [FR-015](../../specs/001-link-aware-diagnostics/spec.md#functional-requirements) and [FR-016](../../specs/001-link-aware-diagnostics/spec.md#functional-requirements) in the feature spec and sets the stage for [T040](../../specs/001-link-aware-diagnostics/tasks.md) / [T041](../../specs/001-link-aware-diagnostics/tasks.md). Upcoming LLM-driven ingestion described in [LLM Ingestion Pipeline](./llm-ingestion-pipeline.mdmd.md) complements, rather than replaces, these external feeds by supplying additional edges that still flow through the same validation/persistence stack.

## Key Responsibilities

- **Feed coordination**: discover, configure, and lifecycle-manage snapshot + streaming feeds that describe cross-artifact relationships.
- **Schema enforcement**: validate every payload against the shared contract before mutating the graph store.
- **Persistence**: project valid artifacts/links into SQLite through the existing `GraphStore` so downstream consumers see a consistent view.
- **Runtime availability**: surface ingestion failures as diagnostics/logs while allowing the system to fall back to local inference.
- **Provider bridge**: make accepted knowledge feeds available to the `LinkInferenceOrchestrator` as `KnowledgeFeed` inputs so inference can blend external edges with workspace signals.

## Architectural Components

| Component | Location | Role |
|-----------|----------|------|
| **KnowledgeFeedManager** | `packages/server/src/features/knowledge/knowledgeFeedManager.ts` | Owns feed configuration, schedules snapshot pulls, subscribes to streaming deltas, and coordinates validation + persistence per [plan.md §Phases 3–4](../../specs/001-link-aware-diagnostics/plan.md#phases--key-deliverables).
| **KnowledgeGraphIngestor** | `packages/server/src/features/knowledge/knowledgeGraphIngestor.ts` | Wraps the shared `KnowledgeGraphBridge`, runs validations, and updates the graph store/checkpoints; emits diagnostics/events for failures. Aligns with [research.md §Knowledge-Graph Schema Contract](../../specs/001-link-aware-diagnostics/research.md#knowledge-graph-schema-contract).
| **SchemaValidator** | `packages/server/src/features/knowledge/schemaValidator.ts` | Already enforces the contract – reused by the ingestor before committing data ([T056](../../specs/001-link-aware-diagnostics/tasks.md)).
| **FeedDiagnosticsGateway** | `packages/server/src/features/knowledge/feedDiagnostics.ts` | Emits warning diagnostics or console telemetry when feeds degrade or recover, supporting [FR-015](../../specs/001-link-aware-diagnostics/spec.md#functional-requirements) resilience requirements.
| **Runtime Wiring** | `packages/server/src/main.ts` | Instantiates the manager, registers it with the artifact watcher (so accepted feeds appear in orchestrator runs), and handles shutdown per [plan.md §Runtime Wiring](../../specs/001-link-aware-diagnostics/plan.md#phases--key-deliverables).

## Data Flow

1. **Configuration load**: During server initialize, `KnowledgeFeedManager` reads workspace settings (later: VS Code configuration, env, or spec fixture) to determine active feeds ([spec.md §Graph Rebuild Lifecycle](../../specs/001-link-aware-diagnostics/spec.md#graph-rebuild-lifecycle)).
2. **Snapshot bootstrap**: For each feed with a snapshot source, the manager requests the payload, `KnowledgeGraphIngestor` validates via `SchemaValidator`, then projects it into SQLite (`GraphStore.upsertArtifact`, `GraphStore.upsertLink`, `GraphStore.storeSnapshot`). Checkpoints store snapshot metadata for audit, matching the requirements in [research.md §Feed Resilience Strategy](../../specs/001-link-aware-diagnostics/research.md#feed-resilience-strategy).
3. **Stream subscription**: For feeds with streaming sources, the manager obtains an async iterator of events. Each event is validated and then applied via the ingestor (`KnowledgeGraphBridge.applyStreamEvent`). The ingestor keeps a checkpoint (`lastSequenceId`) for replay, per [research.md §GitLab Knowledge Graph Integration](../../specs/001-link-aware-diagnostics/research.md#gitlab-knowledge-graph-gkg-integration).
4. **Inference exposure**: On successful ingestion, the manager refreshes the `KnowledgeFeed[]` it exposes to `ArtifactWatcher.setKnowledgeFeeds`. Subsequent inference runs receive the new edges and satisfy the integration expectations in [plan.md §Phase 3 – User Story 1](../../specs/001-link-aware-diagnostics/plan.md#phase-3--user-story-1---developers-see-code-change-impact-priority-p1).
5. **Failure handling**: Validation or transport errors trigger warnings through `FeedDiagnosticsGateway` and mark the feed as degraded. While degraded, the `KnowledgeFeed` descriptor is withheld so inference falls back to workspace-only signals. Recovery clears the warning and re-exposes the feed, fulfilling [spec.md §Edge Cases](../../specs/001-link-aware-diagnostics/spec.md#edge-cases) coverage.

## Interactions & Dependencies

- **With ArtifactWatcher**: The watcher queries `KnowledgeFeedManager` for currently healthy feeds and passes them into the orchestrator, complementing the workspace providers defined in [T028](../../specs/001-link-aware-diagnostics/tasks.md).
- **With LinkInferenceOrchestrator**: The orchestrator already understands snapshot + stream sources described in [linkInference.ts design](../../packages/shared/src/inference/linkInference.ts) and simply consumes the manager-provided descriptors.
- **With Provider Guard**: Feed polling respects `ProviderGuard` settings (e.g., diagnostics disabled) but still updates the graph for future use, consistent with [spec.md §Requirements FR-010](../../specs/001-link-aware-diagnostics/spec.md#functional-requirements).
- **With Diagnostics Publishing**: Feed health warnings appear as diagnostics or connection console entries to keep operators informed without blocking core flows, tying into the documentation drift workflows in [spec.md §User Story 2](../../specs/001-link-aware-diagnostics/spec.md#user-story-2---writers-get-drift-alerts-priority-p2).

## Failure Modes & Recovery

| Failure | Detection | Recovery Strategy | Spec Reference |
|---------|-----------|-------------------|----------------|
| Snapshot schema violation | `SchemaValidator` rejects payload | Skip application, emit diagnostic, retain previous snapshot | [FR-016](../../specs/001-link-aware-diagnostics/spec.md#functional-requirements) |
| Stream event out of order/missing artifacts | Validation failure in ingestor | Log + diagnostic; request snapshot refresh on next cycle | [Research – Feed Resilience](../../specs/001-link-aware-diagnostics/research.md#feed-resilience-strategy) |
| Network error fetching snapshot/stream | Transport exception | Mark feed degraded, retry with exponential backoff, rely on fallback inference | [Research – Feed Resilience](../../specs/001-link-aware-diagnostics/research.md#feed-resilience-strategy) |
| Checkpoint loss (e.g., storage reset) | Missing checkpoint file | Re-run full snapshot ingest and rebuild from scratch | [Spec – Graph Rebuild Lifecycle](../../specs/001-link-aware-diagnostics/spec.md#graph-rebuild-lifecycle) |

## Observability

- Console logs for ingest lifecycle (start, success, failure, retry)
- Diagnostics surfaced through `FeedDiagnosticsGateway` when a feed is degraded for more than one attempt
- Structured events (later) for telemetry (feed latency, edge counts)

## Open Questions / Follow-up

- Configuration surface for feed URLs/tokens (initially hard-coded; will migrate to user settings in later task).
- Backoff strategy tuning (constants vs. configurable).
- Multi-feed prioritization (merging edges from multiple sources).
- Integration tests to simulate degraded feeds and confirm diagnostics.
