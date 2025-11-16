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

### Authoring Loop Commands
- Present Live Documentation preview/apply flows (`liveDocumentation.previewDocstring`, `liveDocumentation.applyDocstring`) that surface diffs, respect feature flags, and forward audit metadata to the language server.
- Trigger scaffolding commands (`liveDocumentation.scaffoldFromDoc`) that emit scratch drafts linked back to the originating Live Documentation file without modifying tracked sources.
- Display toast and status notifications summarising round-trip outcomes (applied, skipped, failed) so authors can react immediately.

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
Transforms diagnostics into Problems entries, hovers, and quick actions. Refer to the generated Live Doc at `.mdmd/layer-4/packages/extension/src/diagnostics/docDiagnosticProvider.ts.mdmd.mdmd.md` when deeper detail is required.

### IMP-107 dependencyQuickPick
Bridges the inspection request into a Quick Pick UX. See `.mdmd/layer-4/packages/extension/src/diagnostics/dependencyQuickPick.ts.mdmd.mdmd.md` for the implementation surface.

### IMP-108 analyzeWithAI Command
Collects LLM assessments for outstanding diagnostics. The command’s Live Doc lives at `.mdmd/layer-4/packages/extension/src/commands/analyzeWithAI.ts.mdmd.mdmd.md`.

### IMP-109 fileMaintenance Watcher
Debounces rename/delete events and alerts the server. Consult `.mdmd/layer-4/packages/extension/src/watchers/fileMaintenance.ts.mdmd.mdmd.md` for operational detail once generated.

### IMP-110 symbolBridge Service
Supplies workspace symbols and references to inference pipelines. Implementation intent is captured in `.mdmd/layer-4/packages/extension/src/services/symbolBridge.ts.mdmd.mdmd.md`.

### IMP-111 liveDocsCommands
Registers Live Doc regeneration, inspect, and diff commands. The CLI parity is now expressed through `npm run live-docs:generate` and `npm run live-docs:system`; inspect `.mdmd/layer-4/scripts/live-docs/generate.ts.mdmd.mdmd.md` for the generated view.

### IMP-112 liveDocsAuthoringCommands *(planned)*
Will register preview/apply and scaffolding surfaces for bidirectional authoring once the feature flag enables REQ-G1. Implementation intent will live at `.mdmd/layer-4/packages/extension/src/commands/liveDocsAuthoring.ts.mdmd.mdmd.md` when generated.

### IMP-302 graphCoverageAudit CLI
Headless audit ensuring code/docs linkage. Operational detail is sourced from `.mdmd/layer-4/scripts/graph-tools/audit-doc-coverage.ts.mdmd.mdmd.md`.

### IMP-303 inspectSymbolNeighbors CLI
CLI equivalent of dependency explorer. Refer to `.mdmd/layer-4/scripts/graph-tools/inspect-symbol.ts.mdmd.mdmd.md` for the materialised view.

### IMP-304 graphSnapshot CLI
Deterministic rebuild of the workspace graph cache. See `.mdmd/layer-4/scripts/graph-tools/snapshot-workspace.ts.mdmd.mdmd.md`.

### IMP-305 liveDocsGenerateCli
Command palette + CLI entry points for regeneration. The generator surface is documented at `.mdmd/layer-4/scripts/live-docs/generate.ts.mdmd.mdmd.md`.

### IMP-306 liveDocsInspectCli
Headless inspection of Live Doc metadata mirroring the UI. Legacy references now point to on-demand System outputs (`npm run live-docs:system`); the dedicated inspect CLI will return once its materialised view pipeline stabilises.

## Evidence
- Extension unit tests: `docDiagnosticProvider.test.ts`, `dependencyQuickPick.test.ts`, `analyzeWithAI.test.ts`, `fileMaintenance.test.ts` (pending rename once watcher tests land).
- CLI integration suites under `tests/integration/graph-tools` validate audit and inspection parity.
- Planned Live Doc suites under `tests/integration/live-docs` verify regeneration commands and CLI parity.
- `npm run graph:audit`, `npm run graph:snapshot`, `npm run live-docs:generate -- --dry-run`, and `npm run safe:commit` capture live adoption telemetry for these surfaces.

## Operational Notes
- Quick Pick controller surfaces schema failures via `showErrorMessage`; analyze command posts toasts when assessments store or fail.
- Future acknowledgement UX may feed dependency explorer annotations; caching strategies remain open design questions.
