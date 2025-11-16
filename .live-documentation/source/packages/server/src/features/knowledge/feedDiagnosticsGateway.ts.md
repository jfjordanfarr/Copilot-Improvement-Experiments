# packages/server/src/features/knowledge/feedDiagnosticsGateway.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/feedDiagnosticsGateway.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-feeddiagnosticsgateway-ts
- Generated At: 2025-11-16T02:09:51.319Z

## Authored
### Purpose
Publishes ingestion diagnostics and metrics to the telemetry pipeline so operators can observe feed health and failures.

### Notes
- Wraps logging and telemetry emitters to centralize how feed warnings/errors are reported.
- Tracks last-seen offsets and failure contexts to aid in triaging stalled feeds.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.319Z","inputHash":"f0e717a6ffffa870"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `FeedHealthStatus`
- Type: type
- Source: [source](../../../../../../../packages/server/src/features/knowledge/feedDiagnosticsGateway.ts#L3)

#### `FeedStatusSummary`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/feedDiagnosticsGateway.ts#L5)

#### `FeedDiagnosticsGatewayOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/feedDiagnosticsGateway.ts#L14)

#### `FeedDiagnosticsGateway`
- Type: class
- Source: [source](../../../../../../../packages/server/src/features/knowledge/feedDiagnosticsGateway.ts#L23)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `KnowledgeFeedSummary`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [knowledgeFeedManager.test.ts](./knowledgeFeedManager.test.ts.md)
- [knowledgeGraphBridge.test.ts](./knowledgeGraphBridge.test.ts.md)
- [knowledgeGraphIngestor.test.ts](./knowledgeGraphIngestor.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
