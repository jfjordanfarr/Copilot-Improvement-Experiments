# packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts
- Live Doc ID: LD-implementation-packages-shared-src-testing-fixtureoracles-typescriptfixtureoracle-ts
- Generated At: 2025-11-09T22:52:13.082Z

## Authored
### Purpose
Builds the TypeScript fixture dependency graph by parsing source files with the TypeScript compiler API, classifying imports as runtime or type-only, and providing helpers to merge manual overrides for benchmarks.

### Notes
- Configures compiler options rooted at the fixture directory, walks all `.ts`/`.tsx` variants, and generates ASTs to inspect import/export declarations plus CommonJS-style import-equals statements.
- Leverages `typeScriptAstUtils` to capture identifier usage, detect type-only specifiers, coerce declaration resolutions to `type-import` provenance, and normalises POSIX paths for deterministic edges.
- Module resolution wraps `typescript` host callbacks so only files inside the fixture root become targets, after which standard partition/merge routines deduplicate edges and expose unmatched overrides.

#### TypeScriptEdgeRecord
Legacy alias retained for CLI compatibility; see [`OracleEdgeRecord`](#oracleedgerecord).

#### TypeScriptOverrideConfig
Legacy alias resolving to [`OracleOverrideConfig`](#oracleoverrideconfig) to minimise downstream churn.

#### mergeTypeScriptOracleEdges
Alias preserved for [`mergeOracleEdges`](#mergeoracleedges) to support prior import paths.

#### serializeTypeScriptOracleEdges
Alias preserved for [`serializeOracleEdges`](#serializeoracleedges) so benchmark tooling retains stable references.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:13.082Z","inputHash":"69bc8cb54d35ca13"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `OracleEdgeRelation`
- Type: type
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts#L13)

#### `OracleEdgeProvenance`
- Type: type
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts#L15)

#### `OracleEdge`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts#L17)

#### `OracleEdgeRecord`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts#L24)

#### `TypeScriptFixtureOracleOptions`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts#L30)

#### `OracleOverrideEntry`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts#L36)

#### `OracleOverrideConfig`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts#L42)

#### `OracleSegmentPartition`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts#L46)

#### `OracleMergeResult`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts#L53)

#### `generateTypeScriptFixtureGraph`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts#L75)

#### `serializeOracleEdges`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts#L188)

#### `partitionOracleSegments`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts#L193)

#### `mergeOracleEdges`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts#L229)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
- `node:path` - `path`
- [`typeScriptAstUtils.collectIdentifierUsage`](../../language/typeScriptAstUtils.ts.mdmd.md#collectidentifierusage)
- [`typeScriptAstUtils.extractLocalImportNames`](../../language/typeScriptAstUtils.ts.mdmd.md#extractlocalimportnames)
- [`typeScriptAstUtils.hasRuntimeUsage`](../../language/typeScriptAstUtils.ts.mdmd.md#hasruntimeusage)
- [`typeScriptAstUtils.hasTypeUsage`](../../language/typeScriptAstUtils.ts.mdmd.md#hastypeusage)
- [`typeScriptAstUtils.isLikelyTypeDefinitionSpecifier`](../../language/typeScriptAstUtils.ts.mdmd.md#islikelytypedefinitionspecifier)
- `typescript` - `ts`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [typeScriptFixtureOracle.test.ts](./typeScriptFixtureOracle.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
