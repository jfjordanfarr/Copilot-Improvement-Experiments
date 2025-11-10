# packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.test.ts
- Live Doc ID: LD-test-packages-shared-src-testing-fixtureoracles-typescriptfixtureoracle-test-ts
- Generated At: 2025-11-09T22:52:13.060Z

## Authored
### Purpose
Pins the TypeScript oracle’s behaviour by checking fixture graph extraction, deterministic serialisation, and manual override bookkeeping through Vitest scenarios.

### Notes
- Covers both the `basic` and `layered` fixture trees to ensure runtime/type heuristics from `typeScriptAstUtils` stay aligned with actual compiler output.
- Verifies JSON serialisation order and newline termination alongside override merging/partitioning so regenerated fixtures stay reproducible and highlight missing manual edges.
- Exercises the code paths that resolve modules and classify imports without invoking the Python/LLM tooling, keeping the suite fast but comprehensive.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:13.060Z","inputHash":"75df8b8f53fcc412"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- [`typeScriptFixtureOracle.OracleEdge`](./typeScriptFixtureOracle.ts.mdmd.md#oracleedge)
- [`typeScriptFixtureOracle.OracleEdgeRecord`](./typeScriptFixtureOracle.ts.mdmd.md#oracleedgerecord)
- [`typeScriptFixtureOracle.OracleOverrideConfig`](./typeScriptFixtureOracle.ts.mdmd.md#oracleoverrideconfig)
- [`typeScriptFixtureOracle.generateTypeScriptFixtureGraph`](./typeScriptFixtureOracle.ts.mdmd.md#generatetypescriptfixturegraph)
- [`typeScriptFixtureOracle.mergeOracleEdges`](./typeScriptFixtureOracle.ts.mdmd.md#mergeoracleedges)
- [`typeScriptFixtureOracle.partitionOracleSegments`](./typeScriptFixtureOracle.ts.mdmd.md#partitionoraclesegments)
- [`typeScriptFixtureOracle.serializeOracleEdges`](./typeScriptFixtureOracle.ts.mdmd.md#serializeoracleedges)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/language: [typeScriptAstUtils.ts](../../language/typeScriptAstUtils.ts.mdmd.md)
- packages/shared/src/testing/fixtureOracles: [typeScriptFixtureOracle.ts](./typeScriptFixtureOracle.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
