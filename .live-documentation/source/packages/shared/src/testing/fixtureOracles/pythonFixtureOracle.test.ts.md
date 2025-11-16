# packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.test.ts
- Live Doc ID: LD-test-packages-shared-src-testing-fixtureoracles-pythonfixtureoracle-test-ts
- Generated At: 2025-11-16T02:09:52.042Z

## Authored
### Purpose
Locks in the Python oracle's post-processing behaviour by exercising partitioning, merge, and serialisation helpers against representative fixture graphs.

### Notes
- Uses a hand-crafted override configuration to confirm unmatched manual entries are surfaced while deduplicated edges remain tagged as automatic or manual.
- Asserts merged records preserve deterministic sorting and newline-terminated JSON so regenerated fixtures stay diff-friendly.
- Focuses on synchronous helpers; full worker integration is covered via higher-level benchmark runs.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:52.042Z","inputHash":"bc8dd5df5d642a22"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`pythonFixtureOracle.PythonOracleEdge`](./pythonFixtureOracle.ts.md#pythonoracleedge)
- [`pythonFixtureOracle.PythonOracleOverrideConfig`](./pythonFixtureOracle.ts.md#pythonoracleoverrideconfig)
- [`pythonFixtureOracle.mergePythonOracleEdges`](./pythonFixtureOracle.ts.md#mergepythonoracleedges)
- [`pythonFixtureOracle.partitionPythonOracleSegments`](./pythonFixtureOracle.ts.md#partitionpythonoraclesegments)
- [`pythonFixtureOracle.serializePythonOracleEdges`](./pythonFixtureOracle.ts.md#serializepythonoracleedges)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/testing/fixtureOracles: [pythonFixtureOracle.ts](./pythonFixtureOracle.ts.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
