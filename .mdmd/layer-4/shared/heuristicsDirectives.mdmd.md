# Directive Heuristic Implementation

## Metadata
- Layer: 4
- Implementation ID: IMP-048
- Code Path: [`packages/shared/src/inference/heuristics/directives.ts`](../../../packages/shared/src/inference/heuristics/directives.ts)
- Exports: createDirectiveHeuristic
- Linked Components: [Fallback Inference Heuristic Modules](../../layer-3/fallback-inference-heuristics.mdmd.md#comp003--heuristic-suite)
- Evidence: [`packages/shared/src/inference/fallbackInference.test.ts`](../../../packages/shared/src/inference/fallbackInference.test.ts)

## Purpose
Surface explicit documentation directives (such as `@link`) as graph relationships when markdown alone cannot convey intent.

## Public Symbols

### createDirectiveHeuristic
Returns a [`FallbackHeuristic`](./fallbackHeuristicTypes.mdmd.md#fallbackheuristic) implementation that scans documentation artifacts for directive syntax and emits `MatchCandidate` entries via the shared emitter.

## Collaborators
- Uses utilities from [`heuristics/shared.ts`](./heuristicsShared.mdmd.md) to normalise references.
- Resolved relationships flow into the orchestrator via [`createDefaultHeuristics`](./heuristicsIndex.mdmd.md#createdefaultheuristics).

## Evidence
- Covered by markdown directive assertions in `fallbackInference.test.ts` and validated indirectly through AST benchmarks.
