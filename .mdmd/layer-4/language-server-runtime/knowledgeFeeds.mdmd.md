# Knowledge Feed Controller (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/runtime/knowledgeFeeds.ts`](../../../packages/server/src/runtime/knowledgeFeeds.ts)
- Collaborators: [`knowledgeGraphBridge.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphBridge.ts), [`artifactWatcher.ts`](../../../packages/server/src/features/watchers/artifactWatcher.ts)
- Parent design: [Knowledge Graph Ingestion Architecture](../../layer-3/knowledge-graph-ingestion.mdmd.md), [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)

## Exported Symbols

#### KnowledgeFeedControllerOptions
`KnowledgeFeedControllerOptions` captures the LSP connection and optional clock used to report feed lifecycle messages and backoff timing.

#### KnowledgeFeedInitializeParams
`KnowledgeFeedInitializeParams` supplies the mutable pieces (graph store, watcher, storage directory, workspace root) needed when refreshing feed state.

#### KnowledgeFeedController
`KnowledgeFeedController` manages the lifecycle of the `KnowledgeGraphBridgeService`, wiring its status into the artifact watcher and logging health transitions to the LSP console.

## Responsibility
Provide a single orchestration point that:
- Spins up the on-disk knowledge bridge when the graph store and watcher are ready.
- Pipes healthy feed lists back into the watcher so inference runs include external relationships.
- Emits diagnostic logs for operators when feeds fail, recover, or are missing entirely.

## Key Behaviour
- **Graceful degradation** – If either the graph store or watcher is unavailable, the controller clears feeds and skips startup rather than throwing.
- **Status propagation** – Subscribes to bridge status updates to keep the watcher in sync and to report feed health with contextual metadata.
- **Backoff configuration** – Seeds the bridge with exponential backoff defaults so repeated failures do not thrash remote providers.
- **Disposal safety** – Always clears the watcher feeds and resets counters even when shutdown throws, ensuring subsequent initialisations start from a clean slate.

## Evidence
- Integration suite [`tests/integration/us5/transformRipple.test.ts`](../../../tests/integration/us5/transformRipple.test.ts) validates that healthy feeds enrich ripple diagnostics once the controller bootstraps.
- Manual end-to-end scenarios (see [`AI-Agent-Workspace/Notes/user-intent-census.md`](../../../AI-Agent-Workspace/Notes/user-intent-census.md)) document feed behaviour during workspace indexing experiments.
