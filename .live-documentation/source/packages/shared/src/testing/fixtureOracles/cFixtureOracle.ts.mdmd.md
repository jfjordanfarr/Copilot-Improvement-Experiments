# packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts
- Live Doc ID: LD-implementation-packages-shared-src-testing-fixtureoracles-cfixtureoracle-ts
- Generated At: 2025-11-09T22:52:12.830Z

## Authored
### Purpose
Derive expected C include/call relationships from benchmark fixtures so integration tests can compare inference output against ground truth.

### Notes
Scans translation units with `glob`, strips comments, and builds function indexes to emit deduplicated edges capturing `includes` and `calls`. Override helpers let manual corrections merge with generated records while tracking gaps, and serializers keep JSON fixtures stable for regression diffs.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:12.830Z","inputHash":"f0a055600a4659f7"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `COracleEdgeRelation`
- Type: type
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts#L5)

#### `COracleProvenance`
- Type: type
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts#L7)

#### `COracleEdge`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts#L9)

#### `COracleEdgeRecord`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts#L16)

#### `CFixtureOracleOptions`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts#L22)

#### `COracleOverrideEntry`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts#L29)

#### `COracleOverrideConfig`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts#L35)

#### `COracleSegmentPartition`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts#L39)

#### `COracleMergeResult`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts#L46)

#### `generateCFixtureGraph`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts#L82)

#### `serializeCOracleEdges`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts#L155)

#### `partitionCOracleSegments`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts#L160)

#### `mergeCOracleEdges`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts#L196)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `glob` - `globSync`
- `node:fs` - `fs`
- `node:path` - `path`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [cFixtureOracle.test.ts](./cFixtureOracle.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
