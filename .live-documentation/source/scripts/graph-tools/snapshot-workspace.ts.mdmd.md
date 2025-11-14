# scripts/graph-tools/snapshot-workspace.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/graph-tools/snapshot-workspace.ts
- Live Doc ID: LD-implementation-scripts-graph-tools-snapshot-workspace-ts
- Generated At: 2025-11-14T16:30:22.088Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T16:30:22.088Z","inputHash":"2e4caa1ecbc4adec"}]} -->
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
- `@copilot-improvement/shared` - `ExternalArtifact`, `ExternalLink`, `ExternalSnapshot`, `GraphStore`, `KnowledgeArtifact`, `KnowledgeGraphBridge`, `LinkInferenceOrchestrator`, `LinkRelationship`, `createRelationshipRuleProvider`
- `node:child_process` - `spawn`
- `node:fs` - `fs`
- `node:path` - `path`
- `node:process` - `process`
- `node:url` - `fileURLToPath`
- [`workspaceIndexProvider.createWorkspaceIndexProvider`](../../packages/server/src/features/knowledge/workspaceIndexProvider.ts.mdmd.md#createworkspaceindexprovider)
<!-- LIVE-DOC:END Dependencies -->
