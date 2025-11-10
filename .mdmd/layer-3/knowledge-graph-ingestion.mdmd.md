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
Orchestrates feed scheduling, validation, and persistence. [Knowledge Feed Manager](/.mdmd/layer-4/knowledge-graph-ingestion/knowledgeFeedManager.mdmd.md)

### IMP-205 knowledgeGraphIngestor
Applies validated payloads to the graph store and checkpoints progress. [Knowledge Graph Ingestor](/.mdmd/layer-4/knowledge-graph-ingestion/knowledgeGraphIngestor.mdmd.md)

### IMP-206 feedFormatDetector
Detects LSIF/SCIP/native payload formats before parsing. [Feed Format Detector](/.mdmd/layer-4/knowledge-graph-ingestion/feedFormatDetector.mdmd.md)

### IMP-207 schemaValidator
Shared schema contract enforcement for ingestion. [Schema Validator](/.mdmd/layer-4/knowledge-graph-ingestion/schemaValidator.mdmd.md)

### IMP-208 feedCheckpointStore
Persists stream offsets for replay-safe ingestion. [Feed Checkpoint Store](/.mdmd/layer-4/knowledge-graph-ingestion/feedCheckpointStore.mdmd.md)

### IMP-209 feedDiagnosticsGateway
Broadcasts feed health to diagnostics consumers. [Feed Diagnostics Gateway](/.mdmd/layer-4/knowledge-graph-ingestion/feedDiagnosticsGateway.mdmd.md)

### IMP-210 staticFeedWorkspaceProvider
Provides fallback JSON fixtures when external feeds degrade. [Static Feed Workspace Provider](/.mdmd/layer-4/knowledge-graph-ingestion/staticFeedWorkspaceProvider.mdmd.md)

### IMP-211 knowledgeGraphBridgeService
Bootstraps feed discovery, wiring, and lifecycle management for the ingestion stack. [Knowledge Graph Bridge Service](/.mdmd/layer-4/knowledge-graph-ingestion/knowledgeGraphBridge.mdmd.md)

### IMP-212 workspaceIndexProvider
Seeds code and documentation artifacts when external feeds are unavailable. [Workspace Index Provider](/.mdmd/layer-4/knowledge-graph-ingestion/workspaceIndexProvider.mdmd.md)

### IMP-213 scipParser
Normalises SCIP indexes into workspace snapshot artifacts and links. [SCIP Parser](/.mdmd/layer-4/knowledge-graph-ingestion/scipParser.mdmd.md)

### IMP-214 lsifParser
Normalises LSIF dumps into workspace snapshot artifacts and links. [LSIF Parser](/.mdmd/layer-4/knowledge-graph-ingestion/lsifParser.mdmd.md)

### IMP-215 symbolBridgeProvider
Requests workspace symbol contributions from the extension to enrich ingestion seeds. [Symbol Bridge Provider](/.mdmd/layer-4/knowledge-graph-ingestion/symbolBridgeProvider.mdmd.md)

### IMP-303 liveDocGraphProjector
Projects staged Live Doc markdown into canonical graph edges. [Live Doc Graph Projector](/.mdmd/layer-4/live-docs/graphProjector.mdmd.md)

## Evidence
- Unit suites: `knowledgeFeedManager.test.ts`, `knowledgeGraphIngestor.test.ts`, `schemaValidator.test.ts`, `feedCheckpointStore.test.ts` cover validation and persistence.
- Integration fixtures under `tests/integration/fixtures/knowledge-feeds` exercise snapshot + stream ingestion paths.
- Safe-to-commit pipeline runs `npm run graph:snapshot` and `npm run graph:audit` ensuring ingested edges remain deterministic.
- Live Doc benchmark (`reports/benchmarks/live-docs/precision.json`) captured precision 100% / recall 98.62% for symbols and precision 100% / recall 99.90% for dependencies, validating that projected markdown links match analyzer expectations.

## Operational Notes
- Failure handling distinguishes schema violations, transport errors, and checkpoint loss, each with targeted recovery strategies.
- Follow-up work tracks configuration surfaces for feed endpoints, backoff tuning, and multi-feed prioritisation.
