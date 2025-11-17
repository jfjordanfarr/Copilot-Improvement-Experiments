# scripts/fixture-tools/benchmark-manifest.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/fixture-tools/benchmark-manifest.ts
- Live Doc ID: LD-implementation-scripts-fixture-tools-benchmark-manifest-ts
- Generated At: 2025-11-16T22:34:13.794Z

## Authored
### Purpose
Defines the benchmark fixture manifest schema plus helpers to load entries and compute SHA-256 integrity digests, giving fixture tooling a single source of truth for provenance, curated file sets, and workspace materialisation ([manifest-driven integrity rollout](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-01.md#L4440-L4560)).

### Notes
- Authored 2025-11-01 alongside `verify-fixtures.ts` and `sync-ast-doc.ts` so every vendored benchmark declares its repo, commit, file list, and hash, letting `npm run fixtures:verify` recompute digests and audit docs automatically ([initial integration](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-01.md#L4440-L4560)).
- Feeding this schema into `materializeFixture` unlocked ephemeral clones for benchmark runs and regeneration, keeping integrity tracking and documentation aligned across ky, libuv, and subsequent fixtures ([materializer coordination](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-01.md#L5094-L5335)).
- Extended 2025-11-06 while onboarding C# fixtures, using `computeIntegrityDigest` to stamp the new `csharp-webforms` hash set and enforce algorithm selection during verification ([C# integrity update](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-06.md#L5520-L5638)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:13.794Z","inputHash":"69746c2198f9b4a9"}]} -->
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
- `node:fs` - `promises`
- `node:path` - `path`
<!-- LIVE-DOC:END Dependencies -->
