# C Function Heuristic Implementation

## Metadata
- Layer: 4
- Implementation ID: IMP-052
- Code Path: [`packages/shared/src/inference/heuristics/cFunctions.ts`](../../../packages/shared/src/inference/heuristics/cFunctions.ts)
- Exports: createCFunctionHeuristic
- Linked Components: [Fallback Inference Heuristic Modules](../../layer-3/fallback-inference-heuristics.mdmd.md#comp003--heuristic-suite)
- Evidence: [`packages/shared/src/inference/fallbackInference.languages.test.ts`](../../../packages/shared/src/inference/fallbackInference.languages.test.ts)

## Purpose
Link C source call-sites back to header declarations to improve graph accuracy when implementations follow traditional header/source splits.

## Public Symbols

### createCFunctionHeuristic
Produces a [`FallbackHeuristic`](./fallbackHeuristicTypes.mdmd.md#fallbackheuristic) that indexes function declarations during `initialize`, detects call expressions in `.c` files, and emits dependency relationships to the corresponding headers.

## Collaborators
- Uses shared string utilities for path comparison and comment detection.
- Registered in the orchestrator via [`createDefaultHeuristics`](./heuristicsIndex.mdmd.md#createdefaultheuristics).

## Evidence
- Regression cases in `fallbackInference.languages.test.ts` ensure correct header linkage without false positives.
- C benchmark fixtures (`c-modular`, `c-libuv`) validate behaviour across larger projects.
