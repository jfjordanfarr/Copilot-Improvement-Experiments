# Fallback Heuristic Shared Utilities

## Metadata
- Layer: 4
- Implementation ID: IMP-044
- Code Path: [`packages/shared/src/inference/heuristics/shared.ts`](../../../packages/shared/src/inference/heuristics/shared.ts)
- Exports: cleanupReference, normalizePath, stem, toComparablePath, computeReferenceStart, isWithinComment, buildReferenceVariants, evaluateVariantMatch, VariantMatchScore, isExternalLink
- Linked Components: [Fallback Inference Heuristic Modules](../../layer-3/fallback-inference-heuristics.mdmd.md#comp003--heuristic-suite)
- Evidence: [`packages/shared/src/inference/fallbackInference.languages.test.ts`](../../../packages/shared/src/inference/fallbackInference.languages.test.ts)

## Purpose
Provide deterministic, side-effect-free helpers so every heuristic module handles text normalisation, comment detection, and path comparison consistently.

## Public Symbols

### cleanupReference
Trims and sanitises raw reference strings before resolution so downstream heuristics avoid brittle whitespace handling.

### normalizePath
Converts file paths to a stable lowercase forward-slash form, enabling cross-platform comparisons.

### stem
Derives filename stems without extensions to support heuristic matching when import statements omit extensions.

### toComparablePath
Transforms URIs or filesystem paths into the `normalizePath` form, falling back gracefully when URL parsing fails.

### computeReferenceStart
Calculates the character offset of the referenced token within a regex match, giving heuristics the data they need to skip comment-delimited matches.

### isWithinComment
Naïvely walks content to identify whether a position resides inside line or block comments, preventing heuristics from emitting edges from documentation snippets.

### buildReferenceVariants
Generates the candidate path variants (extension swaps, relative rewrites, slug forms) used when resolving module imports and markdown links.

### evaluateVariantMatch
Scores a candidate artifact against a generated variant, returning an optional `VariantMatchScore` with confidence and rationale when a match succeeds.

### VariantMatchScore
Typed payload returned by `evaluateVariantMatch`, ensuring callers capture both the numeric confidence and explanatory rationale.

### isExternalLink
Detects http(s) links so markdown heuristics can ignore outbound references during graph construction.

## Collaborators
- [`packages/shared/src/inference/heuristics/referenceResolver.ts`](../../../packages/shared/src/inference/heuristics/referenceResolver.ts) imports these helpers to implement reference matching.
- All heuristic modules (for example [`createImportHeuristic`](./heuristicsImports.mdmd.md#createimportheuristic)) rely on this utility set for consistent behaviour.

## Evidence
- `fallbackInference.languages.test.ts` covers scenarios (Python imports, Ruby requires, C includes) that depend on these helpers.
- AST benchmark fixtures (`java-okhttp`, `c-libuv`) exercise the shared utility logic at scale during `npm run test:benchmarks`.
