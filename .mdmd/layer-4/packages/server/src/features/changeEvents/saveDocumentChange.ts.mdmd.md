# packages/server/src/features/changeEvents/saveDocumentChange.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/changeEvents/saveDocumentChange.ts
- Live Doc ID: LD-implementation-packages-server-src-features-changeevents-savedocumentchange-ts
- Generated At: 2025-11-16T22:35:14.947Z

## Authored
### Purpose
Persists markdown change events and any accompanying inference output into the graph store, completing the doc-to-diagnostics loop captured in [2025-10-17 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-17.SUMMARIZED.md).

### Notes
- Generates canonical artifact records and change-event IDs even when inference metadata is absent, ensuring downstream diagnostics still learn about the save.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:14.947Z","inputHash":"ffbe53d0dcb77906"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `PersistedDocumentChange`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/changeEvents/saveDocumentChange.ts#L12)

#### `SaveDocumentChangeOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/changeEvents/saveDocumentChange.ts#L17)

#### `persistInferenceResult`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/changeEvents/saveDocumentChange.ts#L25)

#### `saveDocumentChange`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/changeEvents/saveDocumentChange.ts#L59)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:crypto` - `randomUUID`
- [`uri.normalizeFileUri`](../utils/uri.ts.mdmd.md#normalizefileuri)
- [`artifactWatcher.DocumentTrackedArtifactChange`](../watchers/artifactWatcher.ts.mdmd.md#documenttrackedartifactchange) (type-only)
- [`index.GraphStore`](../../../../shared/src/index.ts.mdmd.md#graphstore)
- [`index.KnowledgeArtifact`](../../../../shared/src/index.ts.mdmd.md#knowledgeartifact)
- [`index.LinkInferenceRunResult`](../../../../shared/src/index.ts.mdmd.md#linkinferencerunresult)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [saveDocumentChange.test.ts](./saveDocumentChange.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
