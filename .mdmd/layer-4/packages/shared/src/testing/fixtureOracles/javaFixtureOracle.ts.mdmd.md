# packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts
- Live Doc ID: LD-implementation-packages-shared-src-testing-fixtureoracles-javafixtureoracle-ts
- Generated At: 2025-11-16T22:34:13.410Z

## Authored
### Purpose
Analyzes Java fixtures to emit import and inheritance edges, giving our polyglot benchmarks JVM-accurate relationships without invoking `javac` <../../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-04.SUMMARIZED.md#turn-34-build-regeneration-cli--overrides-lines-3961-4260>.

### Notes
- Documented on Nov 9 as the canonical surface backing the Java benchmark expectations; lean on that MDMD guidance when expanding fixtures <../../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-09.md#L4688-L4710>.
- Verified within the Nov 16 unit sweep; rerun `npm run test:unit -- javaFixtureOracle` after parser or override changes <../../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-16.md#L2928-L2960>.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:13.410Z","inputHash":"6388a4ae4d25dd17"}]} -->
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
