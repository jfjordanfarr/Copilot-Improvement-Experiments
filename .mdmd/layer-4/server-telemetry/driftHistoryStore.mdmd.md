# DriftHistoryStore (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/telemetry/driftHistoryStore.ts`](../../../packages/server/src/telemetry/driftHistoryStore.ts)
- Persistence: [`packages/shared/src/db/graphStore.ts`](../../../packages/shared/src/db/graphStore.ts)
- Domain Types: [`packages/shared/src/domain/artifacts.ts`](../../../packages/shared/src/domain/artifacts.ts)
- Parent design: [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)
- Spec references: [FR-009](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T059](../../../specs/001-link-aware-diagnostics/tasks.md)

## Responsibility
Provide a durable ledger of drift events that correlates diagnostic emissions and acknowledgements with their originating change events. The store enables reporting on review volume ("how often do ripple diagnostics require follow-up?") and guarantees acknowledgement history survives server restarts.

## Behaviour
- Records an `emitted` entry whenever a diagnostic emission is registered, capturing diagnostic/change identifiers, trigger and target artifacts, severity, and link metadata snapshot.
- Records an `acknowledged` entry when a diagnostic transitions to acknowledged, preserving actor identity and optional notes.
- Supports chronological queries filtered by artifact, change event, or acknowledgement status to feed future reporting surfaces.
- Coexists with the existing diagnostics table—drift history is append-only; diagnostic re-activation generates another `emitted` entry.
- Restarts hydrate the acknowledgement service from persisted diagnostics while drift history remains available for analytics.

## Data Model
- `drift_history` table (SQLite) with columns:
  - `id` (TEXT, PK)
  - `diagnostic_id` (TEXT, FK -> diagnostics)
  - `change_event_id` (TEXT, FK -> change_events)
  - `trigger_artifact_id` (TEXT, FK -> artifacts)
  - `target_artifact_id` (TEXT, FK -> artifacts)
  - `status` (TEXT enum: `emitted`, `acknowledged`)
  - `severity` (TEXT)
  - `recorded_at` (TEXT ISO timestamp)
  - `actor` (TEXT, nullable)
  - `notes` (TEXT, nullable)
  - `metadata` (TEXT JSON, nullable; e.g., link IDs snapshot)
- Indexed on `(change_event_id, target_artifact_id)` and `(diagnostic_id, recorded_at DESC)` to accelerate reporting and acknowledgement rollups.

## Interactions
- `AcknowledgementService.registerEmission` invokes `recordEmission` to append an `emitted` entry alongside the diagnostic update.
- `AcknowledgementService.acknowledgeDiagnostic` invokes `recordAcknowledgement` so acknowledgement latency is measurable.
- Future telemetry endpoints (CLI, VS Code commands, dashboards) will rely on `listEntries` / `summarizeByChangeEvent` to present review load statistics.

## Testing
- Unit tests verify persistence logic using an in-memory database stub (`GraphStore`) and ensure emissions/acknowledgements append correctly with preserved metadata.
- Integration test `acknowledgeDiagnostics.test.ts` gains a regression that simulates a server restart: acknowledge a diagnostic, rebuild the acknowledgement service + drift history store, and assert acknowledgements remain suppressed with corresponding history entries.

## Follow-ups
- Add rollup helpers (e.g., acknowledged-within SLA metrics) once telemetry reporting surfaces land.
- Emit events for `dismiss` / `reopen` actions when acknowledgement flows expand.
- Surface drift history via CLI/command palette or external analytics sink for leadership reporting.
