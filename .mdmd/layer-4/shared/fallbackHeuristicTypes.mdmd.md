# Fallback Heuristic Types

## Metadata
- Layer: 4
- Implementation ID: IMP-043
- Code Path: [`packages/shared/src/inference/fallbackHeuristicTypes.ts`](../../../packages/shared/src/inference/fallbackHeuristicTypes.ts)
- Exports: MatchContext, HeuristicArtifact, MatchCandidate, MatchEmitter, FallbackHeuristic
- Linked Components: [Fallback Inference Heuristic Modules](../../layer-3/fallback-inference-heuristics.mdmd.md#comp003--heuristic-suite)
- Evidence: [`packages/shared/src/inference/fallbackInference.test.ts`](../../../packages/shared/src/inference/fallbackInference.test.ts)

## Purpose
Capture the shared contracts that every fallback inference heuristic implements so orchestrators and module authors collaborate against a stable surface area.

## Public Symbols

### MatchContext
Categorises emitted relationships (for example `"import"`, `"include"`, `"call"`) so downstream pipelines can derive `LinkRelationshipKind` without bespoke logic.

### HeuristicArtifact
Normalised artifact wrapper that stores the source `KnowledgeArtifact`, comparable path forms, and cached names used by heuristics when matching targets.

### MatchCandidate
Describes a relationship emitted by a heuristic, including the target artifact wrapper, numeric confidence, rationale text, and originating `MatchContext`.

### MatchEmitter
Callback signature supplied to heuristics, enabling them to emit `MatchCandidate` instances without mutating global state.

### FallbackHeuristic
Interface implemented by every heuristic module: exposes a stable `id`, optional `initialize` hook for index building, `appliesTo` guard, and `evaluate` method that uses the provided `MatchEmitter`. Heuristic implementations in this workspace link back to this contract from their layer 4 documentation.

## Collaborators
- [`packages/shared/src/inference/heuristics/index.ts`](../../../packages/shared/src/inference/heuristics/index.ts) instantiates ordered heuristic collections.
- [`packages/shared/src/inference/heuristics/shared.ts`](../../../packages/shared/src/inference/heuristics/shared.ts) supplies shared helpers consumed by heuristic implementations.

## Evidence
- `fallback inference` unit suite exercises orchestrator integrations with heuristics conforming to these types.
