# Language Server Architecture

## Metadata
- Layer: 3
- Component IDs: COMP-003

## Components

### COMP-003 Language Server Runtime
Supports REQ-001 and REQ-030 by orchestrating workspace change ingestion, inference, diagnostics, and knowledge feed health so ripple answers remain deterministic and actionable.

## Responsibilities

### Runtime Initialisation
- Resolve workspace configuration, storage locations, and provider guard settings via `main.ts` before wiring shared services.
- Register LSP handlers for configuration updates, dependency and symbol inspections, file maintenance requests, and diagnostics publication.

### Change Intake and Persistence
- Debounce and queue document/code saves through `ChangeQueue` and `ArtifactWatcher`, enriching events with content, category, and relationship hints.
- Persist change metadata via `saveDocumentChange` / `saveCodeChange` so acknowledgement workflows and drift history stay durable.

### Inference and Ripple Analysis
- Merge inference results from workspace providers, knowledge feeds, and optional LLM fallbacks inside `changeProcessor`.
- Drive `RippleAnalyzer` and dependency builders to compute downstream impacts ahead of diagnostic publication.

### Knowledge Feed Stewardship
- Bootstrap static JSON feeds and streaming sources using `KnowledgeGraphBridgeService` and `KnowledgeFeedManager`.
- Validate feed health, persist refreshed edges, and expose degradation diagnostics back to the extension.

### Diagnostics Publication
- Emit `code-ripple` and `doc-drift` diagnostics via publishers that respect hysteresis, noise suppression, acknowledgement suppression, and runtime budgets.

## Interfaces

### Inbound Interfaces
- LSP requests/notifications: configuration changes, maintenance prompts, dependency/symbol inspections, and symbol harvesters.
- Workspace save/rename/delete events transferred from the extension via the change queue and maintenance contracts.

### Outbound Interfaces
- Diagnostics notifications to the extension, annotated with ripple metadata and acknowledgement state.
- Dependency inspection responses (`InspectDependenciesResult`, symbol neighbour payloads) and feed health summaries for UI/CLI use.
- Telemetry/logging hooks for suppression metrics, feed status, and change event persistence.

## Linked Implementations

### IMP-102 publishDocDiagnostics
Diagnostic publisher enforcing hysteresis for markdown ripple. [Server Diagnostics Publisher](/.mdmd/layer-4/server-diagnostics/publishDocDiagnostics.mdmd.md)

### IMP-104 publishCodeDiagnostics
Diagnostic publisher for code ripple with suppression metrics. [Code Diagnostics Publisher](/.mdmd/layer-4/server-diagnostics/publishCodeDiagnostics.mdmd.md)

### IMP-105 acknowledgementService
Persist acknowledgement state and suppression lookups. [Acknowledgement Service](/.mdmd/layer-4/server-diagnostics/acknowledgementService.mdmd.md)

### IMP-111 changeQueue
Manages debounced change intake before processing. [Change Queue Runtime](/.mdmd/layer-4/change-events/changeQueue.mdmd.md)

### IMP-112 knowledgeFeedManager
Validates and persists external feed updates. [Knowledge Feed Manager](/.mdmd/layer-4/knowledge-graph-ingestion/knowledgeFeedManager.mdmd.md)

### IMP-205 knowledgeGraphIngestor
Applies validated feed payloads to the graph store and maintains checkpoints. [Knowledge Graph Ingestor](/.mdmd/layer-4/knowledge-graph-ingestion/knowledgeGraphIngestor.mdmd.md)

### IMP-211 knowledgeGraphBridgeService
Bootstraps feed discovery, diagnostics propagation, and lifecycle hooks for ingestion collaborators. [Knowledge Graph Bridge Service](/.mdmd/layer-4/knowledge-graph-ingestion/knowledgeGraphBridge.mdmd.md)

### IMP-113 providerGuard
Gates diagnostics until consent is granted. [Provider Guard](/.mdmd/layer-4/server-settings/providerGuard.mdmd.md)

### IMP-114 inspectDependencies Handler
Serves dependency traversal over LSP. [Inspect Dependencies Handler](/.mdmd/layer-4/dependencies/inspectDependencies.mdmd.md)

### IMP-115 symbolNeighbors Handler
Returns symbol neighbourhoods for Quick Pick and CLI surfaces. [Symbol Neighbors Handler](/.mdmd/layer-4/dependencies/symbolNeighbors.mdmd.md)

### IMP-116 artifactWatcher
Prepares workspace change events, loads content, and kicks off inference. [Artifact Watcher](/.mdmd/layer-4/language-server-runtime/artifactWatcher.mdmd.md)

## Evidence
- Unit tests cover change queue, provider guard, diagnostics publishers, and feed managers (`changeQueue.test.ts`, `providerGuard.test.ts`, `publishDocDiagnostics.test.ts`, `publishCodeDiagnostics.test.ts`, `knowledgeFeedManager.test.ts`).
- Integration suites US1–US5 exercise the full language server loop from change intake to diagnostics emission.
- Safe-to-commit orchestrations rebuild the graph snapshot and run feed audits to confirm deterministic persistence.

## Operational Notes
- Drift history ledger (`DriftHistoryStore`) records emitted/acknowledged pairs for reporting (FR-009).
- Pending work includes telemetry streams for suppression counters and LLM inference once `llmProviderMode` expands beyond local-only.
