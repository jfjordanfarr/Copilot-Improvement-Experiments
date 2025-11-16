# packages/shared/src/live-docs/markdown.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/live-docs/markdown.ts
- Live Doc ID: LD-implementation-packages-shared-src-live-docs-markdown-ts
- Generated At: 2025-11-16T02:09:51.956Z

## Authored
### Purpose
Render deterministic Live Documentation files by combining preserved authored prose with generated sections, metadata, and provenance markers.

### Notes
Builds the full markdown document in memory, inserting metadata headers, authored content (or the default template when missing), and generator-supplied sections bounded by BEGIN/END comments for later diffing. Utility exports expose marker strings, provenance serialization, and helpers that compose workspace-relative Live Doc paths and ids using `normalizeWorkspacePath` so both CLI and extension produce identical layouts.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.956Z","inputHash":"2103e7625d055b99"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LIVE_DOC_BEGIN_MARKER_PREFIX`
- Type: const
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L7)

#### `LIVE_DOC_END_MARKER_PREFIX`
- Type: const
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L8)

#### `LIVE_DOC_PROVENANCE_MARKER`
- Type: const
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L9)

#### `LiveDocRenderSection`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L11)

#### `RenderLiveDocOptions`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L17)

#### `renderLiveDocMarkdown`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L33)

#### `renderBeginMarker`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L72)

#### `renderEndMarker`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L76)

#### `renderProvenanceComment`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L80)

#### `extractAuthoredBlock`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L85)

#### `defaultAuthoredTemplate`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L147)

#### `composeLiveDocPath`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L151)

#### `composeLiveDocId`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L165)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- [`liveDocumentationConfig.LIVE_DOCUMENTATION_FILE_EXTENSION`](../config/liveDocumentationConfig.ts.md#live_documentation_file_extension)
- [`schema.LiveDocMetadata`](./schema.ts.md#livedocmetadata) (type-only)
- [`schema.LiveDocProvenance`](./schema.ts.md#livedocprovenance) (type-only)
- [`pathUtils.normalizeWorkspacePath`](../tooling/pathUtils.ts.md#normalizeworkspacepath)
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
<!-- LIVE-DOC:END Observed Evidence -->
