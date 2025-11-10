# packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts
- Live Doc ID: LD-implementation-packages-shared-src-testing-fixtureoracles-rubyfixtureoracle-ts
- Generated At: 2025-11-09T22:52:13.004Z

## Authored
### Purpose
Produces the Ruby fixture dependency graph by crawling source trees, extracting `require_relative` edges, and offering utilities to merge manual overrides for benchmark baselines.

### Notes
- Walks the fixture root with optional include/exclude filters, ignoring transient folders, and records each `.rb` file's contents for analysis.
- Normalises edges by resolving `require_relative` targets to fixture-relative paths, skipping self-references, and deduplicating via a composite key.
- Shares the partition/merge/serialisation helpers that highlight missing overrides and maintain sorted JSON payloads used by integration fixtures.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:13.004Z","inputHash":"56eab809e0a68afd"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `RubyOracleEdgeRelation`
- Type: type
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts#L4)

#### `RubyOracleProvenance`
- Type: type
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts#L6)

#### `RubyOracleEdge`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts#L8)

#### `RubyOracleEdgeRecord`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts#L15)

#### `RubyFixtureOracleOptions`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts#L21)

#### `RubyOracleOverrideEntry`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts#L27)

#### `RubyOracleOverrideConfig`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts#L33)

#### `RubyOracleSegmentPartition`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts#L37)

#### `RubyOracleMergeResult`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts#L44)

#### `generateRubyFixtureGraph`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts#L61)

#### `serializeRubyOracleEdges`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts#L80)

#### `partitionRubyOracleSegments`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts#L85)

#### `mergeRubyOracleEdges`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts#L121)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
- `node:path` - `path`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [rubyFixtureOracle.test.ts](./rubyFixtureOracle.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
