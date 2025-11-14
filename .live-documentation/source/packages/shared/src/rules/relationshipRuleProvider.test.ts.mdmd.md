# packages/shared/src/rules/relationshipRuleProvider.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/rules/relationshipRuleProvider.test.ts
- Live Doc ID: LD-test-packages-shared-src-rules-relationshipruleprovider-test-ts
- Generated At: 2025-11-14T18:42:06.835Z

## Authored
### Purpose
Run an end-to-end smoke test that proves rule configs load, compile, and generate evidences the provider can return.

### Notes
Builds a temporary workspace with MDMD docs and a code file, then verifies glob matching, markdown resolver hops, and propagation logic all fire to yield three document links. The suite reuses engine helpers to double-check step candidate matching before asserting the provider surfaces the same evidences, ensuring future refactors keep resolver wiring intact.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.835Z","inputHash":"d1fba48662ea21b1"}]} -->
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
- [`fallbackInference.ArtifactSeed`](../inference/fallbackInference.ts.mdmd.md#artifactseed) (type-only)
- [`relationshipRuleEngine.compileRelationshipRules`](./relationshipRuleEngine.ts.mdmd.md#compilerelationshiprules)
- [`relationshipRuleEngine.generateRelationshipEvidences`](./relationshipRuleEngine.ts.mdmd.md#generaterelationshipevidences)
- [`relationshipRuleEngine.loadRelationshipRuleConfig`](./relationshipRuleEngine.ts.mdmd.md#loadrelationshipruleconfig)
- [`relationshipRuleProvider.createRelationshipRuleProvider`](./relationshipRuleProvider.ts.mdmd.md#createrelationshipruleprovider)
- [`pathUtils.toWorkspaceRelativePath`](../tooling/pathUtils.ts.mdmd.md#toworkspacerelativepath)
- `vitest` - `afterEach`, `beforeEach`, `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/db: [graphStore.ts](../db/graphStore.ts.mdmd.md)
- packages/shared/src/domain: [artifacts.ts](../domain/artifacts.ts.mdmd.md)
- packages/shared/src/inference: [fallbackHeuristicTypes.ts](../inference/fallbackHeuristicTypes.ts.mdmd.md), [fallbackInference.ts](../inference/fallbackInference.ts.mdmd.md), [linkInference.ts](../inference/linkInference.ts.mdmd.md)
- packages/shared/src/inference/heuristics: [artifactLayerUtils.ts](../inference/heuristics/artifactLayerUtils.ts.mdmd.md), [cFunctions.ts](../inference/heuristics/cFunctions.ts.mdmd.md), [csharp.ts](../inference/heuristics/csharp.ts.mdmd.md), [directives.ts](../inference/heuristics/directives.ts.mdmd.md), [heuristics/index.ts](../inference/heuristics/index.ts.mdmd.md), [imports.ts](../inference/heuristics/imports.ts.mdmd.md)
  [includes.ts](../inference/heuristics/includes.ts.mdmd.md), [java.ts](../inference/heuristics/java.ts.mdmd.md), [markdown.ts](../inference/heuristics/markdown.ts.mdmd.md), [referenceResolver.ts](../inference/heuristics/referenceResolver.ts.mdmd.md), [ruby.ts](../inference/heuristics/ruby.ts.mdmd.md), [rust.ts](../inference/heuristics/rust.ts.mdmd.md)
  [shared.ts](../inference/heuristics/shared.ts.mdmd.md), [webforms.ts](../inference/heuristics/webforms.ts.mdmd.md)
- packages/shared/src/knowledge: [knowledgeGraphBridge.ts](../knowledge/knowledgeGraphBridge.ts.mdmd.md)
- packages/shared/src/language: [typeScriptAstUtils.ts](../language/typeScriptAstUtils.ts.mdmd.md)
- packages/shared/src/rules: [relationshipResolvers.ts](./relationshipResolvers.ts.mdmd.md), [relationshipRuleEngine.ts](./relationshipRuleEngine.ts.mdmd.md), [relationshipRuleProvider.ts](./relationshipRuleProvider.ts.mdmd.md), [relationshipRuleTypes.ts](./relationshipRuleTypes.ts.mdmd.md)
- packages/shared/src/tooling: [markdownShared.ts](../tooling/markdownShared.ts.mdmd.md), [pathUtils.ts](../tooling/pathUtils.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
