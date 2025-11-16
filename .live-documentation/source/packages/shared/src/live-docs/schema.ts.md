# packages/shared/src/live-docs/schema.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/live-docs/schema.ts
- Live Doc ID: LD-implementation-packages-shared-src-live-docs-schema-ts
- Generated At: 2025-11-16T02:09:51.963Z

## Authored
### Purpose
Define the canonical metadata schema for Live Documentation files, including provenance payloads and normalization helpers shared by the generator and ingest pipelines.

### Notes
`normalizeLiveDocMetadata` trims and canonicalises paths, ids, and timestamps, defaulting to layer 4 while accepting richer archetype/enricher data from configuration. Provenance normalization discards malformed generator entries, harmonises optional docstring status records, and guarantees consumers never see empty structures—stabilising the JSON embedded alongside rendered markdown.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.963Z","inputHash":"3cbccef2392e0369"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LiveDocLayer`
- Type: type
- Source: [source](../../../../../../packages/shared/src/live-docs/schema.ts#L5)

#### `LiveDocDocstringProvenance`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/schema.ts#L7)

#### `LiveDocGeneratorProvenance`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/schema.ts#L13)

#### `LiveDocProvenance`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/schema.ts#L21)

#### `LiveDocMetadata`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/schema.ts#L26)

#### `LiveDocMetadataInput`
- Type: type
- Source: [source](../../../../../../packages/shared/src/live-docs/schema.ts#L41)

#### `DEFAULT_LIVE_DOC_LAYER`
- Type: const
- Source: [source](../../../../../../packages/shared/src/live-docs/schema.ts#L46)

#### `normalizeLiveDocMetadata`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/schema.ts#L48)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`liveDocumentationConfig.LiveDocumentationArchetype`](../config/liveDocumentationConfig.ts.md#livedocumentationarchetype) (type-only)
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
- [generator.test.ts](./generator.test.ts.md)
- [schema.test.ts](./schema.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
