# Language Server Runtime Bootstrap (Layer 4)

## Metadata
- Layer: 4
- Implementation ID: IMP-100
- Code Path: [`packages/server/src/main.ts`](../../../packages/server/src/main.ts)
- Exports: (entrypoint)

## Source Breadcrumbs
<!-- mdmd:code packages/server/src/main.ts -->
- [`packages/server/src/main.ts`](../../../packages/server/src/main.ts) boots the language server connection and wires runtime collaborators.
<!-- mdmd:code packages/server/src/runtime/changeProcessor.ts -->
- [`packages/server/src/runtime/changeProcessor.ts`](../../../packages/server/src/runtime/changeProcessor.ts) orchestrates inference and persistence for document saves.
<!-- mdmd:code packages/server/src/runtime/environment.ts -->
- [`packages/server/src/runtime/environment.ts`](../../../packages/server/src/runtime/environment.ts) resolves workspace paths and shared runtime configuration.
<!-- mdmd:code packages/server/src/runtime/knowledgeFeeds.ts -->
- [`packages/server/src/runtime/knowledgeFeeds.ts`](../../../packages/server/src/runtime/knowledgeFeeds.ts) manages knowledge feed lifecycle bindings to the runtime context.
<!-- mdmd:code packages/server/src/runtime/settings.ts -->
- [`packages/server/src/runtime/settings.ts`](../../../packages/server/src/runtime/settings.ts) derives runtime settings from provider metadata and extension configuration.
- Parent design: [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)
- Spec references: [FR-002](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-003](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-008](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-012](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-015](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements)

## Purpose
Owns the language server bootstrap loop: wiring LSP lifecycle events, projecting workspace settings into runtime configuration, coordinating change ingestion through `ArtifactWatcher`, and delegating diagnostics/knowledge-feed orchestration to dedicated services. The module guarantees that downstream processors always see a coherent context (graph store, runtime throttles, noisy feed signals) before responding to client requests.

## Key Concepts
- **Provider Guard** – merges extension initialization data with test overrides, blocks diagnostics when providers are misconfigured, and exposes the authoritative `ExtensionSettings` snapshot.
- **Runtime Settings Derivation** – converts provider guard output into debounce + noise-suppression knobs (including noise filter thresholds) shared between change queue, diagnostics publishers, and knowledge feeds.
- **Change Queue** – debounced dispatcher that batches `TextDocument` saves into the asynchronous `ChangeProcessor` pipeline.
- **Change Processor Context** – shared state for inference, persistence, and diagnostic publication; updated whenever graph store, watcher, or runtime settings change.
- **Knowledge Feed Controller** – lifecycle manager for `KnowledgeGraphBridgeService`, ensuring healthy feeds are reflected into the `ArtifactWatcher` while respecting storage/backoff constraints.
- **Workspace Providers** – composed symbol/workspace index providers registered with the watcher to seed relationship hints during inference.

## Public API Surfaces
- `connection.onRequest(INSPECT_DEPENDENCIES_REQUEST)` – surface dependency graph snapshots for the client.
- `connection.onRequest(SET_DIAGNOSTIC_ASSESSMENT_REQUEST)` – persist AI assessments to the graph store and echo the updated record back to the client.
- `connection.onRequest(INVOKE_LLM_REQUEST)` (handled via `createDefaultRelationshipExtractor`) – forward ingestion prompts to the extension-host model invoker when provider mode permits.

## Internal Flow
```mermaid
graph TD
  A[onInitialize] --> B[Load + merge settings]
  B --> C[Resolve workspace + storage paths]
  C --> D[Create GraphStore]
  D --> E[Instantiate ChangeQueue & ArtifactWatcher]
  E --> F[Wire workspace providers]
  E --> G[Update ChangeProcessor context]
  G --> H[Initialize KnowledgeFeedController]
  H --> I[Ready for document events]
  I --> J[documents.onDidSave]
  J --> K[ChangeQueue flush]
  K --> L[ChangeProcessor.process]
  L --> M[Noise Filter]
  M --> N[Persist Changes & Publish Diagnostics]
```

## Error Handling
- Initialization guards return early when graph store or watcher setup fails, preventing downstream processors from running in a partially configured state.
- `ChangeProcessor` logs and aborts batches when inference produces exceptions while still tracking skipped artifacts.
- Knowledge feed initialization disposes previous services before recreating them and degrades gracefully when storage directories are unavailable.
- Override and inspection requests throw explicit errors when the graph store has not been initialised, keeping client interactions predictable.

## Observability Hooks
- Structured logging across lifecycle operations (`info/warn/error`) with explicit change counts and diagnostic emission summaries.
- Knowledge feed status updates bubble through the controller to refresh watcher feeds and emit status traces.
- Runtime setting updates log the active debounce window and noise suppression level for benchmarking noise-control tuning.

## Current Implementation Notes
- Splitting helpers into `runtime/*` modules keeps `main.ts` below the 500-line threshold and enables targeted unit tests for settings derivation, environment resolution, change processing, and knowledge feed lifecycle management.
- `syncRuntimeSettings` now rehydrates both the change queue and knowledge feed controller, aligning debounce/noise configuration across diagnostics and external feed ingestion.
- The language server registers for `workspace/didChangeConfiguration` in `onInitialized` so that client-driven setting changes can be observed without additional manual plumbing.
- `createDefaultRelationshipExtractor` now sends `INVOKE_LLM_REQUEST` payloads to the client, logging provider mode/model id whenever live ingestion is active.
- Future work: layer-3 documentation should codify the broader language server architecture, building on this runtime bootstrap contract.
