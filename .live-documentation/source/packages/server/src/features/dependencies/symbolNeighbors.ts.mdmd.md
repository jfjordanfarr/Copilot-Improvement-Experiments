# packages/server/src/features/dependencies/symbolNeighbors.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/dependencies/symbolNeighbors.ts
- Live Doc ID: LD-implementation-packages-server-src-features-dependencies-symbolneighbors-ts
- Generated At: 2025-11-14T18:42:06.305Z

## Authored
### Purpose
Exposes an API for finding graph neighbors of a symbol, returning related implementations, tests, and documentation to support change impact analysis.

### Notes
- Aggregates neighbor relationships by kind and depth, allowing callers to present grouped results while preserving underlying URIs.
- Relies on shared graph traversal utilities so symbol inspection stays consistent with dependency inspection behaviour.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.305Z","inputHash":"b0f2cc1c5f931e88"}]} -->
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
- `@copilot-improvement/shared` - `GraphStore`, `InspectSymbolNeighborsResult`, `InspectSymbolNeighborsSummary`, `KnowledgeArtifact`, `LinkRelationshipKind`, `LinkedArtifactSummary`, `SymbolNeighborGroup`, `SymbolNeighborNode`
- [`uri.normalizeFileUri`](../utils/uri.ts.mdmd.md#normalizefileuri)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [symbolNeighbors.test.ts](./symbolNeighbors.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
