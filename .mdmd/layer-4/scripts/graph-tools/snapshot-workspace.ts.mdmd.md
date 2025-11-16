# scripts/graph-tools/snapshot-workspace.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/graph-tools/snapshot-workspace.ts
- Live Doc ID: LD-implementation-scripts-graph-tools-snapshot-workspace-ts
- Generated At: 2025-11-16T22:35:18.013Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:18.013Z","inputHash":"3280cacfd20e2862"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `DEFAULT_DB`
- Type: const
- Source: [source](../../../../scripts/graph-tools/snapshot-workspace.ts#L72)

#### `DEFAULT_OUTPUT`
- Type: const
- Source: [source](../../../../scripts/graph-tools/snapshot-workspace.ts#L73)

#### `SnapshotWorkspaceOptions`
- Type: interface
- Source: [source](../../../../scripts/graph-tools/snapshot-workspace.ts#L75)

#### `SnapshotWorkspaceResult`
- Type: interface
- Source: [source](../../../../scripts/graph-tools/snapshot-workspace.ts#L84)

#### `parseArgs`
- Type: function
- Source: [source](../../../../scripts/graph-tools/snapshot-workspace.ts#L92)

#### `writeDatabaseWithRecovery`
- Type: function
- Source: [source](../../../../scripts/graph-tools/snapshot-workspace.ts#L320)

#### `snapshotWorkspace`
- Type: function
- Source: [source](../../../../scripts/graph-tools/snapshot-workspace.ts#L372)

#### `main`
- Type: function
- Source: [source](../../../../scripts/graph-tools/snapshot-workspace.ts#L481)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:child_process` - `spawn`
- `node:fs` - `promises`
- `node:path` - `path`
- `node:process` - `process`
- `node:url` - `fileURLToPath`
- [`workspaceIndexProvider.createWorkspaceIndexProvider`](../../packages/server/src/features/knowledge/workspaceIndexProvider.ts.mdmd.md#createworkspaceindexprovider)
- [`index.ExternalArtifact`](../../packages/shared/src/index.ts.mdmd.md#externalartifact)
- [`index.ExternalLink`](../../packages/shared/src/index.ts.mdmd.md#externallink)
- [`index.ExternalSnapshot`](../../packages/shared/src/index.ts.mdmd.md#externalsnapshot)
- [`index.GraphStore`](../../packages/shared/src/index.ts.mdmd.md#graphstore)
- [`index.KnowledgeArtifact`](../../packages/shared/src/index.ts.mdmd.md#knowledgeartifact)
- [`index.KnowledgeGraphBridge`](../../packages/shared/src/index.ts.mdmd.md#knowledgegraphbridge)
- [`index.LinkInferenceOrchestrator`](../../packages/shared/src/index.ts.mdmd.md#linkinferenceorchestrator)
- [`index.LinkRelationship`](../../packages/shared/src/index.ts.mdmd.md#linkrelationship)
- [`index.createRelationshipRuleProvider`](../../packages/shared/src/index.ts.mdmd.md#createrelationshipruleprovider)
<!-- LIVE-DOC:END Dependencies -->
