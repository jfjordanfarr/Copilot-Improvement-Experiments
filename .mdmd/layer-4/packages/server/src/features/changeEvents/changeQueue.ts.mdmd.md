# packages/server/src/features/changeEvents/changeQueue.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/changeEvents/changeQueue.ts
- Live Doc ID: LD-implementation-packages-server-src-features-changeevents-changequeue-ts
- Generated At: 2025-11-16T20:43:30.023Z

## Authored
### Purpose
Buffers rapid file edits into debounced batches so the inference pipeline can persist and diagnose changes efficiently, matching the persistence flow landed in [2025-10-17 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-17.SUMMARIZED.md).

### Notes
- Reconfigurable debounce windows allow runtime hysteresis tuning (added during the latency instrumentation pass in [2025-10-28 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-28.SUMMARIZED.md)) without dropping queued changes.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T20:43:30.023Z","inputHash":"fcfffda7f859eb83"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `QueuedChange`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/changeEvents/changeQueue.ts#L12)

#### `ChangeQueue`
- Type: class
- Source: [source](../../../../../../../packages/server/src/features/changeEvents/changeQueue.ts#L24)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_No dependencies documented yet_
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [saveCodeChange.test.ts](./saveCodeChange.test.ts.mdmd.md)
- [saveDocumentChange.test.ts](./saveDocumentChange.test.ts.mdmd.md)
- [publishDocDiagnostics.test.ts](../diagnostics/publishDocDiagnostics.test.ts.mdmd.md)
- [artifactWatcher.test.ts](../watchers/artifactWatcher.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
