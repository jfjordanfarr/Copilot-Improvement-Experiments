# Language Server Architecture

## Metadata
- Layer: 3
- Component IDs: COMP-003

## Components

### COMP-003 Language Server Runtime
Supports FR-LD1, FR-LD2, and FR-LD5 by orchestrating workspace change ingestion, Live Doc regeneration hooks, inference, diagnostics, and knowledge feed health so ripple answers remain deterministic and actionable.

## Responsibilities

### Runtime Initialisation
- Resolve workspace configuration, Live Documentation storage (`liveDocumentationConfig`), and provider guard settings via `main.ts` before wiring shared services.
- Register LSP handlers for configuration updates, dependency and symbol inspections, file maintenance requests, Live Doc regeneration commands, and diagnostics publication.

### Change Intake and Persistence
- Debounce and queue document/code saves through `ChangeQueue` and `ArtifactWatcher`, enriching events with content, category, relationship hints, and Live Doc ownership.
- Notify the Live Doc Generator service when tracked artifacts change so staged markdown stays current before diagnostics fire.
- Persist change metadata via `saveDocumentChange` / `saveCodeChange` so acknowledgement workflows, drift history, and regeneration provenance stay durable.

### Docstring Bridge Stewardship
- Coordinate docstring bridge adapters that lift XML/TSDoc/Sphinx/Rustdoc payloads into the canonical schema consumed by the Live Doc generator.
- Detect drift between inline documentation and Live Doc narratives, surface diagnostics, and queue regeneration when discrepancies persist across saves.
- Ensure adapters emit deterministic per-field headings (`##### `Symbol` — Summary`, etc.), report unsupported tags with provenance, and raise telemetry when placeholders or raw fragments exceed thresholds so product owners can prioritise new mappings.

### Inference and Ripple Analysis
- Merge inference results from workspace providers, Live Doc dependency snapshots, knowledge feeds, and optional LLM fallbacks inside `changeProcessor`.
- Drive `RippleAnalyzer` and dependency builders to compute downstream impacts and annotate Live Doc projections before diagnostic publication.

### Knowledge Feed Stewardship
- Bootstrap static JSON feeds and streaming sources using `KnowledgeGraphBridgeService` and `KnowledgeFeedManager`.
- Validate feed health, persist refreshed edges, and expose degradation diagnostics back to the extension.

### Diagnostics Publication
- Emit `code-ripple` and `doc-drift` diagnostics via publishers that respect hysteresis, noise suppression, acknowledgement suppression, and runtime budgets while embedding Live Doc hyperlinks, evidence counts, and regeneration timestamps.

## Interfaces

### Inbound Interfaces
- LSP requests/notifications: configuration changes, maintenance prompts, dependency/symbol inspections, and symbol harvesters.
- Workspace save/rename/delete events transferred from the extension via the change queue and maintenance contracts.
- Live Doc regeneration commands from CLI/extension surfaces (`liveDocs/generate`, `Live Docs: Regenerate File`).

### Outbound Interfaces
- Diagnostics notifications to the extension, annotated with ripple metadata and acknowledgement state.
- Dependency inspection responses (`InspectDependenciesResult`, symbol neighbour payloads) and feed health summaries for UI/CLI use.
- Live Doc Generator queue events providing change hints, targeted artifact lists, and configuration snapshots.
- Telemetry/logging hooks for suppression metrics, feed status, and change event persistence.

## Linked Implementations

### IMP-102 publishDocDiagnostics
Diagnostic publisher enforcing hysteresis for markdown ripple. [Server Diagnostics Publisher](../../.live-documentation/source/packages/server/src/features/diagnostics/publishDocDiagnostics.ts.md)

### IMP-104 publishCodeDiagnostics
Diagnostic publisher for code ripple with suppression metrics. [Code Diagnostics Publisher](../../.live-documentation/source/packages/server/src/features/diagnostics/publishCodeDiagnostics.ts.md)

### IMP-105 acknowledgementService
Persist acknowledgement state and suppression lookups. [Acknowledgement Service](../../.live-documentation/source/packages/server/src/features/diagnostics/acknowledgementService.ts.md)

### IMP-111 changeQueue
Manages debounced change intake before processing. [Change Queue Runtime](../../.live-documentation/source/packages/server/src/features/changeEvents/changeQueue.ts.md)

### IMP-112 knowledgeFeedManager
Validates and persists external feed updates. [Knowledge Feed Manager](../../.live-documentation/source/packages/server/src/features/knowledge/knowledgeFeedManager.ts.md)

### IMP-205 knowledgeGraphIngestor
Applies validated feed payloads to the graph store and maintains checkpoints. [Knowledge Graph Ingestor](../../.live-documentation/source/packages/server/src/features/knowledge/knowledgeGraphIngestor.ts.md)

### IMP-211 knowledgeGraphBridgeService
Bootstraps feed discovery, diagnostics propagation, and lifecycle hooks for ingestion collaborators. [Knowledge Graph Bridge Service](../../.live-documentation/source/packages/server/src/features/knowledge/knowledgeGraphBridge.ts.md)

### IMP-113 providerGuard
Gates diagnostics until consent is granted. [Provider Guard](../../.live-documentation/source/packages/server/src/features/settings/providerGuard.ts.md)

### IMP-114 inspectDependencies Handler
Serves dependency traversal over LSP. [Inspect Dependencies Handler](../../.live-documentation/source/packages/server/src/features/dependencies/inspectDependencies.ts.md)

### IMP-115 symbolNeighbors Handler
Returns symbol neighbourhoods for Quick Pick and CLI surfaces. [Symbol Neighbors Handler](../../.live-documentation/source/packages/server/src/features/dependencies/symbolNeighbors.ts.md)

### IMP-116 artifactWatcher
Prepares workspace change events, loads content, and kicks off inference. [Artifact Watcher](../../.live-documentation/source/packages/server/src/features/watchers/artifactWatcher.ts.md)

## Evidence
- Unit tests cover change queue, provider guard, diagnostics publishers, and feed managers (`changeQueue.test.ts`, `providerGuard.test.ts`, `publishDocDiagnostics.test.ts`, `publishCodeDiagnostics.test.ts`, `knowledgeFeedManager.test.ts`).
- Integration suites US1–US5 exercise the full language server loop from change intake to diagnostics emission.
- Safe-to-commit orchestrations rebuild the graph snapshot and run feed audits to confirm deterministic persistence.
- Planned Live Documentation suites (`tests/integration/live-docs/generation.test.ts`, `inspect-cli.test.ts`) ensure regeneration commands, CLI parity, and diagnostic enrichment stay wired through the runtime.

## Operational Notes
- Drift history ledger (`DriftHistoryStore`) records emitted/acknowledged pairs for reporting (FR-009).
- Pending work includes telemetry streams for suppression counters and LLM inference once `llmProviderMode` expands beyond local-only.
