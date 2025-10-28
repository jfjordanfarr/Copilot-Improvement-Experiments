# Quickstart

## Prerequisites
- VS Code 1.91 or later with access to chat features.
- Node.js 22.x and npm.
- SQLite 3 (bundled with Node via `better-sqlite3`; no external server needed).
- Optional: Local LLM runtime (Ollama on `http://localhost:11434`) for on-device reasoning.

## Setup
1. Clone the repository and install dependencies:
   ```powershell
   git clone https://github.com/jfjordanfarr/Copilot-Improvement-Experiments.git
   cd Copilot-Improvement-Experiments
   npm install
   ```
2. Build the packages:
   ```powershell
   npm run build
   ```
3. Open the workspace in VS Code and run the `Launch Extension` configuration to start the extension + language server in the Extension Development Host.
4. When prompted, complete the “Select LLM Provider” onboarding to enable diagnostics (choose a local provider or opt to keep AI features disabled for now).

## Configuration
- On first launch, complete the “Select LLM Provider” onboarding. Diagnostics remain disabled until you explicitly choose a provider or opt into `local-only`/`disabled` modes. While waiting, the client soft-waits for feed health but still falls back to workspace-derived evidence so tests stay deterministic.
- Link inference blends heuristic analysis, language-server signals, and knowledge-feed content. Use “Link Diagnostics: Override Link” sparingly to pin relationships; overrides persist in SQLite and inform traceability metadata until revoked.
- Configure knowledge feeds per workspace. Static snapshots provide frozen baselines; streaming feeds resume automatically after outages by replaying missed deltas. Validation failures emit info diagnostics, mark feeds unhealthy, and keep inference on local data until the stream recovers.
- In language-server–absent workspaces, expect the first inference pass to rebuild slowly while fallback inference seeds context. Subsequent runs reuse cached evidence so diagnostics rehydrate quickly.
### Settings reference
| Setting key | Default | Description |
| --- | --- | --- |
| `linkAwareDiagnostics.llmProviderMode` | `prompt` | Consent gate for AI features. Choose `local-only` for deterministic tests or `disabled` to operate strictly on heuristics. |
| `linkAwareDiagnostics.enableDiagnostics` | `false` until onboarding completes | Master toggle that becomes `true` after provider consent. Flip it off for read-only audits without tearing down the graph. |
| `linkAwareDiagnostics.noiseSuppression.level` | `medium` | Tunes diagnostic filtering: `low` emits every ripple, `medium` balances churn, `high` suppresses lower-confidence hops. |
| `linkAwareDiagnostics.noiseSuppression.minConfidence` | n/a | Optional floor (0-1) for ripple confidence. Raise it when the graph feels noisy; leave unset to use per-relationship defaults. |
| `linkAwareDiagnostics.noiseSuppression.maxDepth` | n/a | Clamp ripple propagation to the specified hop count. Useful for large repos where third-degree signals overwhelm the Problems panel. |
| `linkAwareDiagnostics.noiseSuppression.maxPerChange` | n/a | Hard limit on how many diagnostics a single change event can emit before throttling kicks in. |
| `linkAwareDiagnostics.noiseSuppression.maxPerArtifact` | n/a | Prevents the same dependent artifact from surfacing more than N diagnostics per change. |
| `linkAwareDiagnostics.debounce.ms` | `1000` | Batching window for change events. Increase when editing large files to reduce churn; decrease for eager feedback. |
| `linkAwareDiagnostics.storagePath` | per-workspace global storage | Disk location for the SQLite knowledge store and acknowledgement ledger. Point to a repo-local path if you need portable caches. |
| `linkAwareDiagnostics.experimental.feeds` | `[]` | Optional quick-start list of static or streaming feed descriptors. Useful for CI fixtures and air-gapped environments. |

### Scoping diagnostics by folder
Use VS Code’s multi-root and per-folder settings to focus diagnostics on the parts of a monorepo that matter.

1. Create a workspace file (for example `link-aware.code-workspace`) that lists each folder you want to analyze:
    ```json
    {
       "folders": [
          { "path": "." },
          { "path": "packages/extension", "name": "extension" },
          { "path": "docs", "name": "docs" }
       ]
    }
    ```
    Open this workspace in VS Code; every folder gets its own `.vscode/settings.json` scope.
2. Inside folders that should emit fewer diagnostics, add `.vscode/settings.json` with stricter filters:
    ```json
    {
       "linkAwareDiagnostics.noiseSuppression.level": "high",
       "linkAwareDiagnostics.noiseSuppression.maxPerChange": 2,
       "linkAwareDiagnostics.enableDiagnostics": true
    }
    ```
    The parent workspace can use looser settings (for example `"level": "low"`) so implementation code still emits full ripple traces.
3. To disable diagnostics entirely for generated artifacts, place a `.vscode/settings.json` at the folder root with:
    ```json
    {
       "linkAwareDiagnostics.enableDiagnostics": false,
       "files.watcherExclude": {
          "**/*.generated.*": true,
          "**/dist/**": true
       }
    }
    ```
    The extension’s file-system watcher respects `files.watcherExclude`, so the server never queues changes from these paths.
