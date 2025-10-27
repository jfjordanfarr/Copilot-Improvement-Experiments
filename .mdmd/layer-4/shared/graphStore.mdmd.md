# GraphStore (Layer 4)

**Created:** 2025-10-16 *(from git history)*  
**Last Edited:** 2025-10-26

## Source Mapping
- Implementation: [`packages/shared/src/db/graphStore.ts`](../../../packages/shared/src/db/graphStore.ts)
- Tests: [`packages/shared/src/db/graphStore.test.ts`](../../../packages/shared/src/db/graphStore.test.ts)
- Consumer highlights: language server `main.ts`, diagnostics subsystems, dependency traversal (`symbolNeighbors.ts`), ripple analyzer, maintenance routines
- Parent designs: [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md), [Knowledge Graph Ingestion Architecture](../../layer-3/knowledge-graph-ingestion.mdmd.md)
- Spec references: [FR-001](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-017](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T001–T005](../../../specs/001-link-aware-diagnostics/tasks.md)

## Exported Symbols

#### GraphStoreOptions
`GraphStoreOptions` carries the absolute SQLite database path supplied when constructing a `GraphStore` instance.

#### LinkedArtifactSummary
`LinkedArtifactSummary` summarises neighbours returned by `listLinkedArtifacts`, including direction and link confidence.

#### DriftHistorySummary
`DriftHistorySummary` aggregates acknowledgement counts and timestamps for a change event, powering drift dashboards.

#### ListDriftHistoryOptions
`ListDriftHistoryOptions` filters drift history queries by change event, target artifact, diagnostic id, status, or result limits.

## Purpose
`GraphStore` is the single SQLite-backed persistence layer for the knowledge graph. Every feature that inspects relationships between artifacts depends on this abstraction for durable reads/writes, so the file exists to encapsulate schema bootstrapping, migrations, and high-level query helpers in one place.

## Responsibilities
- Initialise and maintain the SQLite schema (`artifacts`, `links`, `diagnostics`, drift history, etc.) without external tooling.
- Provide CRUD operations for artifacts, links, diagnostics, change events, and drift history records.
- Expose traversal helpers such as `listLinkedArtifacts`, now including per-link `confidence`, direction, and normalized artifact payloads for BFS-style consumers.
- Enforce database constraints (conflict resolution, JSON serialization) and consistent error handling across server features.

## Public Interfaces
- Constructor: `new GraphStore({ dbPath })` bootstraps the database and ensures migrations are applied.
- Artifact APIs: `upsertArtifact`, `removeArtifact`, `getArtifactById/Uri`, `listArtifacts`.
- Link APIs: `upsertLink`, `removeLink`, `listLinkedArtifacts` (returns `LinkedArtifactSummary` with `linkId`, `kind`, **`confidence`**, direction, and neighbor artifact).
- Diagnostics/Telemetry APIs: helpers for change events, drift history, acknowledgements, summary queries, and LLM assessment persistence/upserts.
- Internal utilities: row mappers (`mapArtifactRow`, etc.) translating raw SQLite rows into domain objects.

## Recent Changes
- Added `updateDiagnosticAssessment` helper plus JSON column plumbing so server and extension flows can set/clear `LlmAssessment` payloads without rewriting entire diagnostic records.
- `LinkedArtifactSummary` and underlying SQL now surface `confidence` values so traversal code can rank neighbors by strength. Any consumer relying on `listLinkedArtifacts` should prefer the new field instead of re-querying the `links` table.

## Key Collaborators
- Server features under `packages/server/src/features/**` rely on `GraphStore` for persistence.
- Extension-side experiences consume projections generated from GraphStore-derived data via LSP requests.
- Migration scripts in `data/migrations` define the schema that GraphStore expects; the store enforces these assumptions at runtime.

## Testing
`GraphStore` is exercised extensively through higher-level suites that run against an in-memory database to ensure query semantics remain intact:
- Diagnostics: [`packages/server/src/features/diagnostics/acknowledgementService.test.ts`](../../../packages/server/src/features/diagnostics/acknowledgementService.test.ts), [`listOutstandingDiagnostics.test.ts`](../../../packages/server/src/features/diagnostics/listOutstandingDiagnostics.test.ts)
- Dependencies: [`packages/server/src/features/dependencies/inspectDependencies.test.ts`](../../../packages/server/src/features/dependencies/inspectDependencies.test.ts), [`symbolNeighbors.test.ts`](../../../packages/server/src/features/dependencies/symbolNeighbors.test.ts)
- Knowledge ingestion: [`knowledgeGraphIngestor.test.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.test.ts), [`knowledgeGraphBridge.test.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphBridge.test.ts), [`knowledgeFeedManager.test.ts`](../../../packages/server/src/features/knowledge/knowledgeFeedManager.test.ts)
- Ripple analysis: [`packages/server/src/features/knowledge/rippleAnalyzer.test.ts`](../../../packages/server/src/features/knowledge/rippleAnalyzer.test.ts)

These suites cover artifact/link lifecycle, traversal ordering, and failure scenarios. Direct unit tests for every GraphStore method remain a future enhancement, but current coverage ensures the critical read paths (including the newly exposed confidence value) behave as expected.

## Rationale
Consolidating persistence logic into a single module avoids duplicating SQL statements across features, provides one tuning point for performance, and enables future instrumentation (timings, cache warmers) without touching every consumer. The file is a deliberate liability: without it, each feature would carry its own DB layer, fragmenting schema management and making cross-file impact analysis impossible.
