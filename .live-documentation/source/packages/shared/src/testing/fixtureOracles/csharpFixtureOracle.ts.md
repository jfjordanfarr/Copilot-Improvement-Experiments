# packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts
- Live Doc ID: LD-implementation-packages-shared-src-testing-fixtureoracles-csharpfixtureoracle-ts
- Generated At: 2025-11-16T02:09:52.030Z

## Authored
### Purpose
Construct ground-truth dependency edges for C# benchmark fixtures by scanning namespaces, type definitions, and usage sites.

### Notes
Parses each file for declared types, `using` directives, and identifier references, then resolves candidates via namespace/import heuristics to emit `imports` vs `uses` edges with provenance. Override helpers mirror the C oracle, letting manual corrections merge or flag missing entries while keeping serialized records sorted for fixture regeneration.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:52.030Z","inputHash":"4885a1a99bfc69b6"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `CSharpOracleEdgeRelation`
- Type: type
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts#L4)

#### `CSharpOracleProvenance`
- Type: type
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts#L6)

#### `CSharpOracleEdge`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts#L8)

#### `CSharpOracleEdgeRecord`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts#L15)

#### `CSharpFixtureOracleOptions`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts#L21)

#### `CSharpOracleOverrideEntry`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts#L27)

#### `CSharpOracleOverrideConfig`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts#L33)

#### `CSharpOracleSegmentPartition`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts#L37)

#### `CSharpOracleMergeResult`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts#L44)

#### `generateCSharpFixtureGraph`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts#L110)

#### `serializeCSharpOracleEdges`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts#L141)

#### `partitionCSharpOracleSegments`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts#L146)

#### `mergeCSharpOracleEdges`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts#L182)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
- `node:path` - `path`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [csharpFixtureOracle.test.ts](./csharpFixtureOracle.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
