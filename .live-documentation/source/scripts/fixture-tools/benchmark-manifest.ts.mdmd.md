# scripts/fixture-tools/benchmark-manifest.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/fixture-tools/benchmark-manifest.ts
- Live Doc ID: LD-implementation-scripts-fixture-tools-benchmark-manifest-ts
- Generated At: 2025-11-09T22:52:13.498Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

#### ManifestFixtureDefinition
Legacy alias for [`BenchmarkFixtureDefinition`](#benchmarkfixturedefinition); retained so fixture tooling imports remain stable.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:13.498Z","inputHash":"a7892006ea5055c3"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `FixtureSummary`
- Type: interface
- Source: [source](../../../../scripts/fixture-tools/benchmark-manifest.ts#L6)

#### `FixtureProvenance`
- Type: interface
- Source: [source](../../../../scripts/fixture-tools/benchmark-manifest.ts#L12)

#### `FixtureIntegritySpec`
- Type: interface
- Source: [source](../../../../scripts/fixture-tools/benchmark-manifest.ts#L22)

#### `BenchmarkFixtureDefinition`
- Type: interface
- Source: [source](../../../../scripts/fixture-tools/benchmark-manifest.ts#L32)

#### `IntegrityDigest`
- Type: interface
- Source: [source](../../../../scripts/fixture-tools/benchmark-manifest.ts#L46)

#### `FixtureFileSetSpec`
- Type: interface
- Source: [source](../../../../scripts/fixture-tools/benchmark-manifest.ts#L53)

#### `FixtureMaterialization`
- Type: type
- Source: [source](../../../../scripts/fixture-tools/benchmark-manifest.ts#L58)

#### `FixtureGitMaterialization`
- Type: interface
- Source: [source](../../../../scripts/fixture-tools/benchmark-manifest.ts#L65)

#### `BENCHMARK_MANIFEST_SEGMENTS`
- Type: const
- Source: [source](../../../../scripts/fixture-tools/benchmark-manifest.ts#L78)

#### `loadBenchmarkManifest`
- Type: function
- Source: [source](../../../../scripts/fixture-tools/benchmark-manifest.ts#L86)

#### `computeIntegrityDigest`
- Type: function
- Source: [source](../../../../scripts/fixture-tools/benchmark-manifest.ts#L102)

#### `normalizeRelative`
- Type: function
- Source: [source](../../../../scripts/fixture-tools/benchmark-manifest.ts#L157)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `glob` - `glob`
- `node:crypto` - `createHash`
- `node:fs` - `fs`
- `node:path` - `path`
<!-- LIVE-DOC:END Dependencies -->
