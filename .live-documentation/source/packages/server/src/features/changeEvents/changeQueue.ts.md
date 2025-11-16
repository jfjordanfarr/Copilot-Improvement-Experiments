# packages/server/src/features/changeEvents/changeQueue.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/changeEvents/changeQueue.ts
- Live Doc ID: LD-implementation-packages-server-src-features-changeevents-changequeue-ts
- Generated At: 2025-11-16T02:09:51.167Z

## Authored
### Purpose
Coordinates background processing of saved change events, coalescing bursts and dispatching work to analyzers responsible for ripple discovery.

### Notes
- Tracks pending jobs in-memory to avoid duplicate scheduling when multiple saves occur before the previous batch completes.
- Provides hooks to inject debounce timing so integration tests can force immediate processing.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.167Z","inputHash":"fcfffda7f859eb83"}]} -->
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
- [saveCodeChange.test.ts](./saveCodeChange.test.ts.md)
- [saveDocumentChange.test.ts](./saveDocumentChange.test.ts.md)
- [publishDocDiagnostics.test.ts](../diagnostics/publishDocDiagnostics.test.ts.md)
- [artifactWatcher.test.ts](../watchers/artifactWatcher.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
