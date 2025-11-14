# scripts/fixture-tools/regenerate-benchmarks.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/fixture-tools/regenerate-benchmarks.ts
- Live Doc ID: LD-implementation-scripts-fixture-tools-regenerate-benchmarks-ts
- Generated At: 2025-11-14T16:30:22.061Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T16:30:22.061Z","inputHash":"f74552604f8f56b2"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `runRegenerationCli`
- Type: function
- Source: [source](../../../../scripts/fixture-tools/regenerate-benchmarks.ts#L182)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
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
- [`typeScriptFixtureOracle.TypeScriptEdgeRecord`](../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts.mdmd.md#typescriptedgerecord)
- [`typeScriptFixtureOracle.TypeScriptOverrideConfig`](../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts.mdmd.md#typescriptoverrideconfig)
- [`typeScriptFixtureOracle.generateTypeScriptFixtureGraph`](../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts.mdmd.md#generatetypescriptfixturegraph)
- [`typeScriptFixtureOracle.mergeTypeScriptOracleEdges`](../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts.mdmd.md#mergetypescriptoracleedges)
- [`typeScriptFixtureOracle.serializeTypeScriptOracleEdges`](../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts.mdmd.md#serializetypescriptoracleedges)
- [`benchmark-manifest.BENCHMARK_MANIFEST_SEGMENTS`](./benchmark-manifest.ts.mdmd.md#benchmark_manifest_segments)
- [`benchmark-manifest.ManifestFixtureDefinition`](./benchmark-manifest.ts.mdmd.md#manifestfixturedefinition)
- [`benchmark-manifest.loadBenchmarkManifest`](./benchmark-manifest.ts.mdmd.md#loadbenchmarkmanifest)
- [`fixtureMaterializer.materializeFixture`](./fixtureMaterializer.ts.mdmd.md#materializefixture)
<!-- LIVE-DOC:END Dependencies -->
