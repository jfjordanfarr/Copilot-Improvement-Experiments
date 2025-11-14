# packages/shared/src/inference/fallbackInference.languages.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/inference/fallbackInference.languages.test.ts
- Live Doc ID: LD-test-packages-shared-src-inference-fallbackinference-languages-test-ts
- Generated At: 2025-11-14T18:42:06.681Z

## Authored
### Purpose
Exercises language-specific fallback heuristics across C, Rust, Java, and Ruby to guarantee cross-file edges surface with the expected relationship kinds and trace metadata.

### Notes
- Verifies that includes, module imports, package usages, and require chains each yield a `depends_on` edge plus annotated trace context, keeping heuristics honest for multi-language repositories.
- Shared helpers assert both edge existence and trace payloads so regressions in normalization or provenance capture fail loudly.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.681Z","inputHash":"f5ff1f80950d7ddf"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`artifacts.LinkRelationshipKind`](../domain/artifacts.ts.mdmd.md#linkrelationshipkind)
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
