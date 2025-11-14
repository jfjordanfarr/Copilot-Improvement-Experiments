# packages/shared/src/live-docs/markdown.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/live-docs/markdown.ts
- Live Doc ID: LD-implementation-packages-shared-src-live-docs-markdown-ts
- Generated At: 2025-11-14T18:42:06.802Z

## Authored
### Purpose
Render deterministic Live Documentation files by combining preserved authored prose with generated sections, metadata, and provenance markers.

### Notes
Builds the full markdown document in memory, inserting metadata headers, authored content (or the default template when missing), and generator-supplied sections bounded by BEGIN/END comments for later diffing. Utility exports expose marker strings, provenance serialization, and helpers that compose workspace-relative Live Doc paths and ids using `normalizeWorkspacePath` so both CLI and extension produce identical layouts.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.802Z","inputHash":"1b3906fb77428b3b"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LIVE_DOC_BEGIN_MARKER_PREFIX`
- Type: const
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L6)

#### `LIVE_DOC_END_MARKER_PREFIX`
- Type: const
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L7)

#### `LIVE_DOC_PROVENANCE_MARKER`
- Type: const
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L8)

#### `LiveDocRenderSection`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L10)

#### `RenderLiveDocOptions`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L16)

#### `renderLiveDocMarkdown`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L32)

#### `renderBeginMarker`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L71)

#### `renderEndMarker`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L75)

#### `renderProvenanceComment`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L79)

#### `extractAuthoredBlock`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L84)

#### `defaultAuthoredTemplate`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L146)

#### `composeLiveDocPath`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L150)

#### `composeLiveDocId`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/markdown.ts#L161)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- [`schema.LiveDocMetadata`](./schema.ts.mdmd.md#livedocmetadata) (type-only)
- [`schema.LiveDocProvenance`](./schema.ts.mdmd.md#livedocprovenance) (type-only)
- [`pathUtils.normalizeWorkspacePath`](../tooling/pathUtils.ts.mdmd.md#normalizeworkspacepath)
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
- [generator.test.ts](../../../server/src/features/live-docs/generator.test.ts.mdmd.md)
- [renderPublicSymbolLines.test.ts](../../../server/src/features/live-docs/renderPublicSymbolLines.test.ts.mdmd.md)
- [generator.test.ts](../../../server/src/features/live-docs/system/generator.test.ts.mdmd.md)
- [artifactWatcher.test.ts](../../../server/src/features/watchers/artifactWatcher.test.ts.mdmd.md)
- [pathReferenceDetector.test.ts](../../../server/src/features/watchers/pathReferenceDetector.test.ts.mdmd.md)
- [environment.test.ts](../../../server/src/runtime/environment.test.ts.mdmd.md)
- [settings.test.ts](../../../server/src/runtime/settings.test.ts.mdmd.md)
- [latencyTracker.test.ts](../../../server/src/telemetry/latencyTracker.test.ts.mdmd.md)
- [generator.test.ts](./generator.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
