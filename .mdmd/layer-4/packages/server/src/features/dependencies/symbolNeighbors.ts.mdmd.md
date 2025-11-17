# packages/server/src/features/dependencies/symbolNeighbors.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/dependencies/symbolNeighbors.ts
- Live Doc ID: LD-implementation-packages-server-src-features-dependencies-symbolneighbors-ts
- Generated At: 2025-11-16T22:35:15.194Z

## Authored
### Purpose
Traverses the Live Documentation graph to assemble neighbor summaries for a requested artifact, powering the dependency quick pick delivered in [2025-10-23 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-23.SUMMARIZED.md) alongside the US4 diagnostics tooling push.

### Notes
- Uses bounded breadth-first traversal with depth and count guards so the `inspectSymbolNeighbors` CLI and extension command stay responsive even on dense workspaces.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:15.194Z","inputHash":"e2b3d97219d4251e"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `InspectSymbolNeighborsOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/dependencies/symbolNeighbors.ts#L14)

#### `inspectSymbolNeighbors`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/dependencies/symbolNeighbors.ts#L32)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`uri.normalizeFileUri`](../utils/uri.ts.mdmd.md#normalizefileuri)
- [`index.GraphStore`](../../../../shared/src/index.ts.mdmd.md#graphstore)
- [`index.InspectSymbolNeighborsResult`](../../../../shared/src/index.ts.mdmd.md#inspectsymbolneighborsresult)
- [`index.InspectSymbolNeighborsSummary`](../../../../shared/src/index.ts.mdmd.md#inspectsymbolneighborssummary)
- [`index.KnowledgeArtifact`](../../../../shared/src/index.ts.mdmd.md#knowledgeartifact)
- [`index.LinkRelationshipKind`](../../../../shared/src/index.ts.mdmd.md#linkrelationshipkind)
- [`index.LinkedArtifactSummary`](../../../../shared/src/index.ts.mdmd.md#linkedartifactsummary)
- [`index.SymbolNeighborGroup`](../../../../shared/src/index.ts.mdmd.md#symbolneighborgroup)
- [`index.SymbolNeighborNode`](../../../../shared/src/index.ts.mdmd.md#symbolneighbornode)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [symbolNeighbors.test.ts](./symbolNeighbors.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
