# packages/server/src/features/changeEvents/saveCodeChange.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/changeEvents/saveCodeChange.ts
- Live Doc ID: LD-implementation-packages-server-src-features-changeevents-savecodechange-ts
- Generated At: 2025-11-16T22:35:14.876Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:14.876Z","inputHash":"aad9601e9a5abd68"}]} -->
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
- `node:crypto` - `randomUUID`
- [`uri.normalizeFileUri`](../utils/uri.ts.mdmd.md#normalizefileuri)
- [`artifactWatcher.CodeTrackedArtifactChange`](../watchers/artifactWatcher.ts.mdmd.md#codetrackedartifactchange) (type-only)
- [`index.GraphStore`](../../../../shared/src/index.ts.mdmd.md#graphstore)
- [`index.KnowledgeArtifact`](../../../../shared/src/index.ts.mdmd.md#knowledgeartifact)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [saveCodeChange.test.ts](./saveCodeChange.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
