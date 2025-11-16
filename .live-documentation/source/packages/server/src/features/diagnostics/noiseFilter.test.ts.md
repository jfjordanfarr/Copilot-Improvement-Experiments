# packages/server/src/features/diagnostics/noiseFilter.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/server/src/features/diagnostics/noiseFilter.test.ts
- Live Doc ID: LD-test-packages-server-src-features-diagnostics-noisefilter-test-ts
- Generated At: 2025-11-16T02:09:51.268Z

## Authored
### Purpose
Validates noise filtering drops impacts according to confidence, depth, per-change, and per-target limits, reporting accurate totals for telemetry consumers.

### Notes
- Covers edge cases like empty contexts, invalid confidence values, and impacts exceeding per-target budgets to ensure filtering stays deterministic.
- Asserts that contexts are cloned when necessary so consumers receive new arrays only when impacts were removed, preserving reference identity otherwise.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.268Z","inputHash":"0b3d927b939009ea"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`noiseFilter.NoiseFilterTotals`](./noiseFilter.ts.md#noisefiltertotals)
- [`noiseFilter.ZERO_NOISE_FILTER_TOTALS`](./noiseFilter.ts.md#zero_noise_filter_totals)
- [`noiseFilter.applyNoiseFilter`](./noiseFilter.ts.md#applynoisefilter)
- [`rippleTypes.RippleImpact`](./rippleTypes.ts.md#rippleimpact) (type-only)
- [`settingsBridge.NoiseFilterRuntimeConfig`](../settings/settingsBridge.ts.md#noisefilterruntimeconfig) (type-only)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/server/src/features/diagnostics: [noiseFilter.ts](./noiseFilter.ts.md), [rippleTypes.ts](./rippleTypes.ts.md)
- packages/server/src/features/settings: [providerGuard.ts](../settings/providerGuard.ts.md), [settingsBridge.ts](../settings/settingsBridge.ts.md)
- packages/shared/src: [src/index.ts](../../../../shared/src/index.ts.md)
- packages/shared/src/config: [liveDocumentationConfig.ts](../../../../shared/src/config/liveDocumentationConfig.ts.md)
- packages/shared/src/contracts: [dependencies.ts](../../../../shared/src/contracts/dependencies.ts.md), [diagnostics.ts](../../../../shared/src/contracts/diagnostics.ts.md), [llm.ts](../../../../shared/src/contracts/llm.ts.md), [lsif.ts](../../../../shared/src/contracts/lsif.ts.md), [maintenance.ts](../../../../shared/src/contracts/maintenance.ts.md), [overrides.ts](../../../../shared/src/contracts/overrides.ts.md)
  [scip.ts](../../../../shared/src/contracts/scip.ts.md), [symbols.ts](../../../../shared/src/contracts/symbols.ts.md), [telemetry.ts](../../../../shared/src/contracts/telemetry.ts.md)
- packages/shared/src/db: [graphStore.ts](../../../../shared/src/db/graphStore.ts.md)
- packages/shared/src/domain: [artifacts.ts](../../../../shared/src/domain/artifacts.ts.md)
- packages/shared/src/inference: [fallbackHeuristicTypes.ts](../../../../shared/src/inference/fallbackHeuristicTypes.ts.md), [fallbackInference.ts](../../../../shared/src/inference/fallbackInference.ts.md), [linkInference.ts](../../../../shared/src/inference/linkInference.ts.md)
- packages/shared/src/inference/heuristics: [artifactLayerUtils.ts](../../../../shared/src/inference/heuristics/artifactLayerUtils.ts.md), [cFunctions.ts](../../../../shared/src/inference/heuristics/cFunctions.ts.md), [csharp.ts](../../../../shared/src/inference/heuristics/csharp.ts.md), [directives.ts](../../../../shared/src/inference/heuristics/directives.ts.md), [heuristics/index.ts](../../../../shared/src/inference/heuristics/index.ts.md), [imports.ts](../../../../shared/src/inference/heuristics/imports.ts.md)
  [includes.ts](../../../../shared/src/inference/heuristics/includes.ts.md), [java.ts](../../../../shared/src/inference/heuristics/java.ts.md), [markdown.ts](../../../../shared/src/inference/heuristics/markdown.ts.md), [referenceResolver.ts](../../../../shared/src/inference/heuristics/referenceResolver.ts.md), [ruby.ts](../../../../shared/src/inference/heuristics/ruby.ts.md), [rust.ts](../../../../shared/src/inference/heuristics/rust.ts.md)
  [shared.ts](../../../../shared/src/inference/heuristics/shared.ts.md), [webforms.ts](../../../../shared/src/inference/heuristics/webforms.ts.md)
- packages/shared/src/inference/llm: [confidenceCalibrator.ts](../../../../shared/src/inference/llm/confidenceCalibrator.ts.md), [relationshipExtractor.ts](../../../../shared/src/inference/llm/relationshipExtractor.ts.md)
- packages/shared/src/knowledge: [knowledgeGraphBridge.ts](../../../../shared/src/knowledge/knowledgeGraphBridge.ts.md)
- packages/shared/src/language: [typeScriptAstUtils.ts](../../../../shared/src/language/typeScriptAstUtils.ts.md)
- packages/shared/src/live-docs: [markdown.ts](../../../../shared/src/live-docs/markdown.ts.md), [schema.ts](../../../../shared/src/live-docs/schema.ts.md), [types.ts](../../../../shared/src/live-docs/types.ts.md)
- packages/shared/src/live-docs/analysis: [coActivation.ts](../../../../shared/src/live-docs/analysis/coActivation.ts.md)
- packages/shared/src/reporting: [testReport.ts](../../../../shared/src/reporting/testReport.ts.md)
- packages/shared/src/rules: [relationshipResolvers.ts](../../../../shared/src/rules/relationshipResolvers.ts.md), [relationshipRuleAudit.ts](../../../../shared/src/rules/relationshipRuleAudit.ts.md), [relationshipRuleEngine.ts](../../../../shared/src/rules/relationshipRuleEngine.ts.md), [relationshipRuleProvider.ts](../../../../shared/src/rules/relationshipRuleProvider.ts.md), [relationshipRuleTypes.ts](../../../../shared/src/rules/relationshipRuleTypes.ts.md), [symbolCorrectnessProfiles.ts](../../../../shared/src/rules/symbolCorrectnessProfiles.ts.md)
- packages/shared/src/telemetry: [inferenceAccuracy.ts](../../../../shared/src/telemetry/inferenceAccuracy.ts.md)
- packages/shared/src/tooling: [assetPaths.ts](../../../../shared/src/tooling/assetPaths.ts.md), [githubSlugger.ts](../../../../shared/src/tooling/githubSlugger.ts.md), [githubSluggerRegex.ts](../../../../shared/src/tooling/githubSluggerRegex.ts.md), [markdownLinks.ts](../../../../shared/src/tooling/markdownLinks.ts.md), [markdownShared.ts](../../../../shared/src/tooling/markdownShared.ts.md), [ollamaClient.ts](../../../../shared/src/tooling/ollamaClient.ts.md)
  [ollamaEndpoint.ts](../../../../shared/src/tooling/ollamaEndpoint.ts.md), [ollamaMock.ts](../../../../shared/src/tooling/ollamaMock.ts.md), [pathUtils.ts](../../../../shared/src/tooling/pathUtils.ts.md), [symbolReferences.ts](../../../../shared/src/tooling/symbolReferences.ts.md)
- packages/shared/src/uri: [normalizeFileUri.ts](../../../../shared/src/uri/normalizeFileUri.ts.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
