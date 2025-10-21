# Maintenance – Orphan Rebinding (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/maintenance/removeOrphans.ts`](../../../packages/server/src/features/maintenance/removeOrphans.ts)
- Client counterpart: [`packages/extension/src/watchers/fileMaintenance.ts`](../../../packages/extension/src/watchers/fileMaintenance.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)
- Spec references: [FR-013](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements)

## Responsibility
- React to file rename/delete notifications from the extension client.
- Remove orphaned artifacts from the knowledge graph and emit diagnostics to linked dependents.
- Notify the client to prompt rebind workflows when necessary.

## Flow
1. Client watcher sends notification with canonicalised URIs (`fileMaintenance.ts` now uses `Uri.toString(true)` to avoid `%20` encoding drift).
2. `handleRemoval` normalises URIs (`normalizeFileUri`) and fetches the associated artifact from `GraphStore`.
3. Linked artifact summaries are enumerated; the removed artifact is deleted from the store.
4. `publishRemovalDiagnostics` emits `doc-drift` informational diagnostics to each linked artifact, highlighting the missing source and rename targets when applicable.
5. A `RebindRequiredPayload` with impacted artifacts/relationships is dispatched to the client via LSP notification for UI handling.

## Diagnostic Schema
- `code`: `doc-drift`
- Message format: `linked documentation changed: <removed> [→ <newUri>] is unavailable.`
- Payload includes `triggerUri`, `targetUri`, `relationshipKind`, `depth`, and `path` for ripple-aware quick fixes.

## Edge Cases
- Logs and exits when the URI is untracked (no artifact registered).
- No payload is sent when there are no linked artifacts remaining.
- Normalisation ensures Windows vs. POSIX path differences do not produce duplicate graph entries.

## Tests & Coverage
- Behaviour observed in integration suites (US3 rename scenario) via emitted diagnostics and rebind prompts.
- Unit coverage planned once acknowledgement/rebind UX is formalised (T07x).

## Follow-ups
- Persist diagnostic acknowledgements once rebind UI flow is implemented.
- Consider batching multiple orphan removals to reduce diagnostic spam during large refactors.
