# saveCodeChange (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/changeEvents/saveCodeChange.ts`](../../../packages/server/src/features/changeEvents/saveCodeChange.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)
- Spec references: [FR-002](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T031](../../../specs/001-link-aware-diagnostics/tasks.md)

## Responsibility
Records code artifact saves in the knowledge graph so ripple analysis can trace dependencies back to concrete change events with stable IDs.

## Behaviour
- Resolves the canonical artifact from watcher-provided snapshots (`nextArtifact`/`previousArtifact`), normalising URIs with `normalizeFileUri`.
- Ensures the artifact exists in `GraphStore` (upsert) before creating an associated `changeEvent` entry with a generated UUID.
- Captures timestamp, short summary, change type, and provenance so acknowledgement and auditing surfaces remain informative.
- Returns both the persisted artifact and `changeEventId` for downstream diagnostics.

## Implementation Notes
- Shares logic with `saveDocumentChange`, differing only in summary text (“Implementation updated”) and the tracked layer (code vs doc).
- Accepts optional `now()` factory for deterministic testing.
- Leaves range metadata empty pending future AST diff integration; placeholders keep schema consistent.

## Testing
- Behaviour validated through integration suites (US1 code impact, US5 transform pipeline) which assert diagnostics include `changeEventId` resolved from this save path.

## Follow-ups
- Add dedicated unit coverage mirroring the document path to protect against regressions.
- Populate `ranges` once AST diffing lands, enabling more granular acknowledgement prompts.
