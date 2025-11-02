# Benchmark Fixture Toolkit

## Metadata
- Layer: 4
- Implementation ID: IMP-612
- Code Paths:
  - [`scripts/fixture-tools/benchmark-manifest.ts`](/scripts/fixture-tools/benchmark-manifest.ts)
  - [`scripts/fixture-tools/benchmark-manifest.js`](/scripts/fixture-tools/benchmark-manifest.js)
  - [`scripts/fixture-tools/fixtureMaterializer.ts`](/scripts/fixture-tools/fixtureMaterializer.ts)
  - [`scripts/fixture-tools/fixtureMaterializer.js`](/scripts/fixture-tools/fixtureMaterializer.js)
  - [`scripts/fixture-tools/benchmark-doc.ts`](/scripts/fixture-tools/benchmark-doc.ts)
  - [`scripts/fixture-tools/sync-ast-doc.ts`](/scripts/fixture-tools/sync-ast-doc.ts)
  - [`scripts/fixture-tools/summarize-snapshot.mjs`](/scripts/fixture-tools/summarize-snapshot.mjs)
  - [`scripts/fixture-tools/find-parent-includes.mjs`](/scripts/fixture-tools/find-parent-includes.mjs)
- Exports: BENCHMARK_MANIFEST_SEGMENTS, BenchmarkFixtureDefinition, FixtureSummary, FixtureIntegritySpec, FixtureGitMaterialization, IntegrityDigest, computeIntegrityDigest, FixtureFileSetSpec, FixtureMaterialization, FixtureProvenance, loadBenchmarkManifest, materializeFixture, MaterializeOptions, MaterializeResult, normalizeRelative, RenderOptions, ensureVendorSection, renderVendorInventory, extractVendorInventory, replaceDelimitedSection, VENDOR_SECTION_START, VENDOR_SECTION_END

## Purpose
Coordinate the benchmark fixture lifecycle: the manifest loader resolves fixture metadata, the materializer stages vendor repositories on demand, and the documentation helpers keep Layer 4 fixture inventories in sync with the manifest integrity hashes. The supporting CLI scripts surface diagnostics (vendor inventory sync, snapshot summarisation, include path auditing) for the fixture pipelines without checking vendor code into the repository.

## Public Symbols

### BENCHMARK_MANIFEST_SEGMENTS
Lists the path segments used to locate `fixtures.manifest.json`, ensuring every consumer resolves the manifest relative to the workspace root.

### BenchmarkFixtureDefinition
Type describing each benchmark fixture entry, including materialisation strategy, integrity metadata, and ground-truth edge files consumed by `tests/integration/benchmarks/astAccuracy.test.ts`.

### FixtureSummary
Optional narrative fields surfaced in the vendor inventory to explain fixture intent, mutations made for benchmarking, or follow-up notes for future curators.

### FixtureIntegritySpec
Structure capturing the hash algorithm, expected file count, and glob set used when recomputing fixture integrity during `npm run fixtures:verify`.

### FixtureFileSetSpec
Models the include/exclude glob set used both by integrity hashing and documentation rendering.

### FixtureMaterialization
Union that captures each supported staging strategy (workspace passthrough or git checkout) so materialisation callers can branch on `kind`.

### FixtureGitMaterialization
Defines the git-based staging contract, including sparse checkout paths and entry points, so benchmarks can pull large vendor repositories without checking their contents into source control.

### FixtureProvenance
Metadata surface for licensing and commit attribution; emitted in the vendor inventory block for auditability.

### loadBenchmarkManifest
Reads and parses `fixtures.manifest.json`, returning strongly typed fixture definitions for benchmarks, fixture verification scripts, and docs sync tasks.

### computeIntegrityDigest
Re-hashes the staged workspace for a fixture, validating that the materialised file set matches the manifest-specified root hash and file count before benchmarks execute.

### IntegrityDigest
Return type emitted by `computeIntegrityDigest`, recording per-file hashes alongside the aggregate digest so CI can surface drift between manifest expectations and materialised workspaces.

### normalizeRelative
Utility helper that rewrites Windows path separators so glob patterns remain deterministic across platforms.

### materializeFixture
Stitches together the workspace directory (either persistent under `AI-Agent-Workspace/tmp/benchmarks` or ephemeral) by cloning vendor repositories, configuring sparse checkouts, and returning disposal hooks for temporary runs.

### MaterializeOptions
Optional configuration passed to `materializeFixture`, currently controlling whether the staging workspace is ephemeral.

### MaterializeResult
Structure returned from `materializeFixture`, exposing the realised workspace root, materialisation metadata, and a cleanup callback.

### RenderOptions
Shared options bag used by the documentation helpers to resolve repository-relative doc paths.

### ensureVendorSection
Idempotently rewrites the vendor inventory block of `.mdmd/layer-4/benchmarks/astAccuracyFixtures.mdmd.md` so documentation reflects the manifest integrity state after fixture verification.

### renderVendorInventory
Generates the Markdown fragment summarising vendor provenance, integrity hashes, resolved file counts, and glob selections for each fixture flagged as `kind: "vendor"`.

### extractVendorInventory
Parses the current vendor inventory block out of the Layer 4 doc so sync commands can detect drift versus the rendered fragment.

### replaceDelimitedSection
Lower-level helper that splices the generated inventory block between the HTML comment sentinels, preserving surrounding content.

### VENDOR_SECTION_START
HTML comment sentinel marking the start of the vendor inventory block so automated tooling can reliably locate the section boundary.

### VENDOR_SECTION_END
HTML comment sentinels that mark the bounds of the vendor inventory block; exposed for tooling that needs to detect or replace the segment.

## Collaborators
- [`scripts/fixture-tools/verify-fixtures.ts`](../../../scripts/fixture-tools/verify-fixtures.ts) orchestrates snapshotting, graph audits, and integrity checks using the exported manifest/materialiser APIs.
- [`tests/integration/benchmarks/astAccuracy.test.ts`](../../../tests/integration/benchmarks/astAccuracy.test.ts) materialises fixtures in ephemeral workspaces before asserting precision/recall metrics.
- [`scripts/doc-tools/enforce-documentation-links.ts`](../../../scripts/doc-tools/enforce-documentation-links.ts) ensures fixture tooling sources and their Layer 4 docs remain mutually discoverable wherever documentation link enforcement participates in verification pipelines.

## Linked Components
- `.mdmd/layer-4/benchmarks/astAccuracyFixtures.mdmd.md` records the curated fixture inventory and relies on the documentation helpers to stay synchronised.
- `.mdmd/layer-4/testing/benchmarks/astAccuracySuite.mdmd.md` documents the benchmark harness that consumes these fixtures.

## Evidence
- `npm run fixtures:verify` clones vendor repositories, recomputes integrity digests (43 TypeScript files, 118 C files), and confirms documentation alignment.
- `npm run fixtures:sync-docs` regenerates the vendor inventory block via `ensureVendorSection`.
- `npm run test:benchmarks -- --suite=ast` materialises `ts-ky` and `c-libuv` in ephemeral workspaces before executing the AST accuracy benchmark.
