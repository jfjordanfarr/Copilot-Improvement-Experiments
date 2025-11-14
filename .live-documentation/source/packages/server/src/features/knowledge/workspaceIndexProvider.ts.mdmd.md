# packages/server/src/features/knowledge/workspaceIndexProvider.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/workspaceIndexProvider.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-workspaceindexprovider-ts
- Generated At: 2025-11-14T18:42:06.479Z

## Authored
### Purpose
Indexes the repository on-demand to seed artifacts, hints, and evidences when managed knowledge feeds are unavailable.

### Notes
- Walks implementation, documentation, and script globs, extracting exported symbols and inline references before emitting `ArtifactSeed`s.
- Derives relationship hints from `@link` directives, string paths, metadata code paths, and `path.join/resolve` calls.
- Analyses JavaScript/TypeScript imports to emit `depends_on` versus `references` evidences by inspecting runtime versus type usage.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.479Z","inputHash":"25f70cc48e2794bf"}]} -->
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
- `@copilot-improvement/shared` - `ArtifactSeed`, `LinkEvidence`, `LinkRelationshipKind`, `RelationshipHint`, `WorkspaceLinkContribution`, `WorkspaceLinkProvider`, `collectIdentifierUsage`, `extractLocalImportNames`, `hasRuntimeUsage`, `hasTypeUsage`
- `node:fs` - `Dirent`
- `node:fs/promises` - `fs`
- `node:path` - `path`
- `node:url` - `pathToFileURL`
- `typescript` - `ts`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [workspaceIndexProvider.test.ts](./workspaceIndexProvider.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
