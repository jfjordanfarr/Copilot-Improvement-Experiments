# scripts/fixture-tools/regenerate-benchmarks.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/fixture-tools/regenerate-benchmarks.ts
- Live Doc ID: LD-implementation-scripts-fixture-tools-regenerate-benchmarks-ts
- Generated At: 2025-11-16T02:09:52.230Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:52.230Z","inputHash":"f74552604f8f56b2"}]} -->
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
- [`cFixtureOracle.CFixtureOracleOptions`](../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts.md#cfixtureoracleoptions)
- [`cFixtureOracle.COracleEdgeRecord`](../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts.md#coracleedgerecord)
- [`cFixtureOracle.COracleEdgeRelation`](../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts.md#coracleedgerelation)
- [`cFixtureOracle.COracleOverrideConfig`](../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts.md#coracleoverrideconfig)
- [`cFixtureOracle.generateCFixtureGraph`](../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts.md#generatecfixturegraph)
- [`cFixtureOracle.mergeCOracleEdges`](../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts.md#mergecoracleedges)
- [`cFixtureOracle.serializeCOracleEdges`](../../packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts.md#serializecoracleedges)
- [`csharpFixtureOracle.CSharpFixtureOracleOptions`](../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts.md#csharpfixtureoracleoptions)
- [`csharpFixtureOracle.CSharpOracleEdgeRecord`](../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts.md#csharporacleedgerecord)
- [`csharpFixtureOracle.CSharpOracleOverrideConfig`](../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts.md#csharporacleoverrideconfig)
- [`csharpFixtureOracle.generateCSharpFixtureGraph`](../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts.md#generatecsharpfixturegraph)
- [`csharpFixtureOracle.mergeCSharpOracleEdges`](../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts.md#mergecsharporacleedges)
- [`csharpFixtureOracle.serializeCSharpOracleEdges`](../../packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts.md#serializecsharporacleedges)
- [`javaFixtureOracle.JavaFixtureOracleOptions`](../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts.md#javafixtureoracleoptions)
- [`javaFixtureOracle.JavaOracleEdgeRecord`](../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts.md#javaoracleedgerecord)
- [`javaFixtureOracle.JavaOracleOverrideConfig`](../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts.md#javaoracleoverrideconfig)
- [`javaFixtureOracle.generateJavaFixtureGraph`](../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts.md#generatejavafixturegraph)
- [`javaFixtureOracle.mergeJavaOracleEdges`](../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts.md#mergejavaoracleedges)
- [`javaFixtureOracle.serializeJavaOracleEdges`](../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts.md#serializejavaoracleedges)
- [`pythonFixtureOracle.PythonFixtureOracleOptions`](../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts.md#pythonfixtureoracleoptions)
- [`pythonFixtureOracle.PythonOracleEdgeRecord`](../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts.md#pythonoracleedgerecord)
- [`pythonFixtureOracle.PythonOracleOverrideConfig`](../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts.md#pythonoracleoverrideconfig)
- [`pythonFixtureOracle.generatePythonFixtureGraph`](../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts.md#generatepythonfixturegraph)
- [`pythonFixtureOracle.mergePythonOracleEdges`](../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts.md#mergepythonoracleedges)
- [`pythonFixtureOracle.serializePythonOracleEdges`](../../packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts.md#serializepythonoracleedges)
- [`rubyFixtureOracle.RubyFixtureOracleOptions`](../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts.md#rubyfixtureoracleoptions)
- [`rubyFixtureOracle.RubyOracleEdgeRecord`](../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts.md#rubyoracleedgerecord)
- [`rubyFixtureOracle.RubyOracleOverrideConfig`](../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts.md#rubyoracleoverrideconfig)
- [`rubyFixtureOracle.generateRubyFixtureGraph`](../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts.md#generaterubyfixturegraph)
- [`rubyFixtureOracle.mergeRubyOracleEdges`](../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts.md#mergerubyoracleedges)
- [`rubyFixtureOracle.serializeRubyOracleEdges`](../../packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts.md#serializerubyoracleedges)
- [`rustFixtureOracle.RustFixtureOracleOptions`](../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts.md#rustfixtureoracleoptions)
- [`rustFixtureOracle.RustOracleEdgeRecord`](../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts.md#rustoracleedgerecord)
- [`rustFixtureOracle.RustOracleOverrideConfig`](../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts.md#rustoracleoverrideconfig)
- [`rustFixtureOracle.generateRustFixtureGraph`](../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts.md#generaterustfixturegraph)
- [`rustFixtureOracle.mergeRustOracleEdges`](../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts.md#mergerustoracleedges)
- [`rustFixtureOracle.serializeRustOracleEdges`](../../packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts.md#serializerustoracleedges)
- [`typeScriptFixtureOracle.TypeScriptEdgeRecord`](../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts.md#typescriptedgerecord)
- [`typeScriptFixtureOracle.TypeScriptOverrideConfig`](../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts.md#typescriptoverrideconfig)
- [`typeScriptFixtureOracle.generateTypeScriptFixtureGraph`](../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts.md#generatetypescriptfixturegraph)
- [`typeScriptFixtureOracle.mergeTypeScriptOracleEdges`](../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts.md#mergetypescriptoracleedges)
- [`typeScriptFixtureOracle.serializeTypeScriptOracleEdges`](../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts.md#serializetypescriptoracleedges)
- [`benchmark-manifest.BENCHMARK_MANIFEST_SEGMENTS`](./benchmark-manifest.ts.md#benchmark_manifest_segments)
- [`benchmark-manifest.ManifestFixtureDefinition`](./benchmark-manifest.ts.md#manifestfixturedefinition)
- [`benchmark-manifest.loadBenchmarkManifest`](./benchmark-manifest.ts.md#loadbenchmarkmanifest)
- [`fixtureMaterializer.materializeFixture`](./fixtureMaterializer.ts.md#materializefixture)
<!-- LIVE-DOC:END Dependencies -->
