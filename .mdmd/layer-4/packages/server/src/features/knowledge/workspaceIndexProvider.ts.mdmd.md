# packages/server/src/features/knowledge/workspaceIndexProvider.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/workspaceIndexProvider.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-workspaceindexprovider-ts
- Generated At: 2025-11-16T22:35:15.937Z

## Authored
### Purpose
Scans the workspace for implementation, documentation, and script artifacts so integration environments can seed the graph with code/doc nodes, relationship hints, and link evidence before real watchers run.

### Notes
- First composed during the Oct 19 ingestion build to unblock integration tests; see [2025-10-19 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-19.SUMMARIZED.md).
- Extended on Oct 30 to parse MDMD identifiers and section symbols for audit tooling, as recorded in [2025-10-30 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-30.SUMMARIZED.md).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:15.937Z","inputHash":"7ec9545f461a73d0"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `DEFAULT_CODE_EXTENSIONS`
- Type: const
- Source: [source](../../../../../../../packages/server/src/features/knowledge/workspaceIndexProvider.ts#L30)

#### `DEFAULT_DOC_EXTENSIONS`
- Type: const
- Source: [source](../../../../../../../packages/server/src/features/knowledge/workspaceIndexProvider.ts#L42)

#### `ExportedSymbolKind`
- Type: type
- Source: [source](../../../../../../../packages/server/src/features/knowledge/workspaceIndexProvider.ts#L44)

#### `ExportedSymbolMetadata`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/workspaceIndexProvider.ts#L55)

#### `DocumentSymbolReferenceMetadata`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/workspaceIndexProvider.ts#L62)

#### `createWorkspaceIndexProvider`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/knowledge/workspaceIndexProvider.ts#L80)

##### `createWorkspaceIndexProvider` — Summary
Lightweight workspace indexer that seeds implementation artifacts so markdown linkage heuristics
have viable candidates. Intended primarily for integration and dogfooding scenarios.
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `Dirent`
- `node:fs/promises` - `fs`
- `node:path` - `path`
- `node:url` - `pathToFileURL`
- [`index.ArtifactSeed`](../../../../shared/src/index.ts.mdmd.md#artifactseed)
- [`index.LinkEvidence`](../../../../shared/src/index.ts.mdmd.md#linkevidence)
- [`index.LinkRelationshipKind`](../../../../shared/src/index.ts.mdmd.md#linkrelationshipkind)
- [`index.RelationshipHint`](../../../../shared/src/index.ts.mdmd.md#relationshiphint)
- [`index.WorkspaceLinkContribution`](../../../../shared/src/index.ts.mdmd.md#workspacelinkcontribution)
- [`index.WorkspaceLinkProvider`](../../../../shared/src/index.ts.mdmd.md#workspacelinkprovider)
- [`index.collectIdentifierUsage`](../../../../shared/src/index.ts.mdmd.md#collectidentifierusage)
- [`index.extractLocalImportNames`](../../../../shared/src/index.ts.mdmd.md#extractlocalimportnames)
- [`index.hasRuntimeUsage`](../../../../shared/src/index.ts.mdmd.md#hasruntimeusage)
- [`index.hasTypeUsage`](../../../../shared/src/index.ts.mdmd.md#hastypeusage)
- `typescript` - `ts`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [workspaceIndexProvider.test.ts](./workspaceIndexProvider.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
