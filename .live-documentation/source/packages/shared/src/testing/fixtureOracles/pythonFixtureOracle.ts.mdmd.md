# packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts
- Live Doc ID: LD-implementation-packages-shared-src-testing-fixtureoracles-pythonfixtureoracle-ts
- Generated At: 2025-11-09T22:52:12.972Z

## Authored
### Purpose
Coordinates the Python fixture oracle workflow, sourcing edge data from a worker script, normalising it, and exposing helpers that merge manual overrides so benchmark fixtures remain reproducible.

### Notes
- Resolves the Python interpreter via CLI/environment hints, spawns the `python_oracle_worker.py` helper with include/exclude/package configuration, and streams JSON input/output through stdio.
- Validates the worker payload, defaulting relation/provenance when missing, normalises paths to POSIX form, and sorts results to stabilise downstream snapshots.
- Reuses the shared partition/merge routines to surface unmatched overrides, deduplicate records, and emit deterministic JSON serialisations for git-friendly fixtures.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:12.972Z","inputHash":"77487396bd24678c"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `PythonOracleEdgeRelation`
- Type: type
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts#L5)

#### `PythonOracleProvenance`
- Type: type
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts#L6)

#### `PythonOracleEdge`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts#L8)

#### `PythonOracleEdgeRecord`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts#L15)

#### `PythonFixtureOracleOptions`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts#L21)

#### `PythonOracleOverrideEntry`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts#L31)

#### `PythonOracleOverrideConfig`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts#L37)

#### `PythonOracleSegmentPartition`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts#L41)

#### `PythonOracleMergeResult`
- Type: interface
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts#L48)

#### `generatePythonFixtureGraph`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts#L71)

#### `serializePythonOracleEdges`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts#L93)

#### `partitionPythonOracleSegments`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts#L98)

#### `mergePythonOracleEdges`
- Type: function
- Source: [source](../../../../../../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts#L134)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:child_process` - `spawn`, `spawnSync`
- `node:path` - `path`
- `node:process` - `process`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [pythonFixtureOracle.test.ts](./pythonFixtureOracle.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
