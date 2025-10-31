# Knowledge Feed Manager

## Metadata
- Layer: 4
- Implementation ID: IMP-112
- Code Path: [`packages/server/src/features/knowledge/knowledgeFeedManager.ts`](../../../packages/server/src/features/knowledge/knowledgeFeedManager.ts)
- Exports: KnowledgeFeedManager, KnowledgeFeedManagerOptions, FeedConfiguration, FeedSnapshotSource, FeedStreamSource, BackoffOptions, Disposable, KnowledgeFeedManagerLogger

## Purpose
Coordinate knowledge-feed ingestion by loading snapshots, supervising streaming updates with exponential backoff, and surfacing healthy feed descriptors to the language server so workspace inference stays aligned with external sources.

## Public Symbols

### KnowledgeFeedManager
Entry-point class that boots configured feeds, validates snapshots, ingests stream events, tracks health, and exposes healthy feed descriptors to downstream consumers such as `ArtifactWatcher` and change processors.

### KnowledgeFeedManagerOptions
Configuration contract combining feed definitions, ingest/diagnostics collaborators, optional logger hooks, backoff tuning, and clock overrides for deterministic testing.

### FeedConfiguration
Describes a single feed (identifier, optional snapshot + stream descriptors, metadata) used to create per-feed workers.

### FeedSnapshotSource
Provides label and async snapshot loader for initial feed state; used when seeding the knowledge graph on bootstrap.

### FeedStreamSource
Supplies an async iterable factory that yields streaming feed events; the manager supervises this iterator for retries and abort signals.

### BackoffOptions
Parameterises the exponential backoff scheduler (initial delay, multiplier, max delay) that throttles retry timing after failures.

### Disposable
Return type from `onStatusChanged`, enabling observers to unsubscribe from feed health updates without leaking listeners.

### KnowledgeFeedManagerLogger
Optional logger interface (info, warn, error) allowing hosts to inject structured telemetry without tying the manager to a specific logging implementation.

## Responsibilities
- Bootstrap each configured feed: load snapshots, ingest them via `KnowledgeGraphIngestor`, and mark feeds healthy when successful.
- Manage long-lived stream workers, piping events through the ingestor and updating diagnostics/healthy feed caches.
- Apply exponential backoff and diagnostics updates when snapshot or stream ingestion fails, ensuring degraded feeds are observable.
- Notify registered listeners whenever feed health changes so diagnostics views and telemetry exporters stay current.

## Collaborators
- [`packages/server/src/features/knowledge/knowledgeGraphIngestor.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.ts) validates and persists snapshot/stream payloads.
- [`packages/server/src/features/knowledge/feedDiagnosticsGateway.ts`](../../../packages/server/src/features/knowledge/feedDiagnosticsGateway.ts) records feed health status for diagnostics surfaces.
- [`@copilot-improvement/shared`](../../../packages/shared/src/inference/linkInference.ts) provides shared feed descriptors consumed by the language server runtime.

## Linked Components
- [COMP-003 – Language Server Runtime](../../layer-3/language-server-architecture.mdmd.md#imp112-knowledgefeedmanager)
- [COMP-005 – Knowledge Graph Ingestion](../../layer-3/knowledge-graph-ingestion.mdmd.md#imp112-knowledgefeedmanager)

## Evidence
- Unit tests: [`packages/server/src/features/knowledge/knowledgeFeedManager.test.ts`](../../../packages/server/src/features/knowledge/knowledgeFeedManager.test.ts) validate snapshot ingestion, stream retries, and listener notifications.
- Integration coverage: US5 ingestion suites simulate feed bootstrapping and confirm diagnostics reflect healthy/degraded transitions.
- Manual smoke tests: `npm run graph:snapshot` + `npm run graph:audit` rely on feeds starting cleanly before audits execute.

## Operational Notes
- Feed state caches computed snapshots so repeated `getHealthyFeeds` calls avoid disk I/O.
- Abort controllers ensure stream workers exit promptly during shutdown or restart.
- Backoff defaults (1 s initial, ×5 multiplier, 120 s cap) balance quick recovery with protection against rapid failure loops.
