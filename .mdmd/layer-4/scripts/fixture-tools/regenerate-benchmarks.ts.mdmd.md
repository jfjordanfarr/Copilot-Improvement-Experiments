# scripts/fixture-tools/regenerate-benchmarks.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/fixture-tools/regenerate-benchmarks.ts
- Live Doc ID: LD-implementation-scripts-fixture-tools-regenerate-benchmarks-ts
- Generated At: 2025-11-16T22:34:13.872Z

## Authored
### Purpose
Regenerates benchmark fixtures across all supported languages by invoking their compiler-backed oracles, merging manual overrides, and emitting refreshed `oracle.json`, `merged.json`, and diff reports so expected graphs stay honest ahead of benchmark runs ([oracle regeneration CLI rollout](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-03.md#L3835-L5133)).

### Notes
- Debuted 2025-11-03 as `regenerate-ts-benchmarks.ts`, producing TypeScript oracle outputs and wiring package scripts to materialise per-fixture artifacts for review ([initial implementation](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-03.md#L3835-L5133)).
- Renamed and expanded 2025-11-05 to `regenerate-benchmarks.ts`, adding `--lang` routing for C, Rust, Java, Ruby, Python, and TypeScript plus new oracle modules and manifest metadata so every fixture records its provenance ([multi-language expansion](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-05.md#L12-L289)).
- Added the `--write` pathway on 2025-11-05 and exercised it within safe-commit and CI loops, letting automated runs refresh `expected.json` whenever oracle output changes while logging alignment status ([expected.json sync hook](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-05.md#L2673-L2684)).
- By 2025-11-06 the CLI regenerated every fixture (including libuv) end-to-end, confirming cross-language oracles, manifest cloning, and benchmark pipeline integration held together during full-suite execution ([full-suite verification](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-06.md#L1160-L1258)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:13.872Z","inputHash":"c9c7f4489f43476c"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `runRegenerationCli`
- Type: function
- Source: [source](../../../../scripts/fixture-tools/regenerate-benchmarks.ts#L182)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `promises`
- `node:path` - `path`
- `node:process` - `process`
- [`cFixtureOracle.CFixtureOracleOptions`](../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts.mdmd.md#cfixtureoracleoptions)
- [`cFixtureOracle.COracleEdgeRecord`](../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts.mdmd.md#coracleedgerecord)
- [`cFixtureOracle.COracleEdgeRelation`](../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts.mdmd.md#coracleedgerelation)
- [`cFixtureOracle.COracleOverrideConfig`](../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts.mdmd.md#coracleoverrideconfig)
- [`cFixtureOracle.generateCFixtureGraph`](../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts.mdmd.md#generatecfixturegraph)
- [`cFixtureOracle.mergeCOracleEdges`](../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts.mdmd.md#mergecoracleedges)
- [`cFixtureOracle.serializeCOracleEdges`](../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts.mdmd.md#serializecoracleedges)
- [`csharpFixtureOracle.CSharpFixtureOracleOptions`](../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts.mdmd.md#csharpfixtureoracleoptions)
- [`csharpFixtureOracle.CSharpOracleEdgeRecord`](../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts.mdmd.md#csharporacleedgerecord)
- [`csharpFixtureOracle.CSharpOracleOverrideConfig`](../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts.mdmd.md#csharporacleoverrideconfig)
- [`csharpFixtureOracle.generateCSharpFixtureGraph`](../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts.mdmd.md#generatecsharpfixturegraph)
- [`csharpFixtureOracle.mergeCSharpOracleEdges`](../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts.mdmd.md#mergecsharporacleedges)
- [`csharpFixtureOracle.serializeCSharpOracleEdges`](../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts.mdmd.md#serializecsharporacleedges)
- [`javaFixtureOracle.JavaFixtureOracleOptions`](../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts.mdmd.md#javafixtureoracleoptions)
- [`javaFixtureOracle.JavaOracleEdgeRecord`](../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts.mdmd.md#javaoracleedgerecord)
- [`javaFixtureOracle.JavaOracleOverrideConfig`](../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts.mdmd.md#javaoracleoverrideconfig)
- [`javaFixtureOracle.generateJavaFixtureGraph`](../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts.mdmd.md#generatejavafixturegraph)
- [`javaFixtureOracle.mergeJavaOracleEdges`](../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts.mdmd.md#mergejavaoracleedges)
- [`javaFixtureOracle.serializeJavaOracleEdges`](../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts.mdmd.md#serializejavaoracleedges)
- [`pythonFixtureOracle.PythonFixtureOracleOptions`](../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts.mdmd.md#pythonfixtureoracleoptions)
- [`pythonFixtureOracle.PythonOracleEdgeRecord`](../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts.mdmd.md#pythonoracleedgerecord)
- [`pythonFixtureOracle.PythonOracleOverrideConfig`](../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts.mdmd.md#pythonoracleoverrideconfig)
- [`pythonFixtureOracle.generatePythonFixtureGraph`](../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts.mdmd.md#generatepythonfixturegraph)
- [`pythonFixtureOracle.mergePythonOracleEdges`](../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts.mdmd.md#mergepythonoracleedges)
- [`pythonFixtureOracle.serializePythonOracleEdges`](../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts.mdmd.md#serializepythonoracleedges)
- [`rubyFixtureOracle.RubyFixtureOracleOptions`](../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts.mdmd.md#rubyfixtureoracleoptions)
- [`rubyFixtureOracle.RubyOracleEdgeRecord`](../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts.mdmd.md#rubyoracleedgerecord)
- [`rubyFixtureOracle.RubyOracleOverrideConfig`](../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts.mdmd.md#rubyoracleoverrideconfig)
- [`rubyFixtureOracle.generateRubyFixtureGraph`](../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts.mdmd.md#generaterubyfixturegraph)
- [`rubyFixtureOracle.mergeRubyOracleEdges`](../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts.mdmd.md#mergerubyoracleedges)
- [`rubyFixtureOracle.serializeRubyOracleEdges`](../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts.mdmd.md#serializerubyoracleedges)
- [`rustFixtureOracle.RustFixtureOracleOptions`](../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts.mdmd.md#rustfixtureoracleoptions)
- [`rustFixtureOracle.RustOracleEdgeRecord`](../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts.mdmd.md#rustoracleedgerecord)
- [`rustFixtureOracle.RustOracleOverrideConfig`](../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts.mdmd.md#rustoracleoverrideconfig)
- [`rustFixtureOracle.generateRustFixtureGraph`](../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts.mdmd.md#generaterustfixturegraph)
- [`rustFixtureOracle.mergeRustOracleEdges`](../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts.mdmd.md#mergerustoracleedges)
- [`rustFixtureOracle.serializeRustOracleEdges`](../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts.mdmd.md#serializerustoracleedges)
- [`typeScriptFixtureOracle.OracleEdgeRecord`](../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts.mdmd.md#oracleedgerecord)
- [`typeScriptFixtureOracle.OracleOverrideConfig`](../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts.mdmd.md#oracleoverrideconfig)
- [`typeScriptFixtureOracle.generateTypeScriptFixtureGraph`](../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts.mdmd.md#generatetypescriptfixturegraph)
- [`typeScriptFixtureOracle.mergeOracleEdges`](../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts.mdmd.md#mergeoracleedges)
- [`typeScriptFixtureOracle.serializeOracleEdges`](../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts.mdmd.md#serializeoracleedges)
- [`benchmark-manifest.BENCHMARK_MANIFEST_SEGMENTS`](./benchmark-manifest.ts.mdmd.md#benchmark_manifest_segments)
- [`benchmark-manifest.BenchmarkFixtureDefinition`](./benchmark-manifest.ts.mdmd.md#benchmarkfixturedefinition)
- [`benchmark-manifest.loadBenchmarkManifest`](./benchmark-manifest.ts.mdmd.md#loadbenchmarkmanifest)
- [`fixtureMaterializer.materializeFixture`](./fixtureMaterializer.ts.mdmd.md#materializefixture)
<!-- LIVE-DOC:END Dependencies -->
