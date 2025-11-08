# Fallback Heuristic Reference Resolver

## Metadata
- Layer: 4
- Implementation ID: IMP-045
- Code Path: [`packages/shared/src/inference/heuristics/referenceResolver.ts`](../../../packages/shared/src/inference/heuristics/referenceResolver.ts)
- Exports: ReferenceResolution, resolveReference, resolveIncludeReference
- Linked Components: [Fallback Inference Heuristic Modules](../../layer-3/fallback-inference-heuristics.mdmd.md#comp003--heuristic-suite)
- Collaborators: [`packages/shared/src/inference/heuristics/shared.ts`](../../../packages/shared/src/inference/heuristics/shared.ts)
- Evidence: [`packages/shared/src/inference/fallbackInference.test.ts`](../../../packages/shared/src/inference/fallbackInference.test.ts)

## Purpose
Centralise the logic that maps textual references emitted by heuristics to concrete artifact targets, ensuring consistent confidence scoring and rationale text across modules.

## Public Symbols

### ReferenceResolution
Structured return payload containing the resolved target artifact wrapper, heuristic confidence, and rationale fragment used in trace entries.

### resolveReference
Resolves markdown or module-style references by generating normalised variants, scoring each candidate via shared helpers, and returning the highest-confidence match when one exists.

### resolveIncludeReference
Handles C-style `#include` directives by evaluating relative and direct paths against available header artifacts, producing a consistent `ReferenceResolution` when matches are found.

## Collaborators
- [`FallbackHeuristic`](./fallbackHeuristicTypes.mdmd.md#fallbackheuristic) implementations invoke these helpers during `evaluate`.
- Shared utilities such as [`buildReferenceVariants`](./heuristicsShared.mdmd.md#buildreferencevariants) and [`evaluateVariantMatch`](./heuristicsShared.mdmd.md#evaluatevariantmatch) feed this resolver.

## Evidence
- `fallback inference` unit tests assert that include links and import heuristics surface correct targets and rationales.
- Benchmark fixture regeneration (`npm run safe:commit -- --benchmarks`) depends on this resolver to remain aligned with expected edge sets.
