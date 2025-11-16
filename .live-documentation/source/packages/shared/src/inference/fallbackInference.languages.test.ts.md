# packages/shared/src/inference/fallbackInference.languages.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/inference/fallbackInference.languages.test.ts
- Live Doc ID: LD-test-packages-shared-src-inference-fallbackinference-languages-test-ts
- Generated At: 2025-11-16T02:09:51.804Z

## Authored
### Purpose
Exercises language-specific fallback heuristics across C, Rust, Java, and Ruby to guarantee cross-file edges surface with the expected relationship kinds and trace metadata.

### Notes
- Verifies that includes, module imports, package usages, and require chains each yield a `depends_on` edge plus annotated trace context, keeping heuristics honest for multi-language repositories.
- Shared helpers assert both edge existence and trace payloads so regressions in normalization or provenance capture fail loudly.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.804Z","inputHash":"f5ff1f80950d7ddf"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`artifacts.LinkRelationshipKind`](../domain/artifacts.ts.md#linkrelationshipkind)
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
