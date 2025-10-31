# Feed Diagnostics Gateway

## Metadata
- Layer: 4
- Implementation ID: IMP-209
- Code Path: [`packages/server/src/features/knowledge/feedDiagnosticsGateway.ts`](../../../packages/server/src/features/knowledge/feedDiagnosticsGateway.ts)
- Exports: FeedHealthStatus, FeedStatusSummary, FeedDiagnosticsGatewayOptions, FeedDiagnosticsGateway

## Purpose
Centralise knowledge-feed health signalling so ingestion failures become immediately visible to operators and downstream tooling.
- Maintain the latest health state per feed and expose it through structured summaries.
- Emit logger messages with severity aligned to health transitions (healthy, degraded, blocked).
- Notify subscribers when feed status changes so diagnostics panels and telemetry exporters stay current.

## Public Symbols

### FeedHealthStatus
Union of allowed health states (`healthy`, `degraded`, `blocked`) used to drive log severity, diagnostics colouring, and alert routing.

### FeedStatusSummary
Data contract surfaced by `listStatuses`; captures feed identifier, current status, human-readable message, timestamp, and optional metadata for dashboards.

### FeedDiagnosticsGatewayOptions
Configuration container supplying optional logger hooks and an `onStatusChanged` callback for push updates, keeping the gateway framework-agnostic.

### FeedDiagnosticsGateway
Stateful gateway that records per-feed health, writes structured logs prefixed with `[knowledge-feed]`, and fan-outs change notifications to registered listeners.

## Collaborators
- [`packages/server/src/features/knowledge/knowledgeFeedManager.ts`](../../../packages/server/src/features/knowledge/knowledgeFeedManager.ts) invokes `updateStatus` after snapshot/stream attempts and listens for health changes.
- [`packages/server/src/features/knowledge/knowledgeGraphIngestor.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.ts) reports ingestion failures that should surface as degraded/blocked states.
- Workspace telemetry/logging surfaces honour the injected logger contract to display feed messages consistently alongside other diagnostics.

## Linked Components
- [COMP-005 – Knowledge Graph Ingestion](../../layer-3/knowledge-graph-ingestion.mdmd.md#imp209-feeddiagnosticsgateway)

## Evidence
- Exercised indirectly by [`packages/server/src/features/knowledge/knowledgeFeedManager.test.ts`](../../../packages/server/src/features/knowledge/knowledgeFeedManager.test.ts), which asserts health transitions and listener notifications.
- Verified in integration suites (US5 ingestion) where simulated feed failures trigger diagnostics refreshes.
- Manual smoke: `npm run graph:audit` highlights feed status regressions thanks to gateway-emitted diagnostics logs.

## Operational Notes
- Gateway performs no async IO; it only surfaces failures thrown by injected loggers or callbacks, making it safe to call during error handling.
- `listStatuses` returns shallow copies so callers cannot mutate internal state.
- Additional health states can be introduced by widening `FeedHealthStatus`; downstream formatting automatically adapts via enum mapping.
