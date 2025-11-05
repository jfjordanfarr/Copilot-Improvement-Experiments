# Java Fixture Oracle

## Metadata
- Layer: 4
- Implementation ID: IMP-523
- Code Path: [`packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts`](../../../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts)
- Exports: JavaOracleEdgeRelation, JavaOracleEdge, JavaOracleProvenance, JavaFixtureOracleOptions, JavaOracleOverrideEntry, JavaOracleOverrideConfig, JavaOracleEdgeRecord, JavaOracleSegmentPartition, JavaOracleMergeResult, generateJavaFixtureGraph, partitionJavaOracleSegments, mergeJavaOracleEdges, serializeJavaOracleEdges

## Purpose
Generate deterministic dependency edges for Java benchmarks by interpreting import statements, class usage sites, and method references while preserving override hooks for runtime-driven edges.
- Ensure curated fixtures (for example, `square/okhttp`) capture runtime-relevant dependencies with provenance for type-only versus runtime-only usage.
- Maintain parity with the shared oracle contract so regeneration workflows reuse tooling built for TypeScript and Python.
- Surface drift between heuristically derived edges and manual overrides before LLM sampling proposes cross-language relationships, with a clear upgrade path to `javac`/`jdeps` integration when workspace toolchains are available.

## Public Symbols
### JavaOracleEdgeRelation
Defines the "imports" and "uses" relationship kinds emitted by the oracle, separating type-only references from runtime usage.

### JavaOracleEdge
Fixture-relative record of source, target, and relation aligned with ripple semantics.

### JavaOracleProvenance
Annotates edges with their collection pathway (`"import-statement"`, `"manual-override"`).

### JavaFixtureOracleOptions
Configuration object accepting the fixture root plus optional include/exclude globs that constrain which `.java` files are scanned.

### JavaOracleOverrideEntry
Manual descriptor for edges that must be preserved when compiler tooling cannot infer relationships (for example, reflection-driven bindings).

### JavaOracleOverrideConfig
Override manifest loader enabling regeneration runs to reconcile manual expectations with compiler output.

### JavaOracleEdgeRecord
Canonical JSON tuple persisted to fixture files.

### JavaOracleSegmentPartition
Separates compiler-derived edges, matched overrides, and missing overrides for reviewer feedback.

### JavaOracleMergeResult
Aggregated merge payload with deduplicated edges, unresolved overrides, and provenance stats returned to CLI scripts.

### generateJavaFixtureGraph
Scans source files, parses import declarations, and classifies symbol usage to enumerate dependency edges and tag them with provenance metadata.

### partitionJavaOracleSegments
Matches oracle edges to overrides, surfacing stale manual expectations.

### mergeJavaOracleEdges
Combines oracle output with overrides, deduplicates edges, and produces reviewer-facing metadata.

### serializeJavaOracleEdges
Writes normalised JSON sorted deterministically with provenance notes stripped to reviewer summaries.

## Collaborators
- [`scripts/fixture-tools/regenerate-benchmarks.ts`](../../../../scripts/fixture-tools/regenerate-benchmarks.ts) triggers `--lang java` executions, capturing diff artefacts for review.
- [`tests/integration/benchmarks/fixtures/java/`](../../../../tests/integration/benchmarks/fixtures/java/) holds curated expectations consumed by the AST accuracy suite.
- [`packages/shared/src/inference/fallbackInference.ts`](../../../../packages/shared/src/inference/fallbackInference.ts) will gain Java-specific heuristics validated against oracle output.

## Linked Components
- [COMP-007 Diagnostics Benchmarking](../../../layer-3/benchmark-telemetry-pipeline.mdmd.md#comp007-diagnostics-benchmarking)
- [COMP-013 Polyglot Fixture Oracles](../../../layer-3/polyglot-oracles-and-sampling.mdmd.md#comp-013-polyglot-fixture-oracles)

## Evidence
- [`packages/shared/src/testing/fixtureOracles/javaFixtureOracle.test.ts`](../../../../packages/shared/src/testing/fixtureOracles/javaFixtureOracle.test.ts) asserts CLI integration, override handling, and serialization stability across representative fixtures.
- AST benchmark execution will report Java precision/recall metrics and fail CI if deterministic output drifts from curated expectations.
- Updated reports under `reports/benchmarks/ast/` will log Java coverage and highlight outstanding overrides or missing toolchains.
