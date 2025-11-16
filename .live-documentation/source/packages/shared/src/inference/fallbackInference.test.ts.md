# packages/shared/src/inference/fallbackInference.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/inference/fallbackInference.test.ts
- Live Doc ID: LD-test-packages-shared-src-inference-fallbackinference-test-ts
- Generated At: 2025-11-16T02:09:51.808Z

## Authored
### Purpose
Validates the fallback graph inference pipeline across representative languages, markdown linking, and LLM integration to ensure heuristics emit only trustworthy edges.

### Notes
- Covers heuristic successes (markdown cross-references, JS re-exports, C includes, Python imports) and guards against false positives such as type-only imports or comment-only references.
- Exercises the optional LLM bridge so we confirm suggestions merge with heuristic results while preserving provenance and confidence handling.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.808Z","inputHash":"7bbccde583d26ab3"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`fallbackInference.FallbackLLMBridge`](./fallbackInference.ts.md#fallbackllmbridge)
- [`fallbackInference.LLMRelationshipRequest`](./fallbackInference.ts.md#llmrelationshiprequest)
- [`fallbackInference.LLMRelationshipSuggestion`](./fallbackInference.ts.md#llmrelationshipsuggestion)
- [`fallbackInference.inferFallbackGraph`](./fallbackInference.ts.md#inferfallbackgraph)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/domain: [artifacts.ts](../domain/artifacts.ts.md)
- packages/shared/src/inference: [fallbackHeuristicTypes.ts](./fallbackHeuristicTypes.ts.md), [fallbackInference.ts](./fallbackInference.ts.md)
- packages/shared/src/inference/heuristics: [artifactLayerUtils.ts](./heuristics/artifactLayerUtils.ts.md), [cFunctions.ts](./heuristics/cFunctions.ts.md), [csharp.ts](./heuristics/csharp.ts.md), [directives.ts](./heuristics/directives.ts.md), [heuristics/index.ts](./heuristics/index.ts.md), [imports.ts](./heuristics/imports.ts.md)
  [includes.ts](./heuristics/includes.ts.md), [java.ts](./heuristics/java.ts.md), [markdown.ts](./heuristics/markdown.ts.md), [referenceResolver.ts](./heuristics/referenceResolver.ts.md), [ruby.ts](./heuristics/ruby.ts.md), [rust.ts](./heuristics/rust.ts.md)
  [shared.ts](./heuristics/shared.ts.md), [webforms.ts](./heuristics/webforms.ts.md)
- packages/shared/src/language: [typeScriptAstUtils.ts](../language/typeScriptAstUtils.ts.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
