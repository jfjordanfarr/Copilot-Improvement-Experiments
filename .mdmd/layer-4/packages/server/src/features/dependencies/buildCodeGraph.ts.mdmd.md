# packages/server/src/features/dependencies/buildCodeGraph.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/dependencies/buildCodeGraph.ts
- Live Doc ID: LD-implementation-packages-server-src-features-dependencies-buildcodegraph-ts
- Generated At: 2025-11-16T22:35:15.028Z

## Authored
### Purpose
Performs breadth-first traversal over incoming dependency links to generate the impact edges consumed by the T039 dependency quick pick described in [2025-10-20 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-20.SUMMARIZED.md).

### Notes
- Caps traversal depth and link kinds to keep dependency fan-out predictable while still honouring transitive chains for the inspect/quick pick experiences.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:15.028Z","inputHash":"0c8c05a5e7d7d964"}]} -->
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
- [`index.GraphStore`](../../../../shared/src/index.ts.mdmd.md#graphstore)
- [`index.KnowledgeArtifact`](../../../../shared/src/index.ts.mdmd.md#knowledgeartifact)
- [`index.LinkRelationshipKind`](../../../../shared/src/index.ts.mdmd.md#linkrelationshipkind)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [inspectDependencies.test.ts](./inspectDependencies.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
