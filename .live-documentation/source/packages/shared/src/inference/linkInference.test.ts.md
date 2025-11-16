# packages/shared/src/inference/linkInference.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/inference/linkInference.test.ts
- Live Doc ID: LD-test-packages-shared-src-inference-linkinference-test-ts
- Generated At: 2025-11-16T02:09:51.893Z

## Authored
### Purpose
Exercise the `LinkInferenceOrchestrator` end-to-end so a representative workspace run proves we merge fallback heuristics, workspace providers, and external knowledge feeds into a single graph without surfacing errors.

### Notes
Seeds include a markdown requirement and TypeScript implementation file so fallback inference emits reciprocal document/code links and a heuristic trace. A mock workspace provider supplies one additional evidence item, while a mock knowledge-feed snapshot contributes an out-of-repo spec artifact and pre-linked relationship to verify snapshot promotion. The assertions confirm artifact hydration, link deduplication, provider/feed summaries, and that the run records the three distinct trace origins (`heuristic`, provider id, `knowledge-feed`).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.893Z","inputHash":"7a0eeb6ef120fed7"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`fallbackInference.ArtifactSeed`](./fallbackInference.ts.md#artifactseed) (type-only)
- [`linkInference.KnowledgeFeed`](./linkInference.ts.md#knowledgefeed)
- [`linkInference.LinkInferenceOrchestrator`](./linkInference.ts.md#linkinferenceorchestrator)
- [`linkInference.WorkspaceLinkProvider`](./linkInference.ts.md#workspacelinkprovider)
- [`knowledgeGraphBridge.ExternalSnapshot`](../knowledge/knowledgeGraphBridge.ts.md#externalsnapshot) (type-only)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/db: [graphStore.ts](../db/graphStore.ts.md)
- packages/shared/src/domain: [artifacts.ts](../domain/artifacts.ts.md)
- packages/shared/src/inference: [fallbackHeuristicTypes.ts](./fallbackHeuristicTypes.ts.md), [fallbackInference.ts](./fallbackInference.ts.md), [linkInference.ts](./linkInference.ts.md)
- packages/shared/src/inference/heuristics: [artifactLayerUtils.ts](./heuristics/artifactLayerUtils.ts.md), [cFunctions.ts](./heuristics/cFunctions.ts.md), [csharp.ts](./heuristics/csharp.ts.md), [directives.ts](./heuristics/directives.ts.md), [heuristics/index.ts](./heuristics/index.ts.md), [imports.ts](./heuristics/imports.ts.md)
  [includes.ts](./heuristics/includes.ts.md), [java.ts](./heuristics/java.ts.md), [markdown.ts](./heuristics/markdown.ts.md), [referenceResolver.ts](./heuristics/referenceResolver.ts.md), [ruby.ts](./heuristics/ruby.ts.md), [rust.ts](./heuristics/rust.ts.md)
  [shared.ts](./heuristics/shared.ts.md), [webforms.ts](./heuristics/webforms.ts.md)
- packages/shared/src/knowledge: [knowledgeGraphBridge.ts](../knowledge/knowledgeGraphBridge.ts.md)
- packages/shared/src/language: [typeScriptAstUtils.ts](../language/typeScriptAstUtils.ts.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
