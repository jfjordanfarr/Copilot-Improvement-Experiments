# packages/shared/src/language/typeScriptAstUtils.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/language/typeScriptAstUtils.ts
- Live Doc ID: LD-implementation-packages-shared-src-language-typescriptastutils-ts
- Generated At: 2025-11-16T02:09:51.933Z

## Authored
### Purpose
Expose shared TypeScript AST helpers so heuristics and tooling can classify identifier usage, detect runtime imports, and spot type-definition specifiers without reimplementing traversal logic.

### Notes
`collectIdentifierUsage` walks a `SourceFile` while skipping declaration identifiers, recording whether each symbol is referenced in value or type positions; `hasRuntimeUsage`/`hasTypeUsage` then answer routing questions for inferred links. `extractLocalImportNames` mirrors the compiler’s import clause structure to surface all bound names, and `isLikelyTypeDefinitionSpecifier` normalizes specifiers to catch `.d.ts` or `types` packages even across path/URL variants. Internals rely solely on `typescript` guards, keeping the helpers stable across compiler upgrades.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.933Z","inputHash":"0a19b7882bc9e886"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `IdentifierUsage`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/language/typeScriptAstUtils.ts#L3)

#### `extractLocalImportNames`
- Type: function
- Source: [source](../../../../../../packages/shared/src/language/typeScriptAstUtils.ts#L8)

#### `collectIdentifierUsage`
- Type: function
- Source: [source](../../../../../../packages/shared/src/language/typeScriptAstUtils.ts#L34)

#### `hasRuntimeUsage`
- Type: function
- Source: [source](../../../../../../packages/shared/src/language/typeScriptAstUtils.ts#L64)

#### `hasTypeUsage`
- Type: function
- Source: [source](../../../../../../packages/shared/src/language/typeScriptAstUtils.ts#L75)

#### `isLikelyTypeDefinitionSpecifier`
- Type: function
- Source: [source](../../../../../../packages/shared/src/language/typeScriptAstUtils.ts#L86)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `typescript` - `ts`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [analyzeWithAI.test.ts](../../../extension/src/commands/analyzeWithAI.test.ts.md)
- [exportDiagnostics.test.ts](../../../extension/src/commands/exportDiagnostics.test.ts.md)
- [inspectSymbolNeighbors.test.ts](../../../extension/src/commands/inspectSymbolNeighbors.test.ts.md)
- [dependencyQuickPick.test.ts](../../../extension/src/diagnostics/dependencyQuickPick.test.ts.md)
- [docDiagnosticProvider.test.ts](../../../extension/src/diagnostics/docDiagnosticProvider.test.ts.md)
- [localOllamaBridge.test.ts](../../../extension/src/services/localOllamaBridge.test.ts.md)
- [symbolBridge.test.ts](../../../extension/src/services/symbolBridge.test.ts.md)
- [saveCodeChange.test.ts](../../../server/src/features/changeEvents/saveCodeChange.test.ts.md)
- [saveDocumentChange.test.ts](../../../server/src/features/changeEvents/saveDocumentChange.test.ts.md)
- [inspectDependencies.test.ts](../../../server/src/features/dependencies/inspectDependencies.test.ts.md)
- [symbolNeighbors.test.ts](../../../server/src/features/dependencies/symbolNeighbors.test.ts.md)
- [acknowledgementService.test.ts](../../../server/src/features/diagnostics/acknowledgementService.test.ts.md)
- [listOutstandingDiagnostics.test.ts](../../../server/src/features/diagnostics/listOutstandingDiagnostics.test.ts.md)
- [noiseFilter.test.ts](../../../server/src/features/diagnostics/noiseFilter.test.ts.md)
- [publishDocDiagnostics.test.ts](../../../server/src/features/diagnostics/publishDocDiagnostics.test.ts.md)
- [feedFormatDetector.test.ts](../../../server/src/features/knowledge/feedFormatDetector.test.ts.md)
- [knowledgeFeedManager.test.ts](../../../server/src/features/knowledge/knowledgeFeedManager.test.ts.md)
- [knowledgeGraphBridge.test.ts](../../../server/src/features/knowledge/knowledgeGraphBridge.test.ts.md)
- [knowledgeGraphIngestor.test.ts](../../../server/src/features/knowledge/knowledgeGraphIngestor.test.ts.md)
- [llmIngestionOrchestrator.test.ts](../../../server/src/features/knowledge/llmIngestionOrchestrator.test.ts.md)
- [lsifParser.test.ts](../../../server/src/features/knowledge/lsifParser.test.ts.md)
- [rippleAnalyzer.test.ts](../../../server/src/features/knowledge/rippleAnalyzer.test.ts.md)
- [scipParser.test.ts](../../../server/src/features/knowledge/scipParser.test.ts.md)
- [workspaceIndexProvider.test.ts](../../../server/src/features/knowledge/workspaceIndexProvider.test.ts.md)
- [artifactWatcher.test.ts](../../../server/src/features/watchers/artifactWatcher.test.ts.md)
- [pathReferenceDetector.test.ts](../../../server/src/features/watchers/pathReferenceDetector.test.ts.md)
- [environment.test.ts](../../../server/src/runtime/environment.test.ts.md)
- [settings.test.ts](../../../server/src/runtime/settings.test.ts.md)
- [latencyTracker.test.ts](../../../server/src/telemetry/latencyTracker.test.ts.md)
- [fallbackInference.languages.test.ts](../inference/fallbackInference.languages.test.ts.md)
- [fallbackInference.test.ts](../inference/fallbackInference.test.ts.md)
- [linkInference.test.ts](../inference/linkInference.test.ts.md)
- [relationshipRuleProvider.test.ts](../rules/relationshipRuleProvider.test.ts.md)
- [typeScriptFixtureOracle.test.ts](../testing/fixtureOracles/typeScriptFixtureOracle.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
