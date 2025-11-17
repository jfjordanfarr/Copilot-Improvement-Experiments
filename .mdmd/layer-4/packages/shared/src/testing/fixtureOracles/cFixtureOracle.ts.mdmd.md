# packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts
- Live Doc ID: LD-implementation-packages-shared-src-testing-fixtureoracles-cfixtureoracle-ts
- Generated At: 2025-11-16T22:34:13.374Z

## Authored
### Purpose
Parses the C benchmark fixtures to infer `#include` and function-call edges so our analyzer’s C pipeline can be diffed against compiler-grounded expectations <../../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-04.SUMMARIZED.md#turn-34-build-regeneration-cli--overrides-lines-3961-4260>.

### Notes
- Early Nov 5 failures around multi-target call graphs led to tightened edge classification; keep the regression suite handy if new macros or includes expand the surface <../../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-05.md#L4240-L4320>.
- Still validated in the Nov 16 unit run, so rerun `npm run test:unit -- cFixtureOracle` after parser or glob changes <../../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-16.md#L2928-L2960>.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:13.374Z","inputHash":"628c13333eacedb4"}]} -->
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