4. Combine folder-level settings with `files.exclude` when you want the IDE to hide the same directories, keeping the explorer in sync with diagnostic coverage.

### Pre-seeding or restricting targets
- Place curated link fixtures under `data/knowledge-feeds/*.json` to bootstrap relationships for specific paths before the first inference pass. Only artifacts referenced in these files will be seeded, which is helpful for narrow doc-only worktrees.
- When pairing selective feeds with the folder-level settings above, run `npm run graph:snapshot -- --workspace <path>` to confirm the graph contains only the expected artifacts before enabling diagnostics for the whole workspace.
- You can revert to default coverage at any time by deleting the folder-specific settings files and reloading the window (`Developer: Reload Window`).

### Maintenance and rebind workflow
1. The file-maintenance watcher raises `linkDiagnostics/maintenance/rebindRequired` whenever a linked artifact is deleted or renamed. The client surfaces a consent-aware toast summarizing impacted artifacts and offering **Rebind links** or **Dismiss**.
2. Choose **Rebind links** to launch the override flow. If the rename carried workspace metadata, the prompt offers to reuse the detected `newUri`; otherwise it opens a file picker so you can point the graph at the successor artifact.
3. The override command replays the affected relationships, preserving acknowledgement history and backfilling cached evidence. Progress updates report how many links were restored, and diagnostics resolve as each hop is rebound.
4. Dismissing the prompt leaves drift diagnostics active so teams can manually curate replacements later. You can reopen the wizard by running `Link Diagnostics: Override Link` from the Command Palette; pass the replacement path to bulk-rebind without waiting for another notification.
5. For catastrophic cache drift, run `Link Diagnostics: Clear All Diagnostics` first, then execute the rebind prompt. When feeds and workspace providers report `healthy`, the Problems panel repopulates using the rebuilt graph.

## Typical Workflow
1. **Let inference run**: Open the workspace; the language server rebuilds the link graph from indexed symbols and diagnostics. Inspect inferred relationships via the Problems panel or the upcoming diagnostics view.
2. **Edit content**: When you save a linked file, the language server records a `ChangeEvent`, updates the graph, and publishes diagnostics to related artifacts.
3. **Review alerts**: Diagnostics appear in the Problems panel and each affected document. Quick actions let you jump to linked files or open the consolidated panel. Broken-link `doc-drift` diagnostics intentionally invert `triggerUri`/`targetUri` so the missing resource is treated as the trigger and the referencing document receives the warning—keep that in mind when navigating.
4. **Acknowledge**: Resolve or acknowledge items directly from the diagnostic code action or from the “Link Diagnostics” view. The system records an `AcknowledgementAction` and clears the alert until a new change occurs.
5. **Optional LLM assist**: Trigger “Link Diagnostics: Analyze Impact with AI” to request a deeper reasoning pass using the configured model. This action is available only after a provider is selected and will respect the `llmProviderMode` guard. Results attach to the diagnostic’s `llmAssessment` field and display in the side panel.
6. **Dogfood the graph**: Use “Link Diagnostics: Inspect Symbol Neighbors” or the companion CLI to explore first- and second-degree relationships before changing a file. Run `npm run graph:inspect -- --file path/to/file.ts` (after building the packages) to query the same traversal from the terminal; add `--json` for machine-readable output or `--max-depth`/`--kinds` to scope the results. Pair that with `npm run graph:audit -- --workspace .` to surface code artifacts missing Layer 4 documentation and MDMD docs that no longer point at code, and regenerate the deterministic cache via `npm run graph:snapshot` whenever the workspace topology shifts.

## Testing
- Run unit tests (shared modules): `npm run test:unit`
- Run extension integration tests: `npm run test:integration`
- Contract smoke tests for custom LSP messages: `npm run test:contracts`

## CI Hooks
- Headless validation executes the full verification pipeline (`npm run verify`), which lint-checks the repo, rebuilds SQLite binaries for Node and Electron, runs unit tests with coverage, and passes through the VS Code integration harness. Use the convenience alias `npm run ci-check` when wiring CI jobs.

## Implementation Traceability
- [`packages/extension/src/onboarding/providerGate.ts`](../../packages/extension/src/onboarding/providerGate.ts) enforces the consent-driven diagnostics gating described in the setup and configuration sections.
- [`packages/extension/src/diagnostics/docDiagnosticProvider.ts`](../../packages/extension/src/diagnostics/docDiagnosticProvider.ts) powers the Problems panel experience referenced throughout the workflow steps.
- [`packages/server/src/features/diagnostics/acknowledgementService.ts`](../../packages/server/src/features/diagnostics/acknowledgementService.ts) and [`packages/server/src/features/diagnostics/publishCodeDiagnostics.ts`](../../packages/server/src/features/diagnostics/publishCodeDiagnostics.ts) back the acknowledgement and ripple alert flows.
- [`tests/integration/us3/acknowledgeDiagnostics.test.ts`](../../tests/integration/us3/acknowledgeDiagnostics.test.ts) and [`tests/integration/us4/scopeCollision.test.ts`](../../tests/integration/us4/scopeCollision.test.ts) provide end-to-end verification for the workflows called out in this quickstart.
