# FeedDiagnosticsGateway (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/knowledge/feedDiagnosticsGateway.ts`](../../../packages/server/src/features/knowledge/feedDiagnosticsGateway.ts)
- Collaborators: [`knowledgeFeedManager.ts`](../../../packages/server/src/features/knowledge/knowledgeFeedManager.ts) (status updates), [`knowledgeGraphIngestor.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.ts) (failure reporting)
- Tests: [`knowledgeFeedManager.test.ts`](../../../packages/server/src/features/knowledge/knowledgeFeedManager.test.ts)
- Parent design: [Knowledge Graph Ingestion Architecture](../../layer-3/knowledge-graph-ingestion.mdmd.md)

## Exported Symbols

### `FeedHealthStatus`
String literal union describing feed health (`healthy`, `degraded`, `blocked`). Drives logger severity and UI labelling so operators can immediately gauge ingest reliability.

### `FeedStatusSummary`
Canonical snapshot emitted for each health update: captures status, timestamp, log payload, and optional `KnowledgeFeedSummary` metadata that downstream dashboards can render.

### `FeedDiagnosticsGatewayOptions`
Constructor contract bundling optional logger hooks and an `onStatusChanged` callback for observers that need push updates when feed state changes.

### `FeedDiagnosticsGateway`
Class maintaining per-feed status in memory, routing formatted health messages to the provided logger, and publishing change notifications for UI refreshes.

## Responsibility
Centralize status updates for external knowledge feeds, translating health transitions into structured logs and event callbacks. Maintains the latest observed state per feed so diagnostics views and runtime watchers can present accurate health information.

## Internal Flow
1. Mutate the in-memory `Map` keyed by feed ID when `updateStatus` is called.
2. Format a human-readable log line prefixed with `[knowledge-feed]` for operator visibility.
3. Route the message to the provided logger with severity derived from the status (`info` for healthy, `warn` for degraded, `error` for blocked).
4. Invoke the `onStatusChanged` callback so other subsystems (e.g., VS Code diagnostics publisher) can react.

## Error Handling
- Gateway itself performs no IO and therefore only throws if the logger or callback throw. Callers wrap updates in their own try/catch to ensure diagnostics remain resilient.

## Observability Hooks
- Structured log messages consolidate feed ID, status, optional message, and snapshot label.
- `listStatuses` powers health dashboards by exposing the latest summary for each feed.

## Integration Notes
- `KnowledgeFeedManager` calls `updateStatus` after each ingestion attempt, ensuring operators see transitions like degraded → healthy after a retry.
- Downstream consumers (extension diagnostics tree) poll or subscribe via `onStatusChanged` to refresh UI when feeds change state.
- Additional health states can be introduced by widening `FeedHealthStatus`; formatting and logger routing already adapt based on the enum value.
