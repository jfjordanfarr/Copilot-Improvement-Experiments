# Markdown Heuristic Implementation

## Metadata
- Layer: 4
- Implementation ID: IMP-049
- Code Path: [`packages/shared/src/inference/heuristics/markdown.ts`](../../../packages/shared/src/inference/heuristics/markdown.ts)
- Exports: createMarkdownHeuristic
- Linked Components: [Fallback Inference Heuristic Modules](../../layer-3/fallback-inference-heuristics.mdmd.md#comp003--heuristic-suite)
- Evidence: [`packages/shared/src/inference/fallbackInference.test.ts`](../../../packages/shared/src/inference/fallbackInference.test.ts)

## Purpose
Promote inline markdown links inside documentation artifacts into `documents` or `references` relationships, bridging specs and code.

## Public Symbols

### createMarkdownHeuristic
Produces a [`FallbackHeuristic`](./fallbackHeuristicTypes.mdmd.md#fallbackheuristic) that parses markdown links, resolves targets via shared utilities, and emits candidates annotated with documentation contexts.

## Collaborators
- Leverages [`resolveReference`](./referenceResolver.mdmd.md#resolvereference) for target resolution and [`isDocumentLayer`](./artifactLayerUtils.mdmd.md#isdocumentlayer) to scope applicability.
- Included in orchestrator order via [`createDefaultHeuristics`](./heuristicsIndex.mdmd.md#createdefaultheuristics).

## Evidence
- Markdown linking tests in `fallbackInference.test.ts` confirm correct link kinds and trace emission.
