# packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.test.ts
- Live Doc ID: LD-test-packages-shared-src-testing-fixtureoracles-pythonfixtureoracle-test-ts
- Generated At: 2025-11-09T22:52:12.948Z

## Authored
### Purpose
Locks in the Python oracle's post-processing behaviour by exercising partitioning, merge, and serialisation helpers against representative fixture graphs.

### Notes
- Uses a hand-crafted override configuration to confirm unmatched manual entries are surfaced while deduplicated edges remain tagged as automatic or manual.
- Asserts merged records preserve deterministic sorting and newline-terminated JSON so regenerated fixtures stay diff-friendly.
- Focuses on synchronous helpers; full worker integration is covered via higher-level benchmark runs.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:12.948Z","inputHash":"068b041749249a8d"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`pythonFixtureOracle.PythonOracleEdge`](./pythonFixtureOracle.ts.mdmd.md#pythonoracleedge)
- [`pythonFixtureOracle.PythonOracleOverrideConfig`](./pythonFixtureOracle.ts.mdmd.md#pythonoracleoverrideconfig)
- [`pythonFixtureOracle.mergePythonOracleEdges`](./pythonFixtureOracle.ts.mdmd.md#mergepythonoracleedges)
- [`pythonFixtureOracle.partitionPythonOracleSegments`](./pythonFixtureOracle.ts.mdmd.md#partitionpythonoraclesegments)
- [`pythonFixtureOracle.serializePythonOracleEdges`](./pythonFixtureOracle.ts.mdmd.md#serializepythonoracleedges)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/testing/fixtureOracles: [pythonFixtureOracle.ts](./pythonFixtureOracle.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
