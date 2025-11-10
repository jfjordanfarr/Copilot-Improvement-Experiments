# packages/shared/src/inference/linkInference.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/inference/linkInference.test.ts
- Live Doc ID: LD-test-packages-shared-src-inference-linkinference-test-ts
- Generated At: 2025-11-09T22:52:12.136Z

## Authored
### Purpose
Exercise the `LinkInferenceOrchestrator` end-to-end so a representative workspace run proves we merge fallback heuristics, workspace providers, and external knowledge feeds into a single graph without surfacing errors.

### Notes
Seeds include a markdown requirement and TypeScript implementation file so fallback inference emits reciprocal document/code links and a heuristic trace. A mock workspace provider supplies one additional evidence item, while a mock knowledge-feed snapshot contributes an out-of-repo spec artifact and pre-linked relationship to verify snapshot promotion. The assertions confirm artifact hydration, link deduplication, provider/feed summaries, and that the run records the three distinct trace origins (`heuristic`, provider id, `knowledge-feed`).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:12.136Z","inputHash":"9f162f13d6b06100"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`fallbackInference.ArtifactSeed`](./fallbackInference.ts.mdmd.md#artifactseed) (type-only)
- [`linkInference.KnowledgeFeed`](./linkInference.ts.mdmd.md#knowledgefeed)
- [`linkInference.LinkInferenceOrchestrator`](./linkInference.ts.mdmd.md#linkinferenceorchestrator)
- [`linkInference.WorkspaceLinkProvider`](./linkInference.ts.mdmd.md#workspacelinkprovider)
- [`knowledgeGraphBridge.ExternalSnapshot`](../knowledge/knowledgeGraphBridge.ts.mdmd.md#externalsnapshot) (type-only)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/db: [graphStore.ts](../db/graphStore.ts.mdmd.md)
- packages/shared/src/domain: [artifacts.ts](../domain/artifacts.ts.mdmd.md)
- packages/shared/src/inference: [fallbackHeuristicTypes.ts](./fallbackHeuristicTypes.ts.mdmd.md), [fallbackInference.ts](./fallbackInference.ts.mdmd.md), [linkInference.ts](./linkInference.ts.mdmd.md)
- packages/shared/src/inference/heuristics: [artifactLayerUtils.ts](./heuristics/artifactLayerUtils.ts.mdmd.md), [cFunctions.ts](./heuristics/cFunctions.ts.mdmd.md), [csharp.ts](./heuristics/csharp.ts.mdmd.md), [directives.ts](./heuristics/directives.ts.mdmd.md), [heuristics/index.ts](./heuristics/index.ts.mdmd.md), [imports.ts](./heuristics/imports.ts.mdmd.md)
  [includes.ts](./heuristics/includes.ts.mdmd.md), [java.ts](./heuristics/java.ts.mdmd.md), [markdown.ts](./heuristics/markdown.ts.mdmd.md), [referenceResolver.ts](./heuristics/referenceResolver.ts.mdmd.md), [ruby.ts](./heuristics/ruby.ts.mdmd.md), [rust.ts](./heuristics/rust.ts.mdmd.md)
  [shared.ts](./heuristics/shared.ts.mdmd.md), [webforms.ts](./heuristics/webforms.ts.mdmd.md)
- packages/shared/src/knowledge: [knowledgeGraphBridge.ts](../knowledge/knowledgeGraphBridge.ts.mdmd.md)
- packages/shared/src/language: [typeScriptAstUtils.ts](../language/typeScriptAstUtils.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
