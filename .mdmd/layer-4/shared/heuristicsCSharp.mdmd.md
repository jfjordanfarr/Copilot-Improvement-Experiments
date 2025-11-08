# C# Heuristic Implementation

## Metadata
- Layer: 4
- Implementation ID: IMP-055
- Code Path: [`packages/shared/src/inference/heuristics/csharp.ts`](../../../packages/shared/src/inference/heuristics/csharp.ts)
- Exports: createCSharpHeuristic
- Linked Components: [Fallback Inference Heuristic Modules](../../layer-3/fallback-inference-heuristics.mdmd.md#comp003--heuristic-suite)
- Evidence: [`packages/shared/src/inference/fallbackInference.languages.test.ts`](../../../packages/shared/src/inference/fallbackInference.languages.test.ts)

## Purpose
Resolve `using` directives and partial type relationships so C# projects surface accurate dependency links.

## Public Symbols

### createCSharpHeuristic
Provides a [`FallbackHeuristic`](./fallbackHeuristicTypes.mdmd.md#fallbackheuristic) tailored for C# sources, interpreting namespace imports and partial type pairings before emitting dependency candidates.

## Collaborators
- Utilises shared helpers for path comparison and comment awareness.
- Added to the orchestrator order through [`createDefaultHeuristics`](./heuristicsIndex.mdmd.md#createdefaultheuristics).

## Evidence
- C# fixture tests ensure the heuristic links source files to partial type implementations without spurious edges.
- Benchmarks (`csharp-basic`, `csharp-webforms`, `csharp-roslyn-compilers`) verify coverage under larger workloads.
