# packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.test.ts
- Live Doc ID: LD-test-packages-shared-src-testing-fixtureoracles-csharpfixtureoracle-test-ts
- Generated At: 2025-11-16T02:09:52.023Z

## Authored
### Purpose
Prove the C# oracle detects expected type relationships in fixture workspaces and handles manual override merges.

### Notes
Validates the full graph against the `basic` fixture, checks deterministic JSON ordering, and confirms override utilities both flag unmet manual edges and inject additional records without losing auto-generated ones.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:52.023Z","inputHash":"7b66744f55bec8a8"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- [`csharpFixtureOracle.CSharpFixtureOracleOptions`](./csharpFixtureOracle.ts.md#csharpfixtureoracleoptions)
- [`csharpFixtureOracle.CSharpOracleEdge`](./csharpFixtureOracle.ts.md#csharporacleedge)
- [`csharpFixtureOracle.CSharpOracleEdgeRecord`](./csharpFixtureOracle.ts.md#csharporacleedgerecord)
- [`csharpFixtureOracle.CSharpOracleOverrideConfig`](./csharpFixtureOracle.ts.md#csharporacleoverrideconfig)
- [`csharpFixtureOracle.generateCSharpFixtureGraph`](./csharpFixtureOracle.ts.md#generatecsharpfixturegraph)
- [`csharpFixtureOracle.mergeCSharpOracleEdges`](./csharpFixtureOracle.ts.md#mergecsharporacleedges)
- [`csharpFixtureOracle.partitionCSharpOracleSegments`](./csharpFixtureOracle.ts.md#partitioncsharporaclesegments)
- [`csharpFixtureOracle.serializeCSharpOracleEdges`](./csharpFixtureOracle.ts.md#serializecsharporacleedges)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/testing/fixtureOracles: [csharpFixtureOracle.ts](./csharpFixtureOracle.ts.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
