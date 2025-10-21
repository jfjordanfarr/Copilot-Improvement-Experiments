# Language Server Architecture (Layer 3)

## Purpose
Describe how the language server orchestrates change ingestion, inference, diagnostics, and knowledge-feed integration to answer "what else does this change impact?" within VS Code.

## Runtime Stages
1. **Initialization (`main.ts`)**
   - Resolve workspace root, storage paths, and apply provider guard settings.
   - Instantiate shared services: `GraphStore`, `ChangeQueue`, `ArtifactWatcher`, `ChangeProcessor`, knowledge feed controller.
   - Register LSP handlers for configuration changes, override requests, dependency inspection, and file maintenance notifications.
2. **Change Intake**
   - `documents.onDidSave` enqueues artifacts into `ChangeQueue`, debounced via runtime settings.
   - `ArtifactWatcher` enriches changes with content, category (doc/code), and relationship hints (symbol bridge, path detector).
3. **Inference & Persistence**
   - `ChangeProcessor` merges inference results from workspace providers and knowledge feeds, persists artifacts/links, and records change events (`saveDocumentChange`, `saveCodeChange`).
4. **Ripple Analysis & Diagnostics**
   - `RippleAnalyzer` and dependency utilities compute impacted artifacts.
   - Publishers (`publishCodeDiagnostics`, `publishDocDiagnostics`) emit diagnostics respecting noise suppression and hysteresis policies.
5. **Knowledge Feed Ingestion**
   - `KnowledgeGraphBridgeService` bootstraps static JSON feeds and streams; `KnowledgeFeedManager` + `KnowledgeGraphIngestor` validate, persist, and surface health diagnostics.

## Core Modules
- **Settings**: `providerGuard.ts` gates diagnostics pending consent; `settingsBridge.ts` derives runtime knobs (debounce, noise levels, ripple limits).
- **Change Events**: `changeQueue.ts`, `saveDocumentChange.ts`, `saveCodeChange.ts` persist change metadata for acknowledgement workflows.
- **Diagnostics**: `publishCodeDiagnostics.ts`, `publishDocDiagnostics.ts`, `hysteresisController.ts`, shared `diagnosticUtils.ts`.
- **Knowledge Feeds**: `knowledgeGraphBridge.ts`, `knowledgeFeedManager.ts`, `knowledgeGraphIngestor.ts` keep external edges synchronized.
- **Watchers**: `artifactWatcher.ts`, `pathReferenceDetector.ts`, maintenance handlers for orphaned files.

## Data Contracts
- **RuntimeSettings** – derived from extension config; shared across queue, diagnostics, ripple analysis.
- **RippleHint / RippleImpact** – computed from knowledge graph to annotate diagnostics.
- **ChangeEvent** – persisted record linking artifacts to change timestamps, used for acknowledgement and diagnostics metadata.
- **KnowledgeFeed descriptors** – feed IDs, snapshot loaders, stream cursors consumed by inference orchestrator.

## Observability & Resilience
- Structured logging per subsystem (knowledge feeds, change processor, diagnostics publish).
- Feed diagnostics surface degraded states back to extension.
- Hysteresis prevents diagnostic ping-pong; budgets guard against noise bursts.
- Provider guard logs when diagnostics remain disabled to aid onboarding debugging.

## Open Items
- Persist hysteresis + acknowledgement state to disk for resilience across restarts (tracked under T042).
- Expand telemetry once privacy approvals allow metrics on diagnostic suppression and ripple sizes.
- Integrate LLM inference providers when `llmProviderMode` toggles beyond local-only.
