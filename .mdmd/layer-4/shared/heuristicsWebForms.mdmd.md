# WebForms Heuristic Implementation

## Metadata
- Layer: 4
- Implementation ID: IMP-057
- Code Path: [`packages/shared/src/inference/heuristics/webforms.ts`](../../../packages/shared/src/inference/heuristics/webforms.ts)
- Exports: createWebFormsHeuristic
- Linked Components: [Fallback Inference Heuristic Modules](../../layer-3/fallback-inference-heuristics.mdmd.md#comp003--heuristic-suite)
- Evidence: [`packages/shared/src/inference/fallbackInference.languages.test.ts`](../../../packages/shared/src/inference/fallbackInference.languages.test.ts)

## Purpose
Bridge ASP.NET WebForms markup files to their code-behind implementations, incorporating manual overrides where necessary.

## Public Symbols

### createWebFormsHeuristic
Generates a [`FallbackHeuristic`](./fallbackHeuristicTypes.mdmd.md#fallbackheuristic) tailored for WebForms projects, resolving markup/code-behind pairings and emitting dependency relationships for downstream diagnostics.

## Collaborators
- Relies on shared normalisation utilities for consistent path matching.
- Included in the orchestrator ordering by [`createDefaultHeuristics`](./heuristicsIndex.mdmd.md#createdefaultheuristics).

## Evidence
- The `csharp-webforms` benchmark fixture exercises this heuristic alongside manual override handling.
