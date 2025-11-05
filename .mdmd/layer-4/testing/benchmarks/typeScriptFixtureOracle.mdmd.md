# TypeScript Fixture Oracle

## Metadata
- Layer: 4
- Implementation ID: IMP-509
- Code Path: [`packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts`](../../../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts)
- Exports: OracleEdgeRelation, OracleEdgeProvenance, OracleEdge, OracleEdgeRecord, TypeScriptFixtureOracleOptions, OracleOverrideEntry, OracleOverrideConfig, OracleSegmentPartition, OracleMergeResult, generateTypeScriptFixtureGraph, serializeOracleEdges, partitionOracleSegments, mergeOracleEdges

## Purpose
Establish a deterministic TypeScript edge oracle that reproduces benchmark expectations from compiler metadata while respecting ripple-specific semantics and preserving authorable overrides.
- Consume `ts.Program` state to classify runtime versus type-only usage so `depends_on`, `references`, and `uses` edges mirror the workspace analyzer.
- Support fixture regeneration tooling by emitting stable JSON edge sets suitable for diffable comparisons during benchmark runs.
- Allow polyglot workspaces to layer manual expectations without losing compiler-derived guarantees.

## Public Symbols

### OracleEdgeRelation
Defines the supported relationship kinds (`"imports"` or `"uses"`) emitted by the oracle so consuming tooling can reason about runtime versus type-only edges without reinterpreting compiler payloads.

### OracleEdgeProvenance
Labels each edge with its provenance (`"runtime-import"` or `"type-import"`) enabling the regeneration CLI and benchmarks to distinguish compiler-derived runtime dependencies from type-layer references.

### OracleEdge
Describes the structured record returned by compiler analysis, pairing source and target fixture-relative paths with relation and provenance metadata for deterministic serialisation.

### OracleEdgeRecord
Represents the JSON-shape persisted alongside fixtures, omitting provenance while preserving ordered `(source,target,relation)` tuples for benchmark comparisons.

### TypeScriptFixtureOracleOptions
Configuration contract that accepts the fixture root, inclusion filter, and compiler overrides so regeneration workflows can scope oracle execution per fixture.

### OracleOverrideEntry
Manual edge descriptor that lets fixture authors declare additional relationships the compiler cannot infer (for example, cross-language assets) without forking oracle output.

### OracleOverrideConfig
Aggregates override entries loaded from `oracle.overrides.json`, permitting regeneration runs to match, report, or flag missing manual expectations.

### OracleSegmentPartition
Return type that splits oracle output into automatic versus manual segments, highlighting unmatched overrides so reviewers see what changed before updating fixtures.

### OracleMergeResult
Structured payload combining automatic and override edges, the merged comparison list, and any outstanding manual entries so downstream tooling receives a single ordered graph.

### generateTypeScriptFixtureGraph
Builds a `ts.Program` for the target fixture, walks imports, exports, and identifier usage, and returns an ordered list of inferred edges tagged with their provenance (runtime, type-only, symbol-level).

### serializeOracleEdges
Converts the in-memory oracle graph to canonical JSON—sorting edges, normalising paths, and redacting runtime-only metadata so benchmark snapshots remain deterministic across environments.

### partitionOracleSegments
Splits oracle output into sections that may be regenerated (compiler-derived) versus sections flagged as manual overrides, enabling the regeneration CLI to preserve hand-authored cross-language relationships untouched.

### mergeOracleEdges
Normalises compiler-derived edges alongside manual overrides, deduplicates by `(source,target,relation)`, and surfaces missing override entries so regeneration tooling and benchmark checks can operate on a single ordered list of ground-truth edges.

## Collaborators
- [`scripts/fixture-tools/regenerate-benchmarks.ts`](../../../../scripts/fixture-tools/regenerate-benchmarks.ts) invokes the oracle when rebuilding fixture expectations and stages diff artefacts for review.
- [`tests/integration/benchmarks/astAccuracy.test.ts`](../../../../tests/integration/benchmarks/astAccuracy.test.ts) consumes the emitted JSON when comparing oracle output with curated expectations.
- [`packages/server/src/features/knowledge/workspaceIndexProvider.ts`](../../../../packages/server/src/features/knowledge/workspaceIndexProvider.ts) remains the runtime implementation whose behaviour the oracle validates.

## Linked Components
- [COMP-007 Diagnostics Benchmarking](../../../layer-3/benchmark-telemetry-pipeline.mdmd.md#comp007-diagnostics-benchmarking)
- [COMP-013 Polyglot Fixture Oracles](../../../layer-3/polyglot-oracles-and-sampling.mdmd.md#comp-013-polyglot-fixture-oracles)

## Evidence
- [`packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.test.ts`](../../../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.test.ts) exercises oracle edge generation across baseline and layered fixtures, ensuring parity with the knowledge workspace analyzer.
- Regeneration CLI updates (`npm run fixtures:regenerate -- --suite ts`) refresh `tests/integration/benchmarks/fixtures/typescript/*` and validate that manual override segments remain untouched.
- `npm run test:benchmarks -- --suite ast` produces identical precision/recall metrics before and after oracle regeneration, confirming behavioural alignment within `tests/integration/benchmarks/astAccuracy.test.ts`.
