# packages/server/src/telemetry/driftHistoryStore.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/telemetry/driftHistoryStore.ts
- Live Doc ID: LD-implementation-packages-server-src-telemetry-drifthistorystore-ts
- Generated At: 2025-11-16T02:09:51.722Z

## Authored
### Purpose
Captures emitted and acknowledged diagnostics in the graph store so teams can audit drift timelines and derive run-level summaries.

### Notes
- Generates UUID-backed entries stamped with the controller’s clock, merging optional metadata and link identifiers for downstream analytics.
- Exposes `list` and `summarize` pass-throughs to the `GraphStore`, allowing diagnostics services to render history feeds without duplicating query logic.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.722Z","inputHash":"6eab102e714e3738"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `DriftHistoryStoreOptions`
- Type: interface
- Source: [source](../../../../../../packages/server/src/telemetry/driftHistoryStore.ts#L11)

#### `RecordDriftEmissionParams`
- Type: type
- Source: [source](../../../../../../packages/server/src/telemetry/driftHistoryStore.ts#L26)

#### `RecordDriftAcknowledgementParams`
- Type: interface
- Source: [source](../../../../../../packages/server/src/telemetry/driftHistoryStore.ts#L28)

#### `DriftHistoryStore`
- Type: class
- Source: [source](../../../../../../packages/server/src/telemetry/driftHistoryStore.ts#L33)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `DiagnosticSeverity`, `DriftHistoryEntry`, `DriftHistorySummary`, `GraphStore`, `ListDriftHistoryOptions` (type-only)
- `node:crypto` - `randomUUID`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [acknowledgementService.test.ts](../features/diagnostics/acknowledgementService.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
