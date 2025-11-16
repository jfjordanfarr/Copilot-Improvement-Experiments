# packages/shared/src/testing/fixtureOracles/javaFixtureOracle.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/testing/fixtureOracles/javaFixtureOracle.test.ts
- Live Doc ID: LD-test-packages-shared-src-testing-fixtureoracles-javafixtureoracle-test-ts
- Generated At: 2025-11-16T02:09:52.034Z

## Authored
### Purpose
Exercises the Java fixture oracle helpers to ensure they extract, normalise, and post-process import/usage edges exactly as expected before the data feeds benchmark fixtures.

### Notes
- The "basic" fixture snapshot acts as a golden dataset that verifies `generateJavaFixtureGraph` walks package roots, resolves imports, and classifies relations deterministically.
- Serialisation and merge tests safeguard the reporting pipeline by pinning down formatting/ordering guarantees and manual override behaviour, preventing regressions when new edge types or provenance rules land.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:52.034Z","inputHash":"01c95677f4e7587e"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- [`javaFixtureOracle.JavaFixtureOracleOptions`](./javaFixtureOracle.ts.md#javafixtureoracleoptions)
- [`javaFixtureOracle.JavaOracleEdge`](./javaFixtureOracle.ts.md#javaoracleedge)
- [`javaFixtureOracle.JavaOracleEdgeRecord`](./javaFixtureOracle.ts.md#javaoracleedgerecord)
- [`javaFixtureOracle.JavaOracleOverrideConfig`](./javaFixtureOracle.ts.md#javaoracleoverrideconfig)
- [`javaFixtureOracle.generateJavaFixtureGraph`](./javaFixtureOracle.ts.md#generatejavafixturegraph)
- [`javaFixtureOracle.mergeJavaOracleEdges`](./javaFixtureOracle.ts.md#mergejavaoracleedges)
- [`javaFixtureOracle.partitionJavaOracleSegments`](./javaFixtureOracle.ts.md#partitionjavaoraclesegments)
- [`javaFixtureOracle.serializeJavaOracleEdges`](./javaFixtureOracle.ts.md#serializejavaoracleedges)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/testing/fixtureOracles: [javaFixtureOracle.ts](./javaFixtureOracle.ts.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
