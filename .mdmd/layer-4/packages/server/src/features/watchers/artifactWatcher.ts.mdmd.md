# packages/server/src/features/watchers/artifactWatcher.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/watchers/artifactWatcher.ts
- Live Doc ID: LD-implementation-packages-server-src-features-watchers-artifactwatcher-ts
- Generated At: 2025-11-16T22:35:16.257Z

## Authored
### Purpose
Coordinates how workspace file updates flow into the server ingestion pipeline by classifying code versus documentation artifacts, harvesting reference hints, and driving link inference before writing results back to the GraphStore.

### Notes
- Replaced the legacy markdown watcher so code and doc changes share one queue and telemetry trail; see [2025-10-19 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-19.SUMMARIZED.md) for the refactor narrative.
- Normalizes file URIs prior to persistence so downstream diagnostics and knowledge feeds address a single canonical node per artifact.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:16.257Z","inputHash":"85d749170f9b03c1"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ArtifactCategory`
- Type: type
- Source: [source](../../../../../../../packages/server/src/features/watchers/artifactWatcher.ts#L24)

#### `DocumentStore`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/watchers/artifactWatcher.ts#L26)

#### `ArtifactWatcherLogger`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/watchers/artifactWatcher.ts#L30)

#### `ArtifactWatcherOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/watchers/artifactWatcher.ts#L36)

#### `TrackedArtifactChange`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/watchers/artifactWatcher.ts#L48)

#### `DocumentTrackedArtifactChange`
- Type: type
- Source: [source](../../../../../../../packages/server/src/features/watchers/artifactWatcher.ts#L60)

#### `CodeTrackedArtifactChange`
- Type: type
- Source: [source](../../../../../../../packages/server/src/features/watchers/artifactWatcher.ts#L61)

#### `SkippedArtifactChange`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/watchers/artifactWatcher.ts#L63)

#### `ArtifactWatcherResult`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/watchers/artifactWatcher.ts#L68)

#### `ArtifactWatcher`
- Type: class
- Source: [source](../../../../../../../packages/server/src/features/watchers/artifactWatcher.ts#L89)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `promises`
- `node:path` - `path`
- `node:url` - `fileURLToPath`
- [`changeQueue.QueuedChange`](../changeEvents/changeQueue.ts.mdmd.md#queuedchange) (type-only)
- [`uri.normalizeFileUri`](../utils/uri.ts.mdmd.md#normalizefileuri)
- [`pathReferenceDetector.buildFileReferenceHints`](./pathReferenceDetector.ts.mdmd.md#buildfilereferencehints)
- [`index.ArtifactLayer`](../../../../shared/src/index.ts.mdmd.md#artifactlayer)
- [`index.ArtifactSeed`](../../../../shared/src/index.ts.mdmd.md#artifactseed)
- [`index.FallbackLLMBridge`](../../../../shared/src/index.ts.mdmd.md#fallbackllmbridge)
- [`index.GraphStore`](../../../../shared/src/index.ts.mdmd.md#graphstore)
- [`index.KnowledgeArtifact`](../../../../shared/src/index.ts.mdmd.md#knowledgeartifact)
- [`index.KnowledgeFeed`](../../../../shared/src/index.ts.mdmd.md#knowledgefeed)
- [`index.LinkInferenceOrchestrator`](../../../../shared/src/index.ts.mdmd.md#linkinferenceorchestrator)
- [`index.LinkInferenceRunResult`](../../../../shared/src/index.ts.mdmd.md#linkinferencerunresult)
- [`index.LinkedArtifactSummary`](../../../../shared/src/index.ts.mdmd.md#linkedartifactsummary)
- [`index.RelationshipHint`](../../../../shared/src/index.ts.mdmd.md#relationshiphint)
- [`index.WorkspaceLinkProvider`](../../../../shared/src/index.ts.mdmd.md#workspacelinkprovider)
- `vscode-languageserver-textdocument` - `TextDocument`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [saveCodeChange.test.ts](../changeEvents/saveCodeChange.test.ts.mdmd.md)
- [saveDocumentChange.test.ts](../changeEvents/saveDocumentChange.test.ts.mdmd.md)
- [publishDocDiagnostics.test.ts](../diagnostics/publishDocDiagnostics.test.ts.mdmd.md)
- [artifactWatcher.test.ts](./artifactWatcher.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
