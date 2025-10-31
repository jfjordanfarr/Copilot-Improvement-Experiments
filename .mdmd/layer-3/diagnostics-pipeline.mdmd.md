# Diagnostics Pipeline Architecture

## Metadata
- Layer: 3
- Component IDs: COMP-001

## Components

### COMP-001 Diagnostics Pipeline
Supports REQ-001 and REQ-030 by synchronising on-disk artifact changes with the knowledge graph and emitting actionable ripple diagnostics across code and documentation.

## Responsibilities

### Change Intake
- Watch the workspace for save, rename, and delete events via `ArtifactWatcher` and extension-side file maintenance code.
- Classify artifacts as document or code, load contents, and seed inference providers with workspace and knowledge feed hints.

### Ripple Analysis
- Persist change events through `changeProcessor` and orchestrate `RippleAnalyzer` to calculate dependency impacts with depth, relationship kind, confidence, and noise budgets.
- Maintain deterministic URI normalisation (`normalizeFileUri`) so graph entries stay canonical across machines.

### Diagnostic Publication
- Publish `doc-drift` and `code-ripple` diagnostics via server diagnostics publishers while respecting hysteresis, batching, and acknowledgement suppression budgets.
- Surface ripple metadata, quick actions, and acknowledgement state to the VS Code client through `docDiagnosticProvider` and related extension commands.

## Interfaces

### Inbound Interfaces
- Language client change queue (`QueuedChange`) with debounce guarantees.
- Knowledge feed ingestion contracts and LLM fallback orchestrators for inferred edges.

### Outbound Interfaces
- Diagnostic publication APIs (`publishDocDiagnostics`, `publishCodeDiagnostics`) with acknowledgement (`AcknowledgementService`) and outstanding-diagnostic summaries (`listOutstandingDiagnostics`).
- Workspace maintenance hooks (`removeOrphans`) and Problems/hover UX registered in the extension.

## Linked Implementations

### IMP-101 docDiagnosticProvider
Renders diagnostic metadata and quick actions in the extension. [Extension Diagnostic Provider](/.mdmd/layer-4/extension-diagnostics/docDiagnosticProvider.mdmd.md)

### IMP-102 publishDocDiagnostics
Emits document diagnostics with hysteresis and acknowledgement budgets. [Server Diagnostics Publisher](/.mdmd/layer-4/server-diagnostics/publishDocDiagnostics.mdmd.md)

### IMP-103 changeProcessor
Persists change events and orchestrates ripple analysis. [Change Processor Runtime](/.mdmd/layer-4/language-server-runtime/changeProcessor.mdmd.md)

### IMP-104 publishCodeDiagnostics
Produces code-ripple diagnostics with batching and noise suppression. [Code Diagnostics Publisher](/.mdmd/layer-4/server-diagnostics/publishCodeDiagnostics.mdmd.md)

### IMP-105 acknowledgementService
Maintains acknowledgement state and suppression lookups. [Acknowledgement Service](/.mdmd/layer-4/server-diagnostics/acknowledgementService.mdmd.md)

### IMP-106 listOutstandingDiagnostics
Summarises unresolved diagnostics for CLI and UI surfaces. [Outstanding Diagnostics](/.mdmd/layer-4/server-diagnostics/listOutstandingDiagnostics.mdmd.md)

### IMP-116 artifactWatcher
Classifies workspace changes and enriches inference seeds ahead of ripple analysis. [Artifact Watcher](/.mdmd/layer-4/language-server-runtime/artifactWatcher.mdmd.md)

### IMP-117 rippleAnalyzer
Generates relationship hints that communicate downstream impact for diagnostics surfaces. [Ripple Analyzer](/.mdmd/layer-4/knowledge-graph-ingestion/rippleAnalyzer.mdmd.md)

## Evidence
- Unit coverage: `publishDocDiagnostics.test.ts`, `acknowledgementService.test.ts`, `listOutstandingDiagnostics.test.ts`, `artifactWatcher.test.ts`, `docDiagnosticProvider.test.ts`, `rippleAnalyzer.test.ts`.
- Integration coverage: US1–US5 suites exercise writer, developer, rename, and template ripple flows.
- Safe-to-commit pipeline: `npm run verify` and `npm run safe:commit` run the diagnostics stack before landing changes.

## Operational Notes
- `RuntimeSettings.noiseSuppression` controls hysteresis window, max diagnostics per batch, and suppression budgets.
- Diagnostics remain workspace-local; `linkAwareDiagnostics.llmProviderMode` must be configured before publishing ripple insights.
- Upcoming work (T05x) expands knowledge-feed ingestion; document acknowledgement UX will be captured in a sibling Layer 3 doc when active.
