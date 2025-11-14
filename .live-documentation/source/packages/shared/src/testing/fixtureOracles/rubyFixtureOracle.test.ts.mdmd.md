# packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.test.ts
- Live Doc ID: LD-test-packages-shared-src-testing-fixtureoracles-rubyfixtureoracle-test-ts
- Generated At: 2025-11-14T18:42:06.878Z

## Authored
### Purpose
Validates the Ruby oracle end-to-end, covering graph generation across bundled fixtures plus the helper routines that serialise and merge override data.

### Notes
- Runs the `basic` and `cli` fixture directories to ensure `generateRubyFixtureGraph` captures nested `require_relative` chains with stable ordering.
- Confirms JSON serialisation stays deterministic and that override partitioning surfaces missing manual edges before merged output is produced.
- File-system heavy integration is limited to the small fixture bundles so tests remain fast while still exercising real directory structures.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.878Z","inputHash":"87ec4d90f0d84799"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- [`rubyFixtureOracle.RubyFixtureOracleOptions`](./rubyFixtureOracle.ts.mdmd.md#rubyfixtureoracleoptions)
- [`rubyFixtureOracle.RubyOracleEdge`](./rubyFixtureOracle.ts.mdmd.md#rubyoracleedge)
- [`rubyFixtureOracle.RubyOracleEdgeRecord`](./rubyFixtureOracle.ts.mdmd.md#rubyoracleedgerecord)
- [`rubyFixtureOracle.RubyOracleOverrideConfig`](./rubyFixtureOracle.ts.mdmd.md#rubyoracleoverrideconfig)
- [`rubyFixtureOracle.generateRubyFixtureGraph`](./rubyFixtureOracle.ts.mdmd.md#generaterubyfixturegraph)
- [`rubyFixtureOracle.mergeRubyOracleEdges`](./rubyFixtureOracle.ts.mdmd.md#mergerubyoracleedges)
- [`rubyFixtureOracle.partitionRubyOracleSegments`](./rubyFixtureOracle.ts.mdmd.md#partitionrubyoraclesegments)
- [`rubyFixtureOracle.serializeRubyOracleEdges`](./rubyFixtureOracle.ts.mdmd.md#serializerubyoracleedges)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/testing/fixtureOracles: [rubyFixtureOracle.ts](./rubyFixtureOracle.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
