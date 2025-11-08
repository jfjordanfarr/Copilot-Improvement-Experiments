# Rust Heuristic Implementation

## Metadata
- Layer: 4
- Implementation ID: IMP-053
- Code Path: [`packages/shared/src/inference/heuristics/rust.ts`](../../../packages/shared/src/inference/heuristics/rust.ts)
- Exports: createRustHeuristic
- Linked Components: [Fallback Inference Heuristic Modules](../../layer-3/fallback-inference-heuristics.mdmd.md#comp003--heuristic-suite)
- Evidence: [`packages/shared/src/inference/fallbackInference.languages.test.ts`](../../../packages/shared/src/inference/fallbackInference.languages.test.ts)

## Purpose
Interpret Rust `mod` declarations and `use` paths so the graph captures module relationships within crates.

## Public Symbols

### createRustHeuristic
Returns a [`FallbackHeuristic`](./fallbackHeuristicTypes.mdmd.md#fallbackheuristic) that builds a module index during `initialize`, evaluates whether artifacts belong to implementation layers, and emits dependency edges for resolved module references.

## Collaborators
- Reuses shared path normalisation helpers to align module references with filesystem layouts.
- Registered in the orchestrator order through [`createDefaultHeuristics`](./heuristicsIndex.mdmd.md#createdefaultheuristics).

## Evidence
- Rust regression tests assert correct handling of nested modules and aggregated `use` statements.
- Benchmarks (`rust-basics`, `rust-analytics`) confirm coverage across real-world crates.
