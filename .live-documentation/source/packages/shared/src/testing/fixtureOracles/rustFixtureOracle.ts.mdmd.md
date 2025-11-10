# packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts
- Live Doc ID: LD-implementation-packages-shared-src-testing-fixtureoracles-rustfixtureoracle-ts
- Generated At: 2025-11-09T22:52:13.050Z

## Authored
### Purpose
Extracts inter-module edges from Rust fixture crates and exposes utilities that sort, serialise, and merge the resulting graph for benchmark consumption.

### Notes
- Walks fixture directories while honouring include/exclude filters, inferring module identifiers (including `mod.rs` conventions) to build a lookup for resolving references.
- Parses `use` statements with basic alias handling, downgrades contextual prefixes (`crate`, `self`, `super`), and classifies edges as `uses` when concrete symbols are imported.
- Supplements `use` analysis with `module::symbol` scans, applies precedence so stronger relations win dedupe races, and shares partition/merge helpers to surface manual override gaps.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:13.050Z","inputHash":"5dbc0ce97e0b13ba"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `RustOracleEdgeRelation`
- Type: type
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts#L4)

#### `RustOracleProvenance`
- Type: type
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts#L6)

#### `RustOracleEdge`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts#L8)

#### `RustOracleEdgeRecord`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts#L15)

#### `RustFixtureOracleOptions`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts#L21)

#### `RustOracleOverrideEntry`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts#L27)

#### `RustOracleOverrideConfig`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts#L33)

#### `RustOracleSegmentPartition`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts#L37)

#### `RustOracleMergeResult`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts#L44)

#### `generateRustFixtureGraph`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts#L67)

#### `serializeRustOracleEdges`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts#L92)

#### `partitionRustOracleSegments`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts#L97)

#### `mergeRustOracleEdges`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts#L133)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
- `node:path` - `path`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [rustFixtureOracle.test.ts](./rustFixtureOracle.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
