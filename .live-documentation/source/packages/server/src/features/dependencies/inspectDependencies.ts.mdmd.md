# packages/server/src/features/dependencies/inspectDependencies.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/dependencies/inspectDependencies.ts
- Live Doc ID: LD-implementation-packages-server-src-features-dependencies-inspectdependencies-ts
- Generated At: 2025-11-14T18:42:06.297Z

## Authored
### Purpose
Implements the command that traverses the workspace graph to list inbound and outbound dependencies for a given artifact, grouping results for diagnostics and CLI surfaces.

### Notes
- Leverages graph store queries to fetch relationships, normalising URIs before returning them to callers.
- Supports filtering by relationship kind and depth, keeping responses bounded for large projects.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.297Z","inputHash":"60e27fd97623f8e4"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `InspectDependenciesOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/dependencies/inspectDependencies.ts#L13)

#### `inspectDependencies`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/dependencies/inspectDependencies.ts#L20)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `DependencyGraphEdge`, `GraphStore`, `InspectDependenciesResult`, `InspectDependenciesSummary`, `KnowledgeArtifact`, `LinkRelationshipKind`
- [`buildCodeGraph.CodeImpactEdge`](./buildCodeGraph.ts.mdmd.md#codeimpactedge)
- [`buildCodeGraph.buildCodeImpactGraph`](./buildCodeGraph.ts.mdmd.md#buildcodeimpactgraph)
- [`uri.normalizeFileUri`](../utils/uri.ts.mdmd.md#normalizefileuri)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [inspectDependencies.test.ts](./inspectDependencies.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
