# packages/server/src/runtime/knowledgeFeeds.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/runtime/knowledgeFeeds.ts
- Live Doc ID: LD-implementation-packages-server-src-runtime-knowledgefeeds-ts
- Generated At: 2025-11-16T02:09:51.709Z

## Authored
### Purpose
Orchestrates the background knowledge-feed bridge, wiring its status updates into the artifact watcher so inference runs can leverage external evidence sources.

### Notes
- Recreates the bridge whenever graph storage, workspace root, or disk storage changes; otherwise disposes and clears feeds to avoid leaking stale handles.
- Subscribes to `onStatusChanged` so healthy feeds are pushed into the watcher immediately, while also logging status transitions for observability.
- Applies exponential backoff defaults and captures failures through `describeError`, ensuring the language server degrades gracefully when feeds are unavailable.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.709Z","inputHash":"0d8c20bb6a12e473"}]} -->
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
- [`knowledgeGraphBridge.KnowledgeGraphBridgeDisposable`](../features/knowledge/knowledgeGraphBridge.ts.md#knowledgegraphbridgedisposable)
- [`knowledgeGraphBridge.KnowledgeGraphBridgeService`](../features/knowledge/knowledgeGraphBridge.ts.md#knowledgegraphbridgeservice)
- [`artifactWatcher.ArtifactWatcher`](../features/watchers/artifactWatcher.ts.md#artifactwatcher) (type-only)
- [`environment.describeError`](./environment.ts.md#describeerror)
- `vscode-languageserver/node` - `Connection` (type-only)
<!-- LIVE-DOC:END Dependencies -->
