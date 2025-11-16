# packages/shared/src/config/liveDocumentationConfig.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/config/liveDocumentationConfig.ts
- Live Doc ID: LD-implementation-packages-shared-src-config-livedocumentationconfig-ts
- Generated At: 2025-11-16T16:08:45.239Z

## Authored
### Purpose
Defines the canonical configuration shape for staged Live Documentation and normalises user input into deterministic defaults for the toolchain.

### Notes
- Exposes defaults for mirror roots, glob patterns, archetype overrides, and evidence policies so generators and linters share a single source of truth.
- `normalizeLiveDocumentationConfig` deduplicates globs, trims string options, and merges evidence strictness while preserving any caller-provided overrides.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T16:08:45.239Z","inputHash":"73d9a0e0c77764ce"}]} -->
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

#### `LIVE_DOCUMENTATION_FILE_EXTENSION`
- Type: const
- Source: [source](../../../../../../packages/shared/src/config/liveDocumentationConfig.ts#L48)

#### `LIVE_DOCUMENTATION_DEFAULT_GLOBS`
- Type: const
- Source: [source](../../../../../../packages/shared/src/config/liveDocumentationConfig.ts#L49)

#### `DEFAULT_LIVE_DOCUMENTATION_CONFIG`
- Type: const
- Source: [source](../../../../../../packages/shared/src/config/liveDocumentationConfig.ts#L65)

#### `normalizeLiveDocumentationConfig`
- Type: function
- Source: [source](../../../../../../packages/shared/src/config/liveDocumentationConfig.ts#L78)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_No dependencies documented yet_
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
- [generator.test.ts](../../../server/src/features/live-docs/generator.test.ts.md)
- [renderPublicSymbolLines.test.ts](../../../server/src/features/live-docs/renderPublicSymbolLines.test.ts.md)
- [generator.test.ts](../../../server/src/features/live-docs/system/generator.test.ts.md)
- [artifactWatcher.test.ts](../../../server/src/features/watchers/artifactWatcher.test.ts.md)
- [pathReferenceDetector.test.ts](../../../server/src/features/watchers/pathReferenceDetector.test.ts.md)
- [environment.test.ts](../../../server/src/runtime/environment.test.ts.md)
- [settings.test.ts](../../../server/src/runtime/settings.test.ts.md)
- [latencyTracker.test.ts](../../../server/src/telemetry/latencyTracker.test.ts.md)
- [liveDocumentationConfig.test.ts](./liveDocumentationConfig.test.ts.md)
- [c.docstring.test.ts](../live-docs/adapters/c.docstring.test.ts.md)
- [python.docstring.test.ts](../live-docs/adapters/python.docstring.test.ts.md)
- [ruby.docstring.test.ts](../live-docs/adapters/ruby.docstring.test.ts.md)
- [rust.docstring.test.ts](../live-docs/adapters/rust.docstring.test.ts.md)
- [coActivation.test.ts](../live-docs/analysis/coActivation.test.ts.md)
- [core.docstring.test.ts](../live-docs/core.docstring.test.ts.md)
- [generator.test.ts](../live-docs/generator.test.ts.md)
- [schema.test.ts](../live-docs/schema.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
