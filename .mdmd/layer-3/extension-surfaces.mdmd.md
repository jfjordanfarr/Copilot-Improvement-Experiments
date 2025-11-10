# Extension Surfaces Architecture

## Metadata
- Layer: 3
- Component IDs: COMP-002

## Components

### COMP-002 Extension Surfaces
Supports FR-LD5, FR-LD7, and SC-LD4 by delivering the VS Code UX and CLI surfaces that expose Live Documentation diagnostics, regeneration flows, and adoption tooling while mirroring the server-side capabilities.

## Responsibilities

### Activation and Settings Sync
- Bootstrap the extension (`extension.ts`) and ensure diagnostics opt-in flow, runtime configuration propagation, and Live Documentation participation in ripple analysis.
- Forward `liveDocumentation.*` and `linkAwareDiagnostics.*` configuration updates to the language server and record activation telemetry for troubleshooting.

### Diagnostics Experience
- Register `docDiagnosticProvider` to render quick fixes, Live Doc hyperlinks, regeneration timestamps, and acknowledgement affordances for `doc-drift` and `code-ripple` diagnostics.
- Provide Analyze with AI command surfaces so leads can capture LLM-authored assessments directly inside the diagnostics tree.
- Surface Live Doc regeneration commands (`Live Docs: Regenerate File`, `Live Docs: Open Mirror`) and diff previews alongside diagnostics.

### Dependency Exploration and Maintenance
- Offer `linkDiagnostics.inspectDependencies` Quick Pick views backed by the `INSPECT_DEPENDENCIES_REQUEST` LSP contract enriched with Live Doc dependency metadata.
- Maintain file rename/delete awareness via `fileMaintenance.ts`, raising orphan diagnostics, regeneration prompts, and rebind flows in partnership with the server.
- Inject Live Doc summary panels (authored header + Observed Evidence) into dependency explorers and status bar surfaces.

### Headless Tooling Support
- Ship CLI parity (`graph:inspect`, `graph:audit`, `graph:snapshot`, `live-docs:generate`, `live-docs:inspect`) so automation and shell workflows reuse the same traversal contracts and Live Doc metadata as the extension UI.
- Expose symbol bridge services that harvest workspace symbols and Live Doc metadata for inference seeding.

## Interfaces

### Inbound Interfaces
- VS Code activation pipeline (commands, configuration events, workspace watches).
- LSP notifications and requests: diagnostics, dependency inspection, maintenance prompts, symbol bridge pulls.

### Outbound Interfaces
- Quick Pick controller supplying `InspectDependenciesResult` objects enriched with Live Doc summaries and regeneration shortcuts.
- CLI scripts (`scripts/graph-tools/*.ts`, `scripts/live-docs/*.ts`) invoking shared traversal, regeneration, and inspection APIs for headless environments.

## Linked Implementations

### IMP-101 docDiagnosticProvider
Transforms diagnostics into Problems entries, hovers, and quick actions. [Extension Diagnostic Provider](/.mdmd/layer-4/extension-diagnostics/docDiagnosticProvider.mdmd.md)

### IMP-107 dependencyQuickPick
Bridges the inspection request into a Quick Pick UX. [Dependency Quick Pick](/.mdmd/layer-4/extension-diagnostics/dependencyQuickPick.mdmd.md)

### IMP-108 analyzeWithAI Command
Collects LLM assessments for outstanding diagnostics. [Analyze With AI Command](/.mdmd/layer-4/extension-commands/analyzeWithAI.mdmd.md)

### IMP-109 fileMaintenance Watcher
Debounces rename/delete events and alerts the server. [File Maintenance Watcher](/.mdmd/layer-4/watchers/fileMaintenanceWatcher.mdmd.md)

### IMP-110 symbolBridge Service
Supplies workspace symbols and references to inference pipelines. [Symbol Bridge Service](/.mdmd/layer-4/extension-services/symbolBridge.mdmd.md)

### IMP-111 liveDocsCommands
Registers Live Doc regeneration, inspect, and diff commands. [Live Docs Commands](/.mdmd/layer-4/extension-commands/liveDocsCommands.mdmd.md)

### IMP-302 graphCoverageAudit CLI
Headless audit ensuring code/docs linkage. [Graph Coverage Audit](/.mdmd/layer-4/tooling/graphCoverageAudit.mdmd.md)

### IMP-303 inspectSymbolNeighbors CLI
CLI equivalent of dependency explorer. [Inspect Symbol Neighbors CLI](/.mdmd/layer-4/tooling/inspectSymbolNeighborsCli.mdmd.md)

### IMP-304 graphSnapshot CLI
Deterministic rebuild of the workspace graph cache. [Workspace Graph Snapshot](/.mdmd/layer-4/tooling/workspaceGraphSnapshot.mdmd.md)

### IMP-305 liveDocsGenerateCli
Command palette + CLI entry points for regeneration. [Live Docs Generate CLI](/.mdmd/layer-4/live-docs/generateCli.mdmd.md)

### IMP-306 liveDocsInspectCli
Headless inspection of Live Doc metadata mirroring the UI. [Live Docs Inspect CLI](/.mdmd/layer-4/live-docs/inspectCli.mdmd.md)

## Evidence
- Extension unit tests: `docDiagnosticProvider.test.ts`, `dependencyQuickPick.test.ts`, `analyzeWithAI.test.ts`, `fileMaintenance.test.ts` (pending rename once watcher tests land).
- CLI integration suites under `tests/integration/graph-tools` validate audit and inspection parity.
- Planned Live Doc suites under `tests/integration/live-docs` verify regeneration commands and CLI parity.
- `npm run graph:audit`, `npm run graph:snapshot`, `npm run live-docs:generate -- --dry-run`, and `npm run safe:commit` capture live adoption telemetry for these surfaces.

## Operational Notes
- Quick Pick controller surfaces schema failures via `showErrorMessage`; analyze command posts toasts when assessments store or fail.
- Future acknowledgement UX may feed dependency explorer annotations; caching strategies remain open design questions.
