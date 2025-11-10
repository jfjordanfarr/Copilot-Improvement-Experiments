# packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts
- Live Doc ID: LD-implementation-packages-shared-src-testing-fixtureoracles-javafixtureoracle-ts
- Generated At: 2025-11-09T22:52:12.931Z

## Authored
### Purpose
Builds the deterministic Java fixture graph used by benchmark suites, extracting import/usage edges from source trees and preparing merged outputs that incorporate manual overrides when needed.

### Notes
- Walks the fixture root with include/exclude filters, infers package-qualified class names, and resolves imports to relative paths while ignoring JDK references and self-imports.
- Classifies each import as `uses` when constructors, generics, declarations, or method references appear; otherwise preserves an `imports` edge and tracks the strongest relation via precedence rules.
- Provides helpers to partition auto edges against override configs, serialise sorted JSON payloads, and merge manual adjustments so downstream fixtures stay stable across regenerations.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:12.931Z","inputHash":"f12cac9c1f8e314f"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `JavaOracleEdgeRelation`
- Type: type
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts#L4)

#### `JavaOracleProvenance`
- Type: type
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts#L6)

#### `JavaOracleEdge`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts#L8)

#### `JavaOracleEdgeRecord`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts#L15)

#### `JavaFixtureOracleOptions`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts#L21)

#### `JavaOracleOverrideEntry`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts#L27)

#### `JavaOracleOverrideConfig`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts#L33)

#### `JavaOracleSegmentPartition`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts#L37)

#### `JavaOracleMergeResult`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts#L44)

#### `generateJavaFixtureGraph`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts#L67)

#### `serializeJavaOracleEdges`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts#L86)

#### `partitionJavaOracleSegments`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts#L91)

#### `mergeJavaOracleEdges`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts#L127)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
- `node:path` - `path`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [javaFixtureOracle.test.ts](./javaFixtureOracle.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
