# File Maintenance Watcher

## Metadata
- Layer: 4
- Implementation ID: IMP-109
- Code Path: [`packages/extension/src/watchers/fileMaintenance.ts`](../../../packages/extension/src/watchers/fileMaintenance.ts)
- Exports: registerFileMaintenanceWatcher

## Purpose
Observe workspace rename and delete activity, batching events so the language server can reconcile orphaned ripple diagnostics without flooding the transport layer.

## Public Symbols

### registerFileMaintenanceWatcher
Registers a `FileSystemWatcher`, debounces rename/delete bursts, and forwards orphan reconciliation requests to the language server once the language client is ready.

## Responsibilities
- Monitor non-dotfile paths for delete and rename events tied to diagnostics.
- Collapse rapid event bursts (default 250 ms debounce) into single maintenance payloads.
- Dispatch `MAINTENANCE_ORPHANS` requests via the diagnostics channel when the client session is active.
- Skip emission gracefully when activation is incomplete, logging at trace level for operators.

## Collaborators
- [`packages/shared/src/contracts/maintenance.ts`](../../../packages/shared/src/contracts/maintenance.ts) defines orphan reconciliation payloads.
- Diagnostics channel helpers shared with other extension emitters keep LSP transport consistent.
- Language server `ArtifactWatcher` consumes orphan notifications to prune stale diagnostics.

## Linked Components
- [COMP-001 – Diagnostics Pipeline](../../layer-3/diagnostics-pipeline.mdmd.md)
- [COMP-002 – Extension Surfaces](../../layer-3/extension-surfaces.mdmd.md)

## Evidence
- Exercised by `tests/integration/us1/codeImpact.test.ts` through simulated file deletions.
- Manual QA: renaming or deleting fixture files clears stale diagnostics within ≈500 ms.

## Operational Notes
- Debounce uses `setTimeout`; new events reset the timer until flush, preventing watcher thrash.
- Paths normalise through `workspace.asRelativePath` so payloads stay compact and deterministic.
- Future enhancement: adopt VS Code `FileOperationEvent` once available for richer metadata.
