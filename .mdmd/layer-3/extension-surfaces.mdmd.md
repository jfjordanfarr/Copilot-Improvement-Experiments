# Extension Surfaces Architecture (Layer 3)

## Purpose
Outline the extension-side UX surfaces that expose link-aware diagnostics: activation bootstrap, diagnostics providers, dependency inspectors, and file maintenance watchers. This layer coordinates with the language server pipeline to keep VS Code users informed about ripple impacts and documentation drift.

## Key Components
- **VS Code Extension Bootstrap** (`packages/extension/src/extension.ts`) – wires activation, commands, diagnostics providers, and settings sync. Ensures YAML + markdown documents participate in ripple analysis and that provider consent gates diagnostics.
- **DocDiagnosticProvider** (`packages/extension/src/diagnostics/docDiagnosticProvider.ts`) – registers quick fixes and ripple detail explorers for `doc-drift` and `code-ripple` diagnostics emitted by the server.
- **Dependency Quick Pick** (`packages/extension/src/diagnostics/dependencyQuickPick.ts`) – bridges the `INSPECT_DEPENDENCIES_REQUEST` LSP call into a Quick Pick navigation surface so engineers can explore dependents on demand.
- **File Maintenance Watcher** (`packages/extension/src/watchers/fileMaintenance.ts`) – observes renames/deletes and notifies the server to trigger orphan cleanup and rebind prompts.
- **Symbol Bridge Service** (`packages/extension/src/services/symbolBridge.ts`) – harvests workspace symbols and references to seed graph inference before the server processes changes.
- **Symbol Neighbors CLI** (`scripts/graph-tools/inspect-symbol.ts`) – headless dogfooding entry that invokes the same traversal as the quick pick, enabling CI jobs and shell sessions to query graph neighborhoods without launching VS Code.
- **Graph Coverage Audit** (`scripts/graph-tools/audit-doc-coverage.ts`) – automation-facing audit that flags code artifacts missing `documents` links and MDMD implementations without code neighbors, giving maintainers a snapshot of documentation drift.
- **Workspace Graph Snapshot** (`scripts/graph-tools/snapshot-workspace.ts`) – deterministic graph rebuild used to refresh the SQLite cache and JSON fixtures so headless audits and CLIs always operate on fresh data.

## Interaction Model
1. **Activation** – Bootstrap resolves runtime settings via `ConfigService`, executes provider guard onboarding, and starts the language client.
2. **Diagnostics Flow** – Server pushes `doc-drift`/`code-ripple` diagnostics; provider converts them into quick fixes and ripple detail commands.
3. **Ad-hoc Inspection** – Users invoke `linkDiagnostics.inspectDependencies`, triggering Quick Pick population with graph edges from the server. CLI users can call `npm run graph:inspect` to reach the same traversal for automation or scripted audits.
4. **File Maintenance** – Watcher debounces file renames/deletes and forwards them to the server, which responds with orphan diagnostics and rebind prompts.
5. **Symbol Sync** – Server requests symbol collection; bridge responds with relationship hints to enrich the knowledge graph.

## Data Contracts
- **Diagnostics payload**: `data` object contains `triggerUri`, `targetUri|dependentUri`, `relationshipKind`, `confidence`, `depth`, `path`, `changeEventId`.
- **Dependency inspection**: `InspectDependenciesResult` with `trigger`, `edges`, `summary` validated client-side via zod schema.
- **Maintenance notifications**: `MAINTENANCE_ORPHANS` request carries normalized URIs; server replies with rebind diagnostics.

## Settings & Controls
- The extension respects `linkAwareDiagnostics.*` configuration (provider mode, debounce, noise suppression) and forwards updates to the server.
- Dependency Quick Pick relies on runtime ripple settings (max depth/kinds) derived server-side and reflected in inspection responses.

## Observability Hooks
- Activation logs key milestones (`language client started`, `diagnostics gated`).
- Diagnostic provider shows user-facing toasts for missing metadata or navigation failures.
- Quick pick controller surfaces schema/transport errors via `showErrorMessage`.

## Open Questions
- When acknowledgement UX matures, decide whether Quick Pick should annotate entries with acknowledgement state.
- Explore caching recent inspection results for offline review or diffing after edits.
