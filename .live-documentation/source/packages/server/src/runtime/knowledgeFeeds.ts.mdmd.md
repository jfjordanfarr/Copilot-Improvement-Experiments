# packages/server/src/runtime/knowledgeFeeds.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/runtime/knowledgeFeeds.ts
- Live Doc ID: LD-implementation-packages-server-src-runtime-knowledgefeeds-ts
- Generated At: 2025-11-09T22:52:11.430Z

## Authored
### Purpose
Orchestrates the background knowledge-feed bridge, wiring its status updates into the artifact watcher so inference runs can leverage external evidence sources.

### Notes
- Recreates the bridge whenever graph storage, workspace root, or disk storage changes; otherwise disposes and clears feeds to avoid leaking stale handles.
- Subscribes to `onStatusChanged` so healthy feeds are pushed into the watcher immediately, while also logging status transitions for observability.
- Applies exponential backoff defaults and captures failures through `describeError`, ensuring the language server degrades gracefully when feeds are unavailable.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:11.430Z","inputHash":"ac26bc960dd75f3b"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `KnowledgeFeedControllerOptions`
- Type: interface
- Source: [source](../../../../../../packages/server/src/runtime/knowledgeFeeds.ts#L13)

#### `KnowledgeFeedInitializeParams`
- Type: interface
- Source: [source](../../../../../../packages/server/src/runtime/knowledgeFeeds.ts#L18)

#### `KnowledgeFeedController`
- Type: class
- Source: [source](../../../../../../packages/server/src/runtime/knowledgeFeeds.ts#L25)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `GraphStore`, `KnowledgeFeed` (type-only)
- [`knowledgeGraphBridge.KnowledgeGraphBridgeDisposable`](../features/knowledge/knowledgeGraphBridge.ts.mdmd.md#knowledgegraphbridgedisposable)
- [`knowledgeGraphBridge.KnowledgeGraphBridgeService`](../features/knowledge/knowledgeGraphBridge.ts.mdmd.md#knowledgegraphbridgeservice)
- [`artifactWatcher.ArtifactWatcher`](../features/watchers/artifactWatcher.ts.mdmd.md#artifactwatcher) (type-only)
- [`environment.describeError`](./environment.ts.mdmd.md#describeerror)
- `vscode-languageserver/node` - `Connection` (type-only)
<!-- LIVE-DOC:END Dependencies -->
