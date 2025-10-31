# Extension Surfaces Architecture

## Metadata
- Layer: 3
- Component IDs: COMP-002

## Components

### COMP-002 Extension Surfaces
Supports REQ-001, REQ-020, and REQ-030 by delivering the VS Code UX surfaces that expose diagnostics, ripple intelligence, and adoption tooling while mirroring the server-side capabilities.

## Responsibilities

### Activation and Settings Sync
- Bootstrap the extension (`extension.ts`) and ensure diagnostics opt-in flow, runtime configuration propagation, and YAML/markdown participation in ripple analysis.
- Forward `linkAwareDiagnostics.*` configuration updates to the language server and record activation telemetry for troubleshooting.

### Diagnostics Experience
- Register `docDiagnosticProvider` to render quick fixes, ripple explorers, and acknowledgement affordances for `doc-drift` and `code-ripple` diagnostics.
- Provide Analyze with AI command surfaces so leads can capture LLM-authored assessments directly inside the diagnostics tree.

### Dependency Exploration and Maintenance
- Offer `linkDiagnostics.inspectDependencies` Quick Pick views backed by the `INSPECT_DEPENDENCIES_REQUEST` LSP contract.
- Maintain file rename/delete awareness via `fileMaintenance.ts`, raising orphan diagnostics and rebind prompts in partnership with the server.

### Headless Tooling Support
- Ship CLI parity (`graph:inspect`, `graph:audit`, `graph:snapshot`) so automation and shell workflows reuse the same traversal contracts as the extension UI.
- Expose symbol bridge services that harvest workspace symbols for inference seeding.

## Interfaces

### Inbound Interfaces
- VS Code activation pipeline (commands, configuration events, workspace watches).
- LSP notifications and requests: diagnostics, dependency inspection, maintenance prompts, symbol bridge pulls.

### Outbound Interfaces
- Quick Pick controller supplying `InspectDependenciesResult` objects and summarised narratives.
- CLI scripts (`scripts/graph-tools/*.ts`) invoking shared traversal and audit APIs for headless environments.

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

### IMP-302 graphCoverageAudit CLI
Headless audit ensuring code/docs linkage. [Graph Coverage Audit](/.mdmd/layer-4/tooling/graphCoverageAudit.mdmd.md)

### IMP-303 inspectSymbolNeighbors CLI
CLI equivalent of dependency explorer. [Inspect Symbol Neighbors CLI](/.mdmd/layer-4/tooling/inspectSymbolNeighborsCli.mdmd.md)

### IMP-304 graphSnapshot CLI
Deterministic rebuild of the workspace graph cache. [Workspace Graph Snapshot](/.mdmd/layer-4/tooling/workspaceGraphSnapshot.mdmd.md)

## Evidence
- Extension unit tests: `docDiagnosticProvider.test.ts`, `dependencyQuickPick.test.ts`, `analyzeWithAI.test.ts`, `fileMaintenance.test.ts` (pending rename once watcher tests land).
- CLI integration suites under `tests/integration/graph-tools` validate audit and inspection parity.
- `npm run graph:audit`, `npm run graph:snapshot`, and `npm run safe:commit` capture live adoption telemetry for these surfaces.

## Operational Notes
- Quick Pick controller surfaces schema failures via `showErrorMessage`; analyze command posts toasts when assessments store or fail.
- Future acknowledgement UX may feed dependency explorer annotations; caching strategies remain open design questions.
