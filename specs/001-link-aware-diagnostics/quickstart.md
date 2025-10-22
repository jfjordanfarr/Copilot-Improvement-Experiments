# Quickstart

## Prerequisites
- VS Code 1.91 or later with access to chat features.
- Node.js 20.x and npm.
- SQLite 3 (bundled with Node via `better-sqlite3`; no external server needed).
- Optional: Local LLM runtime (Ollama on `http://localhost:11434`) for on-device reasoning.

## Setup
1. Clone the repository and install dependencies:
   ```powershell
   git clone <repo-url>
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
- On first launch, the extension opens the “Select LLM Provider” onboarding. Diagnostics remain disabled until you choose a provider or explicitly select the “local-only”/“disabled” option.
- Link inference runs automatically using heuristic/LLM analysis and augments with active language-server signals (definitions, references, diagnostics) plus any configured knowledge-graph feeds. Override or pin relationships only when needed using the “Link Diagnostics: Override Link” command; overrides persist in the workspace cache, take precedence over future inference passes until you remove them, and contribute provenance for audit trails.
- Configure knowledge-graph feeds per workspace: import static KnowledgeSnapshots on-demand when you want a frozen baseline, or register streaming feeds (e.g., GitLab Knowledge Graph webhooks) for continuous updates. Streaming feeds automatically resume after transient outages by replaying missed deltas, while snapshots remain active until a newer payload passes validation.
- When external feeds fail validation or become unreachable, the extension surfaces a warning diagnostic, pauses ingestion for that source, and continues operating on locally inferred data so diagnostics remain trustworthy.
- In workspaces without language-server coverage, expect the first inference pass to take longer while the fallback pipeline builds context; results remain rebuildable and will speed up once indexed data is available.
- Key settings:
   - `linkAwareDiagnostics.llmProviderMode`: `prompt` (default – requires explicit choice), `local-only`, or `disabled`.
   - `linkAwareDiagnostics.noiseSuppression.level`: `low`, `medium`, `high`.
   - `linkAwareDiagnostics.storagePath`: override default location for the SQLite cache if you need to relocate it.
   - `linkAwareDiagnostics.debounce.ms`: adjust the change batching window (default 1000).

## Typical Workflow
1. **Let inference run**: Open the workspace; the language server rebuilds the link graph from indexed symbols and diagnostics. Inspect inferred relationships via the Problems panel or the upcoming diagnostics view.
2. **Edit content**: When you save a linked file, the language server records a `ChangeEvent`, updates the graph, and publishes diagnostics to related artifacts.
3. **Review alerts**: Diagnostics appear in the Problems panel and each affected document. Quick actions let you jump to linked files or open the consolidated panel. Broken-link `doc-drift` diagnostics intentionally invert `triggerUri`/`targetUri` so the missing resource is treated as the trigger and the referencing document receives the warning—keep that in mind when navigating.
4. **Acknowledge**: Resolve or acknowledge items directly from the diagnostic code action or from the “Link Diagnostics” view. The system records an `AcknowledgementAction` and clears the alert until a new change occurs.
5. **Optional LLM assist**: Trigger “Link Diagnostics: Analyze Impact with AI” to request a deeper reasoning pass using the configured model. This action is available only after a provider is selected and will respect the `llmProviderMode` guard. Results attach to the diagnostic’s `llmAssessment` field and display in the side panel.

## Testing
- Run unit tests (shared modules): `npm run test:unit`
- Run extension integration tests: `npm run test:integration`
- Contract smoke tests for custom LSP messages: `npm run test:contracts`

## CI Hooks
- Headless validation executes the language server in `ci-check` mode, loading the project, rebuilding the graph, and failing the build on unresolved diagnostics. Configure via `npm run ci-check`.
