# TS Basic Benchmark Fixture (Layer 4)

## Source Mapping
- Fixture entry point: [`tests/integration/benchmarks/fixtures/typescript/basic/src/index.ts`](../../../../tests/integration/benchmarks/fixtures/typescript/basic/src/index.ts)
- Expected relationships: [`tests/integration/benchmarks/fixtures/typescript/basic/expected.json`](../../../../tests/integration/benchmarks/fixtures/typescript/basic/expected.json)
- Inferred relationships (capture under test): [`tests/integration/benchmarks/fixtures/typescript/basic/inferred.json`](../../../../tests/integration/benchmarks/fixtures/typescript/basic/inferred.json)
- Parent benchmark plan: [AST Accuracy Benchmark Suite](astAccuracySuite.mdmd.md)

## Purpose
Provide a minimal TypeScript workspace that exercises the benchmark harness end-to-end, enabling deterministic pseudocode-to-AST comparisons without pulling in language features that would complicate fixture maintenance.

## Behaviour
- Defines a placeholder entry point (`index.ts`) that the AST fixture generator and benchmark harness traverse to validate TypeScript symbol extraction.
- Compares actual inference results against `expected.json` to verify the knowledge graph aligns with the canonical snapshot.
- Keeps exports intentionally simple to focus on graph rebuild stability and inference correctness rather than language edge cases.

## Interactions
- [`astAccuracy.test.ts`](../../../../tests/integration/benchmarks/astAccuracy.test.ts) loads the fixture to compare inferred relationships with pre-generated AST snapshots.
- [`rebuildStability.test.ts`](../../../../tests/integration/benchmarks/rebuildStability.test.ts) references the same workspace when verifying that repeated graph snapshots remain identical.

## Evidence
- Integration benchmarks under [`tests/integration/benchmarks`](../../../../tests/integration/benchmarks) rely on the fixture; their passing runs confirm the workspace structure remains valid.
