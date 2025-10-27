# saveDocumentChange (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/changeEvents/saveDocumentChange.ts`](../../../packages/server/src/features/changeEvents/saveDocumentChange.ts)
- Tests: [`packages/server/src/features/changeEvents/saveDocumentChange.test.ts`](../../../packages/server/src/features/changeEvents/saveDocumentChange.test.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)
- Spec references: [FR-002](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T030](../../../specs/001-link-aware-diagnostics/tasks.md)

## Exported Symbols

### `PersistedDocumentChange`
Return type exposing the stored documentation artifact and associated change-event id.

### `SaveDocumentChangeOptions`
Input contract combining watcher payloads, inference result, and optional clock override.

### `persistInferenceResult`
Best-effort helper that writes inference-produced artifacts/links into the graph ahead of the change event.

### `saveDocumentChange`
Primary entry point that normalises URIs, persists the artifact, and records the document change event with provenance metadata.

## Responsibility
Persists documentation change events into the knowledge graph, ensuring updated artifacts exist before ripple analysis runs and logging provenance details for acknowledgement workflows.

## Behaviour
- Resolves the authoritative `KnowledgeArtifact` associated with the change, preferring the inference-provided snapshot (`nextArtifact/previousArtifact`).
- Normalises URIs via `normalizeFileUri` so storage stays canonical across platforms.
- Upserts the artifact into `GraphStore`, then records a `changeEvent` with a generated UUID, timestamp, summary, change type, and provenance.
- Returns the persisted artifact plus `changeEventId` so callers (change processor, diagnostics) can thread context through downstream operations.
- Exposes `persistInferenceResult()` helper to merge upstream inference results (artifacts/links) into the graph before saving the change.

## Implementation Notes
- `DEFAULT_SUMMARY` set to “Documentation updated” while richer summaries remain a backlog item.
- Accepts optional `now()` factory for deterministic tests.
- Ensures artifacts always carry a unique id—even if inference failed—so change events remain addressable.

## Testing
- Unit tests validate artifact resolution order, UUID generation, change event persistence, and inference upsert behaviour.
- Integration suites rely on these persisted events to join ripple metadata (changeEventId) back onto diagnostics during acknowledgement flows.

## Follow-ups
- Extend change events with diff metadata (e.g., text ranges) once acknowledgement UX requires targeted reviews.
- Log persistence errors to structured telemetry for easier triage if the GraphStore becomes unavailable.
