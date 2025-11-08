# Import Heuristic Implementation

## Metadata
- Layer: 4
- Implementation ID: IMP-050
- Code Path: [`packages/shared/src/inference/heuristics/imports.ts`](../../../packages/shared/src/inference/heuristics/imports.ts)
- Exports: createImportHeuristic
- Linked Components: [Fallback Inference Heuristic Modules](../../layer-3/fallback-inference-heuristics.mdmd.md#comp003--heuristic-suite)
- Evidence: [`packages/shared/src/inference/fallbackInference.languages.test.ts`](../../../packages/shared/src/inference/fallbackInference.languages.test.ts)

## Purpose
Detect runtime-relevant module imports across JavaScript/TypeScript, Python, and Ruby sources while filtering comment-only and type-only references.

## Public Symbols

### createImportHeuristic
Returns a [`FallbackHeuristic`](./fallbackHeuristicTypes.mdmd.md#fallbackheuristic) that inspects implementation-layer artifacts, applies language-specific parsing, collaborates with [`resolveReference`](./referenceResolver.mdmd.md#resolvereference), and emits dependency relationships for matching targets.

## Collaborators
- Utilises runtime analysis helpers from `typeScriptAstUtils` to suppress pure type imports.
- Depends on shared utilities such as [`computeReferenceStart`](./heuristicsShared.mdmd.md#computereferencestart) and [`isWithinComment`](./heuristicsShared.mdmd.md#iswithincomment).

## Evidence
- Regression tests in `fallbackInference.languages.test.ts` verify TypeScript, Python, and Ruby behaviours.
- AST benchmarks (`java-okhttp`, `python-requests`) confirm the heuristic scales to large repositories without drift.
