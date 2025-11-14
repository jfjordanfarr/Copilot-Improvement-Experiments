# packages/shared/src/inference/fallbackInference.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/inference/fallbackInference.test.ts
- Live Doc ID: LD-test-packages-shared-src-inference-fallbackinference-test-ts
- Generated At: 2025-11-14T18:42:06.684Z

## Authored
### Purpose
Validates the fallback graph inference pipeline across representative languages, markdown linking, and LLM integration to ensure heuristics emit only trustworthy edges.

### Notes
- Covers heuristic successes (markdown cross-references, JS re-exports, C includes, Python imports) and guards against false positives such as type-only imports or comment-only references.
- Exercises the optional LLM bridge so we confirm suggestions merge with heuristic results while preserving provenance and confidence handling.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.684Z","inputHash":"7bbccde583d26ab3"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`fallbackInference.FallbackLLMBridge`](./fallbackInference.ts.mdmd.md#fallbackllmbridge)
- [`fallbackInference.LLMRelationshipRequest`](./fallbackInference.ts.mdmd.md#llmrelationshiprequest)
- [`fallbackInference.LLMRelationshipSuggestion`](./fallbackInference.ts.mdmd.md#llmrelationshipsuggestion)
- [`fallbackInference.inferFallbackGraph`](./fallbackInference.ts.mdmd.md#inferfallbackgraph)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/domain: [artifacts.ts](../domain/artifacts.ts.mdmd.md)
- packages/shared/src/inference: [fallbackHeuristicTypes.ts](./fallbackHeuristicTypes.ts.mdmd.md), [fallbackInference.ts](./fallbackInference.ts.mdmd.md)
- packages/shared/src/inference/heuristics: [artifactLayerUtils.ts](./heuristics/artifactLayerUtils.ts.mdmd.md), [cFunctions.ts](./heuristics/cFunctions.ts.mdmd.md), [csharp.ts](./heuristics/csharp.ts.mdmd.md), [directives.ts](./heuristics/directives.ts.mdmd.md), [heuristics/index.ts](./heuristics/index.ts.mdmd.md), [imports.ts](./heuristics/imports.ts.mdmd.md)
  [includes.ts](./heuristics/includes.ts.mdmd.md), [java.ts](./heuristics/java.ts.mdmd.md), [markdown.ts](./heuristics/markdown.ts.mdmd.md), [referenceResolver.ts](./heuristics/referenceResolver.ts.mdmd.md), [ruby.ts](./heuristics/ruby.ts.mdmd.md), [rust.ts](./heuristics/rust.ts.mdmd.md)
  [shared.ts](./heuristics/shared.ts.mdmd.md), [webforms.ts](./heuristics/webforms.ts.mdmd.md)
- packages/shared/src/language: [typeScriptAstUtils.ts](../language/typeScriptAstUtils.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
