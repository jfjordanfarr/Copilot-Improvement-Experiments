# Link-Aware Diagnostics

Link-Aware Diagnostics is a VS Code extension coupled with a language server that surfaces cross-file ripple effects whenever code or documentation changes. The goal is to answer: **“What other files will this change impact?”** The workspace contains three npm packages:

- `packages/extension`: VS Code client, onboarding UI, diagnostics tree view, and consent workflows.
- `packages/server`: Language server, knowledge-feed ingestion, ripple analysis, and diagnostics publication.
- `packages/shared`: Domain contracts, graph store wrapper, inference orchestration, and telemetry primitives.

## Prerequisites
- Node.js 22.x (see `.nvmrc`) and npm 10+
- VS Code 1.91+ with access to extension development (Insiders recommended for multi-window runs)
- Optional: local LLM runtime (for example, Ollama at `http://localhost:11434`) to power on-device analysis

## Getting Started
1. Install dependencies:
   ```powershell
   npm install
   ```
2. Build the packages (regenerates TypeScript output for server + extension):
   ```powershell
   npm run build
   ```
3. Open the repository in VS Code and launch the `Launch Extension` configuration. This starts the language server inside an Extension Development Host.

## Consent & Provider Selection
Diagnostics are gated on first run to ensure teams opt into AI features explicitly. You will see the **Select LLM Provider** onboarding modal:

- Choose `local-only` for deterministic tests and air-gapped environments. The system relies on heuristics, workspace evidence, and static knowledge feeds.
- Choose a connected provider only after completing the necessary consent and data-governance reviews for your organization.
- Select `disabled` to suppress AI-backed analysis entirely; heuristics and knowledge feeds still run.

Until a decision is made, diagnostics remain disabled and the client polls the `linkDiagnostics/feedsReady` endpoint. Fallback inference keeps integration tests deterministic by seeding relationships from workspace JSON fixtures.

## Configuration Overview
Settings can be managed from VS Code (`Settings → Extensions → Link-Aware Diagnostics`) or directly via JSON. Key options:

| Setting | Default | Notes |
| --- | --- | --- |
| `linkAwareDiagnostics.llmProviderMode` | `prompt` | Consent gate. Switch to `local-only` or `disabled` to skip AI calls. |
| `linkAwareDiagnostics.enableDiagnostics` | `false` until onboarding completes | Flips to `true` after consent. Toggle off for read-only audit sessions. |
| `linkAwareDiagnostics.noiseSuppression.level` | `medium` | Filters lower-confidence ripple edges. Use `low` to see every hop. |
| `linkAwareDiagnostics.debounce.ms` | `1000` | Batching window for change events. Increase for large refactors, decrease for rapid feedback. |
| `linkAwareDiagnostics.storagePath` | Workspace global storage | Location of the SQLite graph, overrides, and acknowledgement ledger. Point at a repo-local path if you want portable caches. |
| `linkAwareDiagnostics.experimental.feeds` | `[]` | Optional quick-start feed descriptors for static or streaming knowledge sources. |

When files are deleted or moved, the client raises a rebind prompt (`linkDiagnostics/maintenance/rebindRequired`). Accepting the prompt clears stale graph nodes, replays configured knowledge feeds, and keeps acknowledgement history intact. You can re-open the workflow later via the command palette (`Link Diagnostics: Rebind Workspace`).

## Development Commands
| Command | Purpose |
| --- | --- |
| `npm run lint` | ESLint across all packages (TypeScript Project Service enabled). |
| `npm run test:unit` | Vitest suite with coverage. Automatically rebuilds `better-sqlite3` for Node (respects `SKIP_BETTER_SQLITE3_REBUILD=1`). |
| `npm run test:integration` | VS Code integration harness. Always rebuilds `better-sqlite3` for the current Electron runtime and exercises all user stories. |
| `npm run verify` | End-to-end gate: lint → force Node rebuild → unit tests → integration tests. This is the script CI and pre-commit hooks should use. |
| `npm run ci-check` | Alias for `npm run verify` to simplify CI configuration. |

### Better-SQLite3 rebuild hints
- The `rebuild:better-sqlite3:force` script installs a matching native binary for the current Node version.
- Integration tests ignore `SKIP_NATIVE_REBUILD` to guarantee an Electron-compatible build, preventing ABI mismatches between Node and Electron runtimes.

## Documentation
- Quickstart, architecture notes, and knowledge-feed schema live in `specs/001-link-aware-diagnostics/`.
- Long-term MDMD documentation is stored under `.mdmd/` for vision, requirements, architecture, and implementation layering.

## Contributing Workflow
1. Create changes in a clean workspace.
2. Run `npm run verify` locally before committing. The verify script ensures the correct native binaries are in place.
3. Commit once lint, unit tests, and integration suites are green.

For additional context or troubleshooting steps, see the daily summaries inside `AI-Agent-Workspace/ChatHistory/`.
