# Default Heuristic Registry

## Metadata
- Layer: 4
- Implementation ID: IMP-047
- Code Path: [`packages/shared/src/inference/heuristics/index.ts`](../../../packages/shared/src/inference/heuristics/index.ts)
- Exports: createDefaultHeuristics
- Linked Components: [Fallback Inference Heuristic Modules](../../layer-3/fallback-inference-heuristics.mdmd.md#comp003--heuristic-suite)
- Evidence: [`packages/shared/src/inference/fallbackInference.test.ts`](../../../packages/shared/src/inference/fallbackInference.test.ts)

## Purpose
Assemble the ordered list of heuristic factories consumed by `fallbackInference.ts`, keeping the orchestrator focused on coordination rather than module wiring.

## Public Symbols

### createDefaultHeuristics
Instantiates the default collection of `FallbackHeuristic` implementations in precedence order. The returned array ensures directive and markdown heuristics run before language-specific modules, preserving historical behaviour. Each entry links back to the base [`FallbackHeuristic`](./fallbackHeuristicTypes.mdmd.md#fallbackheuristic) contract.

## Collaborators
- [`packages/shared/src/inference/fallbackInference.ts`](../../../packages/shared/src/inference/fallbackInference.ts) calls this factory during graph construction.
- Individual heuristic modules (see Linked Implementations in the Layer 3 documentation) supply the concrete factories included in the returned array.

## Evidence
- Unit tests exercise orchestrator behaviour that depends on the order of heuristics (for example, markdown links preceding imports).
- Benchmarks validated via `npm run safe:commit -- --benchmarks` rely on this registry to keep expected edges stable.
