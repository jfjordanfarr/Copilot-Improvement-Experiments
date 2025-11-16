# packages/shared/src/rules/relationshipRuleProvider.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/rules/relationshipRuleProvider.test.ts
- Live Doc ID: LD-test-packages-shared-src-rules-relationshipruleprovider-test-ts
- Generated At: 2025-11-16T02:09:51.994Z

## Authored
### Purpose
Run an end-to-end smoke test that proves rule configs load, compile, and generate evidences the provider can return.

### Notes
Builds a temporary workspace with MDMD docs and a code file, then verifies glob matching, markdown resolver hops, and propagation logic all fire to yield three document links. The suite reuses engine helpers to double-check step candidate matching before asserting the provider surfaces the same evidences, ensuring future refactors keep resolver wiring intact.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.994Z","inputHash":"d1fba48662ea21b1"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs/promises` - `fs`
- `node:os` - `tmpdir`
- `node:path` - `path`
- `node:url` - `pathToFileURL`
- [`fallbackInference.ArtifactSeed`](../inference/fallbackInference.ts.md#artifactseed) (type-only)
- [`relationshipRuleEngine.compileRelationshipRules`](./relationshipRuleEngine.ts.md#compilerelationshiprules)
- [`relationshipRuleEngine.generateRelationshipEvidences`](./relationshipRuleEngine.ts.md#generaterelationshipevidences)
- [`relationshipRuleEngine.loadRelationshipRuleConfig`](./relationshipRuleEngine.ts.md#loadrelationshipruleconfig)
- [`relationshipRuleProvider.createRelationshipRuleProvider`](./relationshipRuleProvider.ts.md#createrelationshipruleprovider)
- [`pathUtils.toWorkspaceRelativePath`](../tooling/pathUtils.ts.md#toworkspacerelativepath)
- `vitest` - `afterEach`, `beforeEach`, `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/db: [graphStore.ts](../db/graphStore.ts.md)
- packages/shared/src/domain: [artifacts.ts](../domain/artifacts.ts.md)
- packages/shared/src/inference: [fallbackHeuristicTypes.ts](../inference/fallbackHeuristicTypes.ts.md), [fallbackInference.ts](../inference/fallbackInference.ts.md), [linkInference.ts](../inference/linkInference.ts.md)
- packages/shared/src/inference/heuristics: [artifactLayerUtils.ts](../inference/heuristics/artifactLayerUtils.ts.md), [cFunctions.ts](../inference/heuristics/cFunctions.ts.md), [csharp.ts](../inference/heuristics/csharp.ts.md), [directives.ts](../inference/heuristics/directives.ts.md), [heuristics/index.ts](../inference/heuristics/index.ts.md), [imports.ts](../inference/heuristics/imports.ts.md)
  [includes.ts](../inference/heuristics/includes.ts.md), [java.ts](../inference/heuristics/java.ts.md), [markdown.ts](../inference/heuristics/markdown.ts.md), [referenceResolver.ts](../inference/heuristics/referenceResolver.ts.md), [ruby.ts](../inference/heuristics/ruby.ts.md), [rust.ts](../inference/heuristics/rust.ts.md)
  [shared.ts](../inference/heuristics/shared.ts.md), [webforms.ts](../inference/heuristics/webforms.ts.md)
- packages/shared/src/knowledge: [knowledgeGraphBridge.ts](../knowledge/knowledgeGraphBridge.ts.md)
- packages/shared/src/language: [typeScriptAstUtils.ts](../language/typeScriptAstUtils.ts.md)
- packages/shared/src/rules: [relationshipResolvers.ts](./relationshipResolvers.ts.md), [relationshipRuleEngine.ts](./relationshipRuleEngine.ts.md), [relationshipRuleProvider.ts](./relationshipRuleProvider.ts.md), [relationshipRuleTypes.ts](./relationshipRuleTypes.ts.md)
- packages/shared/src/tooling: [markdownShared.ts](../tooling/markdownShared.ts.md), [pathUtils.ts](../tooling/pathUtils.ts.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
