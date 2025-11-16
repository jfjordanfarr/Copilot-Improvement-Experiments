# packages/server/src/features/knowledge/staticFeedWorkspaceProvider.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/staticFeedWorkspaceProvider.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-staticfeedworkspaceprovider-ts
- Generated At: 2025-11-16T02:09:51.432Z

## Authored
### Purpose
Provides a workspace link provider that bootstraps artifacts and evidences from JSON feed files when no external ingestion is configured.

### Notes
- Scans `data/knowledge-feeds/*.json`, validating artifact shapes and resolving IDs/paths into canonical URIs.
- Produces `ArtifactSeed`s and evidences so the graph can seed diagnostics during fallback scenarios without hitting real feeds.
- Deduplicates seeds by URI and logs missing paths to aid authors when feed fixtures drift from the repository layout.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.432Z","inputHash":"853ac674a62f952f"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `StaticFeedWorkspaceProviderOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/staticFeedWorkspaceProvider.ts#L20)

#### `createStaticFeedWorkspaceProvider`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/knowledge/staticFeedWorkspaceProvider.ts#L61)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `ArtifactSeed`, `LinkRelationshipKind`, `WorkspaceLinkContribution`, `WorkspaceLinkProvider`, `WorkspaceLinkProviderContext` (type-only)
- `node:fs` - `fs`, `fsp`
- `node:path` - `path`
- `node:url` - `pathToFileURL`
<!-- LIVE-DOC:END Dependencies -->
