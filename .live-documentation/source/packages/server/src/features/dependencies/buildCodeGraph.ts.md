# packages/server/src/features/dependencies/buildCodeGraph.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/dependencies/buildCodeGraph.ts
- Live Doc ID: LD-implementation-packages-server-src-features-dependencies-buildcodegraph-ts
- Generated At: 2025-11-16T02:09:51.194Z

## Authored
### Purpose
Builds the workspace dependency graph by ingesting artifacts, relationships, and ripple hints into the graph store.

### Notes
- Orchestrates data from analyzers and coverage manifests, translating them into graph edges with normalized URIs.
- Ensures graph rebuilds are idempotent so repeated runs during integration tests produce stable fixtures.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.194Z","inputHash":"19070e624d53d251"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `CodeImpactEdge`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/dependencies/buildCodeGraph.ts#L4)

#### `BuildCodeGraphOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/dependencies/buildCodeGraph.ts#L17)

#### `buildCodeImpactGraph`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/dependencies/buildCodeGraph.ts#L32)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `GraphStore`, `KnowledgeArtifact`, `LinkRelationshipKind`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [inspectDependencies.test.ts](./inspectDependencies.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
