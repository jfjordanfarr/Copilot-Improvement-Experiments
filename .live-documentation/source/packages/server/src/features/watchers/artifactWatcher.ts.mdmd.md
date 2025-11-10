# packages/server/src/features/watchers/artifactWatcher.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/watchers/artifactWatcher.ts
- Live Doc ID: LD-implementation-packages-server-src-features-watchers-artifactwatcher-ts
- Generated At: 2025-11-09T22:52:11.197Z

## Authored
### Purpose
Observes queued workspace changes, classifies them as code or documentation, materialises canonical artifacts, then drives link inference to reconcile the knowledge graph.

### Notes
- Normalises URIs and layers, hydrates existing artifact metadata, and collects relationship hints from graph neighbors plus on-disk references before invoking the orchestrator.
- Streams document content from the VS Code text store or filesystem so inference providers operate on the latest edits, even prior to save.
- Applies inference results back onto processed changes, records skip reasons for transparency, and surfaces run metadata, making it suitable for telemetry and diagnostics consumers.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:11.197Z","inputHash":"eb1c4dc0e96ad341"}]} -->
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
- `@copilot-improvement/shared` - `ArtifactLayer`, `ArtifactSeed`, `FallbackLLMBridge`, `GraphStore`, `KnowledgeArtifact`, `KnowledgeFeed`, `LinkInferenceOrchestrator`, `LinkInferenceRunResult`, `LinkedArtifactSummary`, `RelationshipHint`, `WorkspaceLinkProvider`
- `node:fs` - `fs`
- `node:path` - `path`
- `node:url` - `fileURLToPath`
- [`changeQueue.QueuedChange`](../changeEvents/changeQueue.ts.mdmd.md#queuedchange) (type-only)
- [`uri.normalizeFileUri`](../utils/uri.ts.mdmd.md#normalizefileuri)
- [`pathReferenceDetector.buildFileReferenceHints`](./pathReferenceDetector.ts.mdmd.md#buildfilereferencehints)
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
