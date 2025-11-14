# packages/shared/src/config/liveDocumentationConfig.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/config/liveDocumentationConfig.ts
- Live Doc ID: LD-implementation-packages-shared-src-config-livedocumentationconfig-ts
- Generated At: 2025-11-14T21:30:42.477Z

## Authored
### Purpose
Defines the canonical configuration shape for staged Live Documentation and normalises user input into deterministic defaults for the toolchain.

### Notes
- Exposes defaults for mirror roots, glob patterns, archetype overrides, and evidence policies so generators and linters share a single source of truth.
- `normalizeLiveDocumentationConfig` deduplicates globs, trims string options, and merges evidence strictness while preserving any caller-provided overrides.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T21:30:42.477Z","inputHash":"be6e5040a24fc10d"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LiveDocumentationSlugDialect`
- Type: type
- Source: [source](../../../../../../packages/shared/src/config/liveDocumentationConfig.ts#L3)

#### `LiveDocumentationArchetype`
- Type: type
- Source: [source](../../../../../../packages/shared/src/config/liveDocumentationConfig.ts#L5)

#### `LiveDocumentationEvidenceStrictMode`
- Type: type
- Source: [source](../../../../../../packages/shared/src/config/liveDocumentationConfig.ts#L17)

#### `LiveDocumentationEvidenceConfig`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/config/liveDocumentationConfig.ts#L19)

#### `LiveDocumentationConfig`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/config/liveDocumentationConfig.ts#L23)

#### `LiveDocumentationConfigInput`
- Type: type
- Source: [source](../../../../../../packages/shared/src/config/liveDocumentationConfig.ts#L42)

#### `LIVE_DOCUMENTATION_DEFAULT_ROOT`
- Type: const
- Source: [source](../../../../../../packages/shared/src/config/liveDocumentationConfig.ts#L46)

#### `LIVE_DOCUMENTATION_DEFAULT_BASE_LAYER`
- Type: const
- Source: [source](../../../../../../packages/shared/src/config/liveDocumentationConfig.ts#L47)

#### `LIVE_DOCUMENTATION_DEFAULT_GLOBS`
- Type: const
- Source: [source](../../../../../../packages/shared/src/config/liveDocumentationConfig.ts#L48)

#### `DEFAULT_LIVE_DOCUMENTATION_CONFIG`
- Type: const
- Source: [source](../../../../../../packages/shared/src/config/liveDocumentationConfig.ts#L62)

#### `normalizeLiveDocumentationConfig`
- Type: function
- Source: [source](../../../../../../packages/shared/src/config/liveDocumentationConfig.ts#L75)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_No dependencies documented yet_
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [analyzeWithAI.test.ts](../../../extension/src/commands/analyzeWithAI.test.ts.mdmd.md)
- [exportDiagnostics.test.ts](../../../extension/src/commands/exportDiagnostics.test.ts.mdmd.md)
- [inspectSymbolNeighbors.test.ts](../../../extension/src/commands/inspectSymbolNeighbors.test.ts.mdmd.md)
- [dependencyQuickPick.test.ts](../../../extension/src/diagnostics/dependencyQuickPick.test.ts.mdmd.md)
- [docDiagnosticProvider.test.ts](../../../extension/src/diagnostics/docDiagnosticProvider.test.ts.mdmd.md)
- [localOllamaBridge.test.ts](../../../extension/src/services/localOllamaBridge.test.ts.mdmd.md)
- [symbolBridge.test.ts](../../../extension/src/services/symbolBridge.test.ts.mdmd.md)
- [saveCodeChange.test.ts](../../../server/src/features/changeEvents/saveCodeChange.test.ts.mdmd.md)
- [saveDocumentChange.test.ts](../../../server/src/features/changeEvents/saveDocumentChange.test.ts.mdmd.md)
- [inspectDependencies.test.ts](../../../server/src/features/dependencies/inspectDependencies.test.ts.mdmd.md)
- [symbolNeighbors.test.ts](../../../server/src/features/dependencies/symbolNeighbors.test.ts.mdmd.md)
- [acknowledgementService.test.ts](../../../server/src/features/diagnostics/acknowledgementService.test.ts.mdmd.md)
- [listOutstandingDiagnostics.test.ts](../../../server/src/features/diagnostics/listOutstandingDiagnostics.test.ts.mdmd.md)
- [noiseFilter.test.ts](../../../server/src/features/diagnostics/noiseFilter.test.ts.mdmd.md)
- [publishDocDiagnostics.test.ts](../../../server/src/features/diagnostics/publishDocDiagnostics.test.ts.mdmd.md)
- [feedFormatDetector.test.ts](../../../server/src/features/knowledge/feedFormatDetector.test.ts.mdmd.md)
- [knowledgeFeedManager.test.ts](../../../server/src/features/knowledge/knowledgeFeedManager.test.ts.mdmd.md)
- [knowledgeGraphBridge.test.ts](../../../server/src/features/knowledge/knowledgeGraphBridge.test.ts.mdmd.md)
- [knowledgeGraphIngestor.test.ts](../../../server/src/features/knowledge/knowledgeGraphIngestor.test.ts.mdmd.md)
- [llmIngestionOrchestrator.test.ts](../../../server/src/features/knowledge/llmIngestionOrchestrator.test.ts.mdmd.md)
- [lsifParser.test.ts](../../../server/src/features/knowledge/lsifParser.test.ts.mdmd.md)
- [rippleAnalyzer.test.ts](../../../server/src/features/knowledge/rippleAnalyzer.test.ts.mdmd.md)
- [scipParser.test.ts](../../../server/src/features/knowledge/scipParser.test.ts.mdmd.md)
- [workspaceIndexProvider.test.ts](../../../server/src/features/knowledge/workspaceIndexProvider.test.ts.mdmd.md)
- [python.docstring.test.ts](../../../server/src/features/live-docs/generation/adapters/python.docstring.test.ts.mdmd.md)
- [core.docstring.test.ts](../../../server/src/features/live-docs/generation/core.docstring.test.ts.mdmd.md)
- [generator.test.ts](../../../server/src/features/live-docs/generator.test.ts.mdmd.md)
- [renderPublicSymbolLines.test.ts](../../../server/src/features/live-docs/renderPublicSymbolLines.test.ts.mdmd.md)
- [generator.test.ts](../../../server/src/features/live-docs/system/generator.test.ts.mdmd.md)
- [artifactWatcher.test.ts](../../../server/src/features/watchers/artifactWatcher.test.ts.mdmd.md)
- [pathReferenceDetector.test.ts](../../../server/src/features/watchers/pathReferenceDetector.test.ts.mdmd.md)
- [environment.test.ts](../../../server/src/runtime/environment.test.ts.mdmd.md)
- [settings.test.ts](../../../server/src/runtime/settings.test.ts.mdmd.md)
- [latencyTracker.test.ts](../../../server/src/telemetry/latencyTracker.test.ts.mdmd.md)
- [liveDocumentationConfig.test.ts](./liveDocumentationConfig.test.ts.mdmd.md)
- [generator.test.ts](../live-docs/generator.test.ts.mdmd.md)
- [schema.test.ts](../live-docs/schema.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
