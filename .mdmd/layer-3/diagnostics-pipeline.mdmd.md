# Diagnostics Pipeline Architecture

## Metadata
- Layer: 3
- Component IDs: COMP-001

## Components

### COMP-001 Diagnostics Pipeline
Supports FR-LD5, FR-LD7, and SC-LD4 by consuming Live Documentation projections, correlating regeneration timestamps with workspace changes, and emitting actionable diagnostics across code and documentation.

## Responsibilities

### Change Intake
- Watch the workspace for save, rename, and delete events via `ArtifactWatcher` and extension-side maintenance code.
- Classify artifacts and, when the change targets a tracked Live Doc owner, enqueue a regeneration request for the generator service before diagnostics fire.
- Load Live Doc metadata (authored hash, `generatedAt`, provenance) so diagnostics can reference stale or missing regeneration runs.

### Ripple Analysis
- Persist change events through `changeProcessor` and orchestrate `RippleAnalyzer` to calculate dependency impacts with depth, relationship kind, confidence, and noise budgets sourced from Live Doc Dependencies.
- Maintain deterministic URI normalisation (`normalizeFileUri`) so graph entries stay canonical across machines and align with Live Doc source paths.
- Request Live Doc Graph projections for impacted files to enrich diagnostics with dependency counts and evidence summaries.

### Diagnostic Publication
- Publish `doc-drift` and `code-ripple` diagnostics via server publishers while respecting hysteresis, batching, and acknowledgement suppression budgets.
- Attach Live Doc hyperlinks, `generatedAt` timestamps, and Observed Evidence snapshots to every diagnostic payload (UI + CLI parity).
- Surface ripple metadata, quick actions, regeneration diff previews, and acknowledgement state to the VS Code client through `docDiagnosticProvider` and related extension commands.

## Interfaces

### Inbound Interfaces
- Language client change queue (`QueuedChange`) with debounce guarantees.
- Live Doc Generator notifications signalling regeneration success/failure for affected artifacts.
- Knowledge feed ingestion contracts and LLM fallback orchestrators for inferred edges.

### Outbound Interfaces
- Diagnostic publication APIs (`publishDocDiagnostics`, `publishCodeDiagnostics`) with acknowledgement (`AcknowledgementService`) and outstanding-diagnostic summaries (`listOutstandingDiagnostics`).
- Live Doc CLI providers (`scripts/live-docs/inspect.ts`) consuming the same payloads surfaced in the UI to maintain parity.
- Workspace maintenance hooks (`removeOrphans`) and Problems/hover UX registered in the extension.

## Linked Implementations

### IMP-101 docDiagnosticProvider
Renders diagnostic metadata and quick actions in the extension. [Extension Diagnostic Provider](../../.mdmd/layer-4/packages/extension/src/diagnostics/docDiagnosticProvider.ts.mdmd.md)

### IMP-102 publishDocDiagnostics
Emits document diagnostics with hysteresis and acknowledgement budgets. [Server Diagnostics Publisher](../../.mdmd/layer-4/packages/server/src/features/diagnostics/publishDocDiagnostics.ts.mdmd.md)

### IMP-103 changeProcessor
Persists change events and orchestrates ripple analysis. [Change Processor Runtime](../../.mdmd/layer-4/packages/server/src/runtime/changeProcessor.ts.mdmd.md)

### IMP-104 publishCodeDiagnostics
Produces code-ripple diagnostics with batching and noise suppression. [Code Diagnostics Publisher](../../.mdmd/layer-4/packages/server/src/features/diagnostics/publishCodeDiagnostics.ts.mdmd.md)

### IMP-105 acknowledgementService
Maintains acknowledgement state and suppression lookups. [Acknowledgement Service](../../.mdmd/layer-4/packages/server/src/features/diagnostics/acknowledgementService.ts.mdmd.md)

### IMP-106 listOutstandingDiagnostics
Summarises unresolved diagnostics for CLI and UI surfaces. [Outstanding Diagnostics](../../.mdmd/layer-4/packages/server/src/features/diagnostics/listOutstandingDiagnostics.ts.mdmd.md)

### IMP-116 artifactWatcher
Classifies workspace changes and enriches inference seeds ahead of ripple analysis. [Artifact Watcher](../../.mdmd/layer-4/packages/server/src/features/watchers/artifactWatcher.ts.mdmd.md)

### IMP-117 rippleAnalyzer
Generates relationship hints that communicate downstream impact for diagnostics surfaces. [Ripple Analyzer](../../.mdmd/layer-4/packages/server/src/features/knowledge/rippleAnalyzer.ts.mdmd.md)

## Evidence
- Unit coverage: `publishDocDiagnostics.test.ts`, `acknowledgementService.test.ts`, `listOutstandingDiagnostics.test.ts`, `artifactWatcher.test.ts`, `docDiagnosticProvider.test.ts`, `rippleAnalyzer.test.ts`.
- Integration coverage: US1–US5 suites exercise writer, developer, rename, and template ripple flows.
- Safe-to-commit pipeline: `npm run verify` and `npm run safe:commit` run the diagnostics stack before landing changes.
- Pending additions: `tests/integration/live-docs/generation.test.ts` and `inspect-cli.test.ts` ensure diagnostics and CLI surfaces render identical Live Doc metadata.

## Operational Notes
- `RuntimeSettings.noiseSuppression` controls hysteresis window, max diagnostics per batch, and suppression budgets.
- Diagnostics remain workspace-local; `linkAwareDiagnostics.llmProviderMode` must be configured before publishing ripple insights.
- Upcoming work (T05x) expands knowledge-feed ingestion; document acknowledgement UX will be captured in a sibling Layer 3 doc when active.
