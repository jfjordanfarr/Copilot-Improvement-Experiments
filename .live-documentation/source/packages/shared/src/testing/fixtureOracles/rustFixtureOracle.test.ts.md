# packages/shared/src/testing/fixtureOracles/rustFixtureOracle.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/testing/fixtureOracles/rustFixtureOracle.test.ts
- Live Doc ID: LD-test-packages-shared-src-testing-fixtureoracles-rustfixtureoracle-test-ts
- Generated At: 2025-11-16T02:09:52.059Z

## Authored
### Purpose
Exercises the Rust oracle across real fixture crates to ensure edge extraction, serialisation, and override handling remain stable over time.

### Notes
- Validates `generateRustFixtureGraph` by asserting the exact edges recovered from the `basics` and `analytics` crates, catching regressions in module indexing or relation classification.
- Locks the JSON serialiser to canonical ordering/newline conventions and checks that override partitioning exposes missing manual edges before merge results are produced.
- Keeps fixtures small so the tests execute quickly while still traversing actual file structures and `use`/`mod` syntax combinations.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:52.059Z","inputHash":"e4b28d29b4482f96"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- [`rustFixtureOracle.RustFixtureOracleOptions`](./rustFixtureOracle.ts.md#rustfixtureoracleoptions)
- [`rustFixtureOracle.RustOracleEdge`](./rustFixtureOracle.ts.md#rustoracleedge)
- [`rustFixtureOracle.RustOracleEdgeRecord`](./rustFixtureOracle.ts.md#rustoracleedgerecord)
- [`rustFixtureOracle.RustOracleOverrideConfig`](./rustFixtureOracle.ts.md#rustoracleoverrideconfig)
- [`rustFixtureOracle.generateRustFixtureGraph`](./rustFixtureOracle.ts.md#generaterustfixturegraph)
- [`rustFixtureOracle.mergeRustOracleEdges`](./rustFixtureOracle.ts.md#mergerustoracleedges)
- [`rustFixtureOracle.partitionRustOracleSegments`](./rustFixtureOracle.ts.md#partitionrustoraclesegments)
- [`rustFixtureOracle.serializeRustOracleEdges`](./rustFixtureOracle.ts.md#serializerustoracleedges)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/testing/fixtureOracles: [rustFixtureOracle.ts](./rustFixtureOracle.ts.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
