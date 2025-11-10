# packages/server/src/features/changeEvents/saveCodeChange.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/changeEvents/saveCodeChange.ts
- Live Doc ID: LD-implementation-packages-server-src-features-changeevents-savecodechange-ts
- Generated At: 2025-11-09T22:52:09.923Z

## Authored
### Purpose
Persists tracked code edits into the graph store while capturing ripple metadata and enqueueing downstream analysis tasks.

### Notes
- Normalises incoming VS Code change events into `CodeTrackedArtifactChange` records before storage, keeping change metadata consistent across telemetry and diagnostics pipelines.
- Associates the saved change with generated ripple hints so later diagnostics runs know which dependents to inspect.
- Delegates scheduling to the change queue module, ensuring code and document changes share the same processing infrastructure.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:09.923Z","inputHash":"ae5b5738d3b17b8a"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `PersistedCodeChange`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/changeEvents/saveCodeChange.ts#L8)

#### `SaveCodeChangeOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/changeEvents/saveCodeChange.ts#L13)

#### `saveCodeChange`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/changeEvents/saveCodeChange.ts#L21)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `GraphStore`, `KnowledgeArtifact`
- `node:crypto` - `randomUUID`
- [`uri.normalizeFileUri`](../utils/uri.ts.mdmd.md#normalizefileuri)
- [`artifactWatcher.CodeTrackedArtifactChange`](../watchers/artifactWatcher.ts.mdmd.md#codetrackedartifactchange) (type-only)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [saveCodeChange.test.ts](./saveCodeChange.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
