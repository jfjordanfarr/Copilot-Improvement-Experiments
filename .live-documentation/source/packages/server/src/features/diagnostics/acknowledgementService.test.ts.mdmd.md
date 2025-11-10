# packages/server/src/features/diagnostics/acknowledgementService.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/server/src/features/diagnostics/acknowledgementService.test.ts
- Live Doc ID: LD-test-packages-server-src-features-diagnostics-acknowledgementservice-test-ts
- Generated At: 2025-11-09T22:52:10.085Z

## Authored
### Purpose
Verifies acknowledgement workflows coordinate the graph store, drift history logging, and hysteresis suppression as diagnostics are emitted, acknowledged, or re-acknowledged.

### Notes
- Uses `GraphStore` against a temporary SQLite file to ensure persistence and history logging behave identically to production.
- Substitutes a fake `HysteresisController` to assert emissions clear suppression windows when acknowledgements land.
- Covers idempotency by acknowledging the same diagnostic multiple times and validating the service returns `already_acknowledged` without mutating state.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:10.085Z","inputHash":"3cfa4434139e6f03"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `GraphStore`
- `node:fs` - `mkdtempSync`, `rmSync`
- `node:os` - `tmpdir`
- `node:path` - `join`
- [`acknowledgementService.AcknowledgementService`](./acknowledgementService.ts.mdmd.md#acknowledgementservice)
- [`hysteresisController.HysteresisController`](./hysteresisController.ts.mdmd.md#hysteresiscontroller) (type-only)
- [`settingsBridge.DEFAULT_RUNTIME_SETTINGS`](../settings/settingsBridge.ts.mdmd.md#default_runtime_settings)
- [`driftHistoryStore.DriftHistoryStore`](../../telemetry/driftHistoryStore.ts.mdmd.md#drifthistorystore)
- `vitest` - `afterEach`, `beforeEach`, `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/server/src/features/diagnostics: [acknowledgementService.ts](./acknowledgementService.ts.mdmd.md), [hysteresisController.ts](./hysteresisController.ts.mdmd.md)
- packages/server/src/features/settings: [providerGuard.ts](../settings/providerGuard.ts.mdmd.md), [settingsBridge.ts](../settings/settingsBridge.ts.mdmd.md)
- packages/server/src/telemetry: [driftHistoryStore.ts](../../telemetry/driftHistoryStore.ts.mdmd.md)
- packages/shared/src: [src/index.ts](../../../../shared/src/index.ts.mdmd.md)
- packages/shared/src/config: [liveDocumentationConfig.ts](../../../../shared/src/config/liveDocumentationConfig.ts.mdmd.md)
- packages/shared/src/contracts: [dependencies.ts](../../../../shared/src/contracts/dependencies.ts.mdmd.md), [diagnostics.ts](../../../../shared/src/contracts/diagnostics.ts.mdmd.md), [llm.ts](../../../../shared/src/contracts/llm.ts.mdmd.md), [lsif.ts](../../../../shared/src/contracts/lsif.ts.mdmd.md), [maintenance.ts](../../../../shared/src/contracts/maintenance.ts.mdmd.md), [overrides.ts](../../../../shared/src/contracts/overrides.ts.mdmd.md)
  [scip.ts](../../../../shared/src/contracts/scip.ts.mdmd.md), [symbols.ts](../../../../shared/src/contracts/symbols.ts.mdmd.md), [telemetry.ts](../../../../shared/src/contracts/telemetry.ts.mdmd.md)
- packages/shared/src/db: [graphStore.ts](../../../../shared/src/db/graphStore.ts.mdmd.md)
- packages/shared/src/domain: [artifacts.ts](../../../../shared/src/domain/artifacts.ts.mdmd.md)
- packages/shared/src/inference: [fallbackHeuristicTypes.ts](../../../../shared/src/inference/fallbackHeuristicTypes.ts.mdmd.md), [fallbackInference.ts](../../../../shared/src/inference/fallbackInference.ts.mdmd.md), [linkInference.ts](../../../../shared/src/inference/linkInference.ts.mdmd.md)
- packages/shared/src/inference/heuristics: [artifactLayerUtils.ts](../../../../shared/src/inference/heuristics/artifactLayerUtils.ts.mdmd.md), [cFunctions.ts](../../../../shared/src/inference/heuristics/cFunctions.ts.mdmd.md), [csharp.ts](../../../../shared/src/inference/heuristics/csharp.ts.mdmd.md), [directives.ts](../../../../shared/src/inference/heuristics/directives.ts.mdmd.md), [heuristics/index.ts](../../../../shared/src/inference/heuristics/index.ts.mdmd.md), [imports.ts](../../../../shared/src/inference/heuristics/imports.ts.mdmd.md)
  [includes.ts](../../../../shared/src/inference/heuristics/includes.ts.mdmd.md), [java.ts](../../../../shared/src/inference/heuristics/java.ts.mdmd.md), [markdown.ts](../../../../shared/src/inference/heuristics/markdown.ts.mdmd.md), [referenceResolver.ts](../../../../shared/src/inference/heuristics/referenceResolver.ts.mdmd.md), [ruby.ts](../../../../shared/src/inference/heuristics/ruby.ts.mdmd.md), [rust.ts](../../../../shared/src/inference/heuristics/rust.ts.mdmd.md)
  [shared.ts](../../../../shared/src/inference/heuristics/shared.ts.mdmd.md), [webforms.ts](../../../../shared/src/inference/heuristics/webforms.ts.mdmd.md)
- packages/shared/src/inference/llm: [confidenceCalibrator.ts](../../../../shared/src/inference/llm/confidenceCalibrator.ts.mdmd.md), [relationshipExtractor.ts](../../../../shared/src/inference/llm/relationshipExtractor.ts.mdmd.md)
- packages/shared/src/knowledge: [knowledgeGraphBridge.ts](../../../../shared/src/knowledge/knowledgeGraphBridge.ts.mdmd.md)
- packages/shared/src/language: [typeScriptAstUtils.ts](../../../../shared/src/language/typeScriptAstUtils.ts.mdmd.md)
- packages/shared/src/live-docs: [markdown.ts](../../../../shared/src/live-docs/markdown.ts.mdmd.md), [schema.ts](../../../../shared/src/live-docs/schema.ts.mdmd.md)
- packages/shared/src/reporting: [testReport.ts](../../../../shared/src/reporting/testReport.ts.mdmd.md)
- packages/shared/src/rules: [relationshipResolvers.ts](../../../../shared/src/rules/relationshipResolvers.ts.mdmd.md), [relationshipRuleAudit.ts](../../../../shared/src/rules/relationshipRuleAudit.ts.mdmd.md), [relationshipRuleEngine.ts](../../../../shared/src/rules/relationshipRuleEngine.ts.mdmd.md), [relationshipRuleProvider.ts](../../../../shared/src/rules/relationshipRuleProvider.ts.mdmd.md), [relationshipRuleTypes.ts](../../../../shared/src/rules/relationshipRuleTypes.ts.mdmd.md), [symbolCorrectnessProfiles.ts](../../../../shared/src/rules/symbolCorrectnessProfiles.ts.mdmd.md)
- packages/shared/src/telemetry: [inferenceAccuracy.ts](../../../../shared/src/telemetry/inferenceAccuracy.ts.mdmd.md)
- packages/shared/src/tooling: [assetPaths.ts](../../../../shared/src/tooling/assetPaths.ts.mdmd.md), [githubSlugger.ts](../../../../shared/src/tooling/githubSlugger.ts.mdmd.md), [githubSluggerRegex.ts](../../../../shared/src/tooling/githubSluggerRegex.ts.mdmd.md), [markdownLinks.ts](../../../../shared/src/tooling/markdownLinks.ts.mdmd.md), [markdownShared.ts](../../../../shared/src/tooling/markdownShared.ts.mdmd.md), [ollamaClient.ts](../../../../shared/src/tooling/ollamaClient.ts.mdmd.md)
  [ollamaEndpoint.ts](../../../../shared/src/tooling/ollamaEndpoint.ts.mdmd.md), [ollamaMock.ts](../../../../shared/src/tooling/ollamaMock.ts.mdmd.md), [pathUtils.ts](../../../../shared/src/tooling/pathUtils.ts.mdmd.md), [symbolReferences.ts](../../../../shared/src/tooling/symbolReferences.ts.mdmd.md)
- packages/shared/src/uri: [normalizeFileUri.ts](../../../../shared/src/uri/normalizeFileUri.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
