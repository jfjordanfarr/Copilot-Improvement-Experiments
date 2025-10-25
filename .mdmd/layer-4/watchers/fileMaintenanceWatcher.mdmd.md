# File Maintenance Watcher (Layer 4)

## Source Mapping
- Implementation: [`packages/extension/src/watchers/fileMaintenance.ts`](/packages/extension/src/watchers/fileMaintenance.ts)
- Related contracts: [`packages/shared/src/contracts/maintenance.ts`](/packages/shared/src/contracts/maintenance.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Extension Surfaces Architecture](../../layer-3/extension-surfaces.mdmd.md)

## Responsibility
Observes the workspace for orphaned/moved files and notifies the language server to reconcile diagnostics that point at stale paths. Provides the first line of defense against broken cross-file links caused by deletes or renames outside VS Code.

## Behaviour
- Registers a `FileSystemWatcher` targeting `**/*` (excluding dotfiles) and reacts to `onDidDelete` and `onDidRename`.
- Batches events for a short debounce window (default 250 ms) to avoid spamming the server on bulk operations.
- Sends `MAINTENANCE_ORPHANS` requests through the language client once the batch flushes.
- Drops events when the language client is not yet ready; logs at trace level for observability.

## Implementation Notes
- Debounce implemented with `setTimeout`; pending timers cleared when new events arrive before flush.
- Normalises paths to workspace-relative form via `workspace.asRelativePath` to reduce payload size.
- Uses `diagnosticsChannel.send` helper to keep transport consistent with other watcher emissions.

## Testing & Safety
- Exercised by integration tests `tests/integration/us1/codeImpact.test.ts` through simulated file deletions.
- Manual verification: rename/delete files in fixtures and confirm stale diagnostics clear within 500 ms.

## Follow-ups
- Consider collapsing consecutive rename events into single payload entries.
- Hook into VS Code `FileOperationEvent` once API graduates for richer metadata.
