# packages/shared/src/testing/fixtureOracles/cFixtureOracle.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/testing/fixtureOracles/cFixtureOracle.test.ts
- Live Doc ID: LD-test-packages-shared-src-testing-fixtureoracles-cfixtureoracle-test-ts
- Generated At: 2025-11-16T02:09:52.014Z

## Authored
### Purpose
Validate that the C oracle captures expected include/call graphs for sample fixtures and respects manual overrides when merging records.

### Notes
Exercises both the simple and modular fixture sets to confirm provenance tagging and edge ordering, checks JSON serialization stability, and ensures override helpers flag missing manual entries while still deduplicating merged outputs.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:52.014Z","inputHash":"597d0cc4ff9643a8"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- [`cFixtureOracle.CFixtureOracleOptions`](./cFixtureOracle.ts.md#cfixtureoracleoptions)
- [`cFixtureOracle.COracleEdge`](./cFixtureOracle.ts.md#coracleedge)
- [`cFixtureOracle.COracleEdgeRecord`](./cFixtureOracle.ts.md#coracleedgerecord)
- [`cFixtureOracle.COracleOverrideConfig`](./cFixtureOracle.ts.md#coracleoverrideconfig)
- [`cFixtureOracle.generateCFixtureGraph`](./cFixtureOracle.ts.md#generatecfixturegraph)
- [`cFixtureOracle.mergeCOracleEdges`](./cFixtureOracle.ts.md#mergecoracleedges)
- [`cFixtureOracle.partitionCOracleSegments`](./cFixtureOracle.ts.md#partitioncoraclesegments)
- [`cFixtureOracle.serializeCOracleEdges`](./cFixtureOracle.ts.md#serializecoracleedges)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/testing/fixtureOracles: [cFixtureOracle.ts](./cFixtureOracle.ts.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
