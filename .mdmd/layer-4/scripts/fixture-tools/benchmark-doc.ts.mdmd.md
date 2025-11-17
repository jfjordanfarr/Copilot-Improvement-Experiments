# scripts/fixture-tools/benchmark-doc.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/fixture-tools/benchmark-doc.ts
- Live Doc ID: LD-implementation-scripts-fixture-tools-benchmark-doc-ts
- Generated At: 2025-11-16T22:34:13.782Z

## Authored
### Purpose
Regenerates the AST benchmark documentation by rendering manifest-sourced vendor inventories into `astAccuracyFixtures` so provenance, file counts, and integrity hashes stay in sync with the fixture registry ([doc generator introduction](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-01.md#L4370-L4476)).

### Notes
- Landed 2025-11-01 alongside the manifest/helpers, letting `fixtures:sync-docs` rewrite the vendor sections from structured data instead of hand-maintained tables ([initial automation](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-01.md#L4440-L4560)).
- Repointed 2025-11-16 to emit into `.live-documentation/source/benchmarks/astAccuracyFixtures.md`, preserving the Stage-0 `.md` mirror while keeping sync-ast-doc.ts and verify-fixtures.ts aligned with the new location ([mirror alignment](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-16.md#L2700-L2820)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:13.782Z","inputHash":"4e62f9302b198e59"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `VENDOR_SECTION_START`
- Type: const
- Source: [source](../../../../scripts/fixture-tools/benchmark-doc.ts#L13)

#### `VENDOR_SECTION_END`
- Type: const
- Source: [source](../../../../scripts/fixture-tools/benchmark-doc.ts#L14)

#### `RenderOptions`
- Type: interface
- Source: [source](../../../../scripts/fixture-tools/benchmark-doc.ts#L16)

#### `resolveAstFixtureDocPath`
- Type: function
- Source: [source](../../../../scripts/fixture-tools/benchmark-doc.ts#L21)

#### `ensureVendorSection`
- Type: function
- Source: [source](../../../../scripts/fixture-tools/benchmark-doc.ts#L32)

#### `renderVendorInventory`
- Type: function
- Source: [source](../../../../scripts/fixture-tools/benchmark-doc.ts#L45)

#### `extractVendorInventory`
- Type: function
- Source: [source](../../../../scripts/fixture-tools/benchmark-doc.ts#L77)

#### `replaceDelimitedSection`
- Type: function
- Source: [source](../../../../scripts/fixture-tools/benchmark-doc.ts#L90)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `promises`
- `node:path` - `path`
- [`liveDocumentationConfig.DEFAULT_LIVE_DOCUMENTATION_CONFIG`](../../packages/shared/src/config/liveDocumentationConfig.ts.mdmd.md#default_live_documentation_config)
- [`benchmark-manifest.BenchmarkFixtureDefinition`](./benchmark-manifest.ts.mdmd.md#benchmarkfixturedefinition)
- [`benchmark-manifest.FixtureFileSetSpec`](./benchmark-manifest.ts.mdmd.md#fixturefilesetspec)
- [`benchmark-manifest.FixtureIntegritySpec`](./benchmark-manifest.ts.mdmd.md#fixtureintegrityspec)
- [`benchmark-manifest.FixtureMaterialization`](./benchmark-manifest.ts.mdmd.md#fixturematerialization)
- [`benchmark-manifest.FixtureProvenance`](./benchmark-manifest.ts.mdmd.md#fixtureprovenance)
<!-- LIVE-DOC:END Dependencies -->
