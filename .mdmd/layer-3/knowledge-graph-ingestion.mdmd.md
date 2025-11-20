# Knowledge Graph Ingestion Architecture

## Metadata
- Layer: 3
- Component IDs: COMP-005

## Components

### COMP-005 Knowledge Graph Ingestion
Supports FR-LD3, FR-LD5, and REQ-L2 by ingesting external graph feeds, Live Documentation projections, and analyzer hints, validating schemas, and projecting links into the workspace knowledge base so ripple analysis reflects the broader ecosystem.

## Responsibilities

### Feed Coordination
- Discover, configure, and lifecycle-manage snapshot and streaming feeds (LSIF, SCIP, bespoke JSON) through `KnowledgeFeedManager`.
- Respect provider guard settings while keeping graph data ready for future enforcement stages.
- Accept Live Doc Graph Projector snapshots as an internal feed so diagnostics, CLI, and Copilot surfaces share the same dependency edges.

### Schema Enforcement and Persistence
- Validate payloads using `SchemaValidator`, `LSIFParser`, and `SCIPParser` before mutating the `GraphStore` via `KnowledgeGraphIngestor`.
- Maintain checkpoints (`FeedCheckpointStore`) so ingestion can resume without replaying full snapshots.
- Normalise Live Doc markdown links into canonical URIs (aligned with `normalizeFileUri`) before persisting edges.

### Runtime Availability and Diagnostics
- Surface degraded feed states through `FeedDiagnosticsGateway` diagnostics/logging while allowing Workspace-only inference to continue.
- Refresh knowledge feed descriptors consumed by `ArtifactWatcher`, the Live Doc Generator, and the inference orchestrator once ingestion succeeds.

## Interfaces

### Inbound Interfaces
- Feed configuration sources (workspace settings, future VS Code config) enumerating snapshot URLs, stream endpoints, and credentials.
- Snapshot and streaming payloads delivered to the manager and parsers.
- Live Doc Graph Projector snapshots treated as deterministic internal feeds.

### Outbound Interfaces
- `KnowledgeFeed[]` descriptors provided to `ArtifactWatcher.setKnowledgeFeeds` and Live Doc Generator services for runtime inference and regeneration heuristics.
- Health diagnostics and structured logs emitted via `FeedDiagnosticsGateway` for extension surfaces and CLI audits.

## Linked Implementations

### IMP-112 knowledgeFeedManager
Orchestrates feed scheduling, validation, and persistence. Inspect [knowledgeFeedManager.ts Live Doc](../layer-4/packages/server/src/features/knowledge/knowledgeFeedManager.ts.mdmd.md) for the generated implementation view.

### IMP-205 knowledgeGraphIngestor
Applies validated payloads to the graph store and checkpoints progress. See [knowledgeGraphIngestor.ts Live Doc](../layer-4/packages/server/src/features/knowledge/knowledgeGraphIngestor.ts.mdmd.md).

### IMP-206 feedFormatDetector
Detects LSIF/SCIP/native payload formats before parsing. Refer to [feedFormatDetector.ts Live Doc](../layer-4/packages/server/src/features/knowledge/feedFormatDetector.ts.mdmd.md).

### IMP-207 schemaValidator
Shared schema contract enforcement for ingestion. Implementation details surface in [schemaValidator.ts Live Doc](../layer-4/packages/server/src/features/knowledge/schemaValidator.ts.mdmd.md).

### IMP-208 feedCheckpointStore
Persists stream offsets for replay-safe ingestion. Consult [feedCheckpointStore.ts Live Doc](../layer-4/packages/server/src/features/knowledge/feedCheckpointStore.ts.mdmd.md) for the Live Doc.

### IMP-209 feedDiagnosticsGateway
Broadcasts feed health to diagnostics consumers. [feedDiagnosticsGateway.ts Live Doc](../layer-4/packages/server/src/features/knowledge/feedDiagnosticsGateway.ts.mdmd.md) captures the implementation signals.

### IMP-210 staticFeedWorkspaceProvider
Provides fallback JSON fixtures when external feeds degrade. See [staticFeedWorkspaceProvider.ts Live Doc](../layer-4/packages/server/src/features/knowledge/staticFeedWorkspaceProvider.ts.mdmd.md).

### IMP-211 knowledgeGraphBridgeService
Bootstraps feed discovery, wiring, and lifecycle management for the ingestion stack. The generated Stage-0 doc is [knowledgeGraphBridge.ts Live Doc](../layer-4/packages/server/src/features/knowledge/knowledgeGraphBridge.ts.mdmd.md).

### IMP-212 workspaceIndexProvider
Seeds code and documentation artifacts when external feeds are unavailable. Refer to [workspaceIndexProvider.ts Live Doc](../layer-4/packages/server/src/features/knowledge/workspaceIndexProvider.ts.mdmd.md).

### IMP-213 scipParser
Normalises SCIP indexes into workspace snapshot artifacts and links. [scipParser.ts Live Doc](../layer-4/packages/server/src/features/knowledge/scipParser.ts.mdmd.md) documents the ingestion logic.

### IMP-214 lsifParser
Normalises LSIF dumps into workspace snapshot artifacts and links. Inspect [lsifParser.ts Live Doc](../layer-4/packages/server/src/features/knowledge/lsifParser.ts.mdmd.md) for the materialised view.

### IMP-215 symbolBridgeProvider
Requests workspace symbol contributions from the extension to enrich ingestion seeds. Implementation details are surfaced in [symbolBridgeProvider.ts Live Doc](../layer-4/packages/server/src/features/knowledge/symbolBridgeProvider.ts.mdmd.md).

### IMP-303 liveDocGraphProjector
Projects staged Live Doc markdown into canonical graph edges. Stage-0 documentation remains pending while the projector stabilises; check the implementation at `packages/server/src/features/live-docs/graphProjector.ts` until the mirror lands.

## Evidence
- Unit suites: `knowledgeFeedManager.test.ts`, `knowledgeGraphIngestor.test.ts`, `schemaValidator.test.ts`, `feedCheckpointStore.test.ts` cover validation and persistence.
- Integration fixtures under `tests/integration/fixtures/knowledge-feeds` exercise snapshot + stream ingestion paths.
- Safe-to-commit pipeline runs `npm run graph:snapshot` and `npm run graph:audit` ensuring ingested edges remain deterministic.
- Live Doc benchmark (`reports/benchmarks/live-docs/precision.json`) captured precision 100% / recall 98.62% for symbols and precision 100% / recall 99.90% for dependencies, validating that projected markdown links match analyzer expectations.

## Operational Notes
- Failure handling distinguishes schema violations, transport errors, and checkpoint loss, each with targeted recovery strategies.
- Follow-up work tracks configuration surfaces for feed endpoints, backoff tuning, and multi-feed prioritisation.
