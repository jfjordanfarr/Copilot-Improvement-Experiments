# Ruby Heuristic Implementation

## Metadata
- Layer: 4
- Implementation ID: IMP-056
- Code Path: [`packages/shared/src/inference/heuristics/ruby.ts`](../../../packages/shared/src/inference/heuristics/ruby.ts)
- Exports: createRubyHeuristic
- Linked Components: [Fallback Inference Heuristic Modules](../../layer-3/fallback-inference-heuristics.mdmd.md#comp003--heuristic-suite)
- Evidence: [`packages/shared/src/inference/fallbackInference.languages.test.ts`](../../../packages/shared/src/inference/fallbackInference.languages.test.ts)

## Purpose
Translate Ruby `require` and `require_relative` statements into dependency links while ignoring comment-only references.

## Public Symbols

### createRubyHeuristic
Implements the [`FallbackHeuristic`](./fallbackHeuristicTypes.mdmd.md#fallbackheuristic) interface for Ruby sources, normalising required paths and emitting dependency candidates using shared resolution helpers.

## Collaborators
- Depends on [`resolveReference`](./referenceResolver.mdmd.md#resolvereference) for path matching and `isImplementationLayer` for applicability checks.
- Registered in the default heuristic list via [`createDefaultHeuristics`](./heuristicsIndex.mdmd.md#createdefaultheuristics).

## Evidence
- Ruby regression tests validate correct dependency extraction for CLI-style code.
- Benchmark suite `ruby-cli` ensures behaviour scales to larger projects.
