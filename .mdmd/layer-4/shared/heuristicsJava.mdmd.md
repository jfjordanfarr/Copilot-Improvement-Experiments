# Java Heuristic Implementation

## Metadata
- Layer: 4
- Implementation ID: IMP-054
- Code Path: [`packages/shared/src/inference/heuristics/java.ts`](../../../packages/shared/src/inference/heuristics/java.ts)
- Exports: createJavaHeuristic
- Linked Components: [Fallback Inference Heuristic Modules](../../layer-3/fallback-inference-heuristics.mdmd.md#comp003--heuristic-suite)
- Evidence: [`packages/shared/src/inference/fallbackInference.languages.test.ts`](../../../packages/shared/src/inference/fallbackInference.languages.test.ts)

## Purpose
Classify Java import statements and builder-style usages to connect classes across packages in the knowledge graph.

## Public Symbols

### createJavaHeuristic
Implements the [`FallbackHeuristic`](./fallbackHeuristicTypes.mdmd.md#fallbackheuristic) contract for Java artifacts, scanning `.java` sources, scoring matches with shared utilities, and emitting dependency links for resolved packages.

## Collaborators
- Depends on `resolveReference` for package path normalisation.
- Included in the default heuristic chain via [`createDefaultHeuristics`](./heuristicsIndex.mdmd.md#createdefaultheuristics).

## Evidence
- Java regression tests cover both basic imports and fluent builder usage detection.
- `java-basic` and `java-service` benchmark fixtures validate behaviour on larger codebases.
