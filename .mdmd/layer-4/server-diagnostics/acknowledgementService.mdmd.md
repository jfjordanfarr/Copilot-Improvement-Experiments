# AcknowledgementService (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/diagnostics/acknowledgementService.ts`](../../../packages/server/src/features/diagnostics/acknowledgementService.ts)
- Unit tests: [`acknowledgementService.test.ts`](../../../packages/server/src/features/diagnostics/acknowledgementService.test.ts)
- Collaborators:
  - [`GraphStore`](../../../packages/shared/src/db/graphStore.ts) for diagnostic persistence and acknowledgement logs
  - [`HysteresisController`](../../../packages/server/src/features/diagnostics/hysteresisController.ts) to release suppression windows after acknowledgement
  - [`DriftHistoryStore`](../../../packages/server/src/telemetry/driftHistoryStore.ts) (via adapter) for durable audit logging
  - [`RuntimeSettings`](../../../packages/server/src/features/settings/settingsBridge.ts) for noise-suppression knobs

## Why This File Exists
Link-aware diagnostics treats every emitted warning as a contract: once a developer acknowledges it, the system must stop re-sending noise until new evidence arises. `AcknowledgementService` is the server-side owner of that contract. It decides when a ripple or doc drift diagnostic should surface, persists acknowledgement state in the graph store, and records telemetry so future sessions (and human reviewers) can see who muted an alert and why. Without this service, repeated ripple notifications would continually reopen acknowledged issues, breaking trust in the tooling.

## Responsibilities
- Determine whether a new ripple impact should emit (`shouldEmitDiagnostic`) by inspecting existing graph records.
- Register emissions (`registerEmission`) so acknowledged diagnostics can be replayed when evidence changes, including drift-history provenance.
- Accept acknowledgement requests, persist acknowledgement metadata, release hysteresis locks, and log actor/notes for audit trails.
- Update runtime behaviour when noise-suppression settings change, keeping logs in sync with current hysteresis windows.

## Behaviour Notes
- Emission registration reuses existing diagnostic ids when re-activating acknowledged entries, ensuring VS Code receives stable diagnostic handles.
- Acknowledgements log both to `GraphStore.logAcknowledgement` and the drift history adapter so historical dashboards and future conversations explain why a diagnostic went quiet.
- The service is intentionally synchronous: callers (e.g., `publishDocDiagnostics`) can assume persistence finished before returning to the client.

## Error Handling & Logging
- Missing diagnostics during acknowledgement result in a warning and a `not_found` outcome—callers can surface UI errors without throwing.
- Duplicate acknowledgements short-circuit with an `already_acknowledged` response to keep client UX idempotent.
- Hysteresis release warns when associated artifacts are missing, avoiding crashes if the graph was pruned.

## Follow-ups
- Expand the drift-history adapter once we expose acknowledgement analytics in the UI.
- Add rate limiting or batching if acknowledgement volume grows (e.g., bulk triage from CI pipelines).
