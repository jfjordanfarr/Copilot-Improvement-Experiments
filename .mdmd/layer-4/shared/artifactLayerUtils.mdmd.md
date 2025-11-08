# Artifact Layer Utilities

## Metadata
- Layer: 4
- Implementation ID: IMP-046
- Code Path: [`packages/shared/src/inference/heuristics/artifactLayerUtils.ts`](../../../packages/shared/src/inference/heuristics/artifactLayerUtils.ts)
- Exports: isDocumentLayer, isImplementationLayer
- Linked Components: [Fallback Inference Heuristic Modules](../../layer-3/fallback-inference-heuristics.mdmd.md#comp003--heuristic-suite)
- Evidence: [`packages/shared/src/inference/fallbackInference.test.ts`](../../../packages/shared/src/inference/fallbackInference.test.ts)

## Purpose
Provide lightweight guards that heuristics use to determine whether an artifact belongs to documentation or implementation layers before attempting costly parsing.

## Public Symbols

### isDocumentLayer
Returns `true` when an artifact originates from the vision, requirements, or architecture layers, enabling heuristics like [`createMarkdownHeuristic`](./heuristicsMarkdown.mdmd.md#createmarkdownheuristic) to focus on documentation content.

### isImplementationLayer
Detects implementation or code layers so language-specific heuristics (for example [`createImportHeuristic`](./heuristicsImports.mdmd.md#createimportheuristic)) can skip non-code artifacts.

## Collaborators
- [`packages/shared/src/inference/heuristics/index.ts`](../../../packages/shared/src/inference/heuristics/index.ts) uses these guards when iterating heuristics.
- Individual heuristic modules guard their `appliesTo` logic via these helpers.

## Evidence
- Regression tests in `fallbackInference.languages.test.ts` validate that heuristics respect layer boundaries when resolving relationships.
