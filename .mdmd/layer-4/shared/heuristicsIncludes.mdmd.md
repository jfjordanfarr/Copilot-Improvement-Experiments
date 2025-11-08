# Include Heuristic Implementation

## Metadata
- Layer: 4
- Implementation ID: IMP-051
- Code Path: [`packages/shared/src/inference/heuristics/includes.ts`](../../../packages/shared/src/inference/heuristics/includes.ts)
- Exports: createIncludeHeuristic
- Linked Components: [Fallback Inference Heuristic Modules](../../layer-3/fallback-inference-heuristics.mdmd.md#comp003--heuristic-suite)
- Evidence: [`packages/shared/src/inference/fallbackInference.languages.test.ts`](../../../packages/shared/src/inference/fallbackInference.languages.test.ts)

## Purpose
Resolve C-style `#include` directives to local headers while ignoring system includes and comment-only directives.

## Public Symbols

### createIncludeHeuristic
Builds a [`FallbackHeuristic`](./fallbackHeuristicTypes.mdmd.md#fallbackheuristic) that scans implementation-layer artifacts for include directives, determines applicability via [`isImplementationLayer`](./artifactLayerUtils.mdmd.md#isimplementationlayer), and resolves targets through [`resolveIncludeReference`](./referenceResolver.mdmd.md#resolveincludereference).

## Collaborators
- Relies on shared utilities for comment detection and reference normalisation.
- Included in the orchestrator order by [`createDefaultHeuristics`](./heuristicsIndex.mdmd.md#createdefaultheuristics).

## Evidence
- `fallbackInference.languages.test.ts` contains C fixtures ensuring local headers are linked while system includes are ignored.
- Benchmark regeneration for `c-basics` and `c-libuv` validates include coverage across larger codebases.
