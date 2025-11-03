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

Additional guardrails:
- Diagnostics stay disabled until onboarding completes _and_ `linkAwareDiagnostics.enableDiagnostics` flips to `true`. You can turn the setting off later for read-only audits without uninstalling the extension.
- The `linkDiagnostics.analyzeWithAI` command checks `llmProviderMode` on every invocation. When the value is `disabled` or consent has not been granted, the command exits before contacting a model.
- In `local-only` mode the extension only talks to providers hosted on the local machine (for example Ollama); the server still performs heuristic inference so tests remain stable.
- No workspace content is uploaded when diagnostics are disabled or the provider mode is `disabled`; the language server limits itself to the SQLite cache on disk.

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

### Workspace guardrails and scoping
- **Per-folder settings**: Multi-root workspaces let you tune diagnostics per folder. Add `.vscode/settings.json` inside any folder to override values such as `linkAwareDiagnostics.noiseSuppression.level` or to set `linkAwareDiagnostics.enableDiagnostics` to `false` for generated sources.
- **Watcher exclusions**: Respect `files.watcherExclude` and `files.exclude` to keep the file watcher from reporting churn in build artefacts. Example:
   ```json
   {
      "linkAwareDiagnostics.enableDiagnostics": false,
      "files.watcherExclude": {
         "**/dist/**": true,
         "**/*.generated.*": true
      }
   }
   ```
- **Selective knowledge feeds**: Populate `data/knowledge-feeds/*.json` with curated links when you want deterministic relationships for a subset of folders. The language server treats those fixtures as high-confidence evidence during the first inference pass.
- **Runtime overrides**: The CLI entry `npm run ci-check` runs `safe-to-commit` without a git summary, making it suitable for CI pipelines that should enforce the same guardrails before publishing artifacts.

## Development Commands
| Command | Purpose |
| --- | --- |
| `npm run lint` | ESLint across all packages (TypeScript Project Service enabled). |
| `npm run test:unit` | Vitest suite with coverage. Automatically rebuilds `better-sqlite3` for Node (respects `SKIP_BETTER_SQLITE3_REBUILD=1`). |
| `npm run test:integration` | VS Code integration harness. Always rebuilds `better-sqlite3` for the current Electron runtime and exercises all user stories. |
| `npm run verify` | End-to-end gate: lint → force Node rebuild → unit tests → integration tests → documentation link enforcement. Append `-- --report` to emit `reports/test-report.<mode>.md`; use `--mode all` to refresh both self-similarity and AST artifacts in one run. |
| `npm run docs:links:enforce` | Enforces `// Live Documentation: …` comments (or configured labels) in commentable code files and validates that documentation sections link back. Use `-- --fix` to autofix. |
| `npm run safe:commit` | Composite gate: verify → graph snapshot → graph audit → fixture verification → documentation link enforcement → SlopCop lint (markdown, assets, symbols) → git status summary. Pass `--skip-git-status` in CI. Add `--benchmarks` to exercise both benchmark modes and refresh the per-mode Markdown reports (enabled automatically unless `--no-report` is provided). |
| `npm run ci-check` | Runs the safe-to-commit pipeline in CI-friendly mode (`--skip-git-status`). |
| `npm run slopcop:markdown` | Markdown/MDMD link audit (use `-- --json` for machine output). |
| `npm run slopcop:assets` | HTML/CSS asset reference audit (use `-- --json` for machine output). |
| `npm run slopcop:symbols` | Markdown/MDMD symbol audit (duplicate headings, missing anchors); requires `symbols.enabled` opt-in. |

### SlopCop configuration
- All lint passes read [`slopcop.config.json`](./slopcop.config.json). Top-level `ignoreGlobs` apply to every check, while sections such as `markdown`, `assets`, and `symbols` support per-pass `includeGlobs`, `ignoreGlobs`, and regex-based `ignoreTargets`.
- `assets.rootDirectories` maps absolute workspace paths (for example `/images/logo.png`) to alternate roots such as `public/` or `static/` so projects can mirror bundler behaviour without rewriting source assets.
- The default config ships with a hashed-filename ignore (`\.[a-f0-9]{8,}\.[a-z0-9]+$`) to suppress generated artefacts; adjust or remove it as needed for your build pipeline.
- `symbols.enabled` gates the Markdown anchor audit. Leave it `false` while triaging existing docs; enable per workspace when you're ready to enforce anchor hygiene.

### Better-SQLite3 rebuild hints
- The `rebuild:better-sqlite3:force` script installs a matching native binary for the current Node version.
- Integration tests ignore `SKIP_NATIVE_REBUILD` to guarantee an Electron-compatible build, preventing ABI mismatches between Node and Electron runtimes.

## Documentation
- Quickstart, architecture notes, and knowledge-feed schema live in `specs/001-link-aware-diagnostics/`.
- Long-term MDMD documentation is stored under `.mdmd/` for vision, requirements, architecture, and implementation layering.

### Benchmark Reports
- Mode-specific Markdown summaries live in `reports/test-report.self-similarity.md` and `reports/test-report.ast.md`; these files should change whenever benchmarks run with reporting enabled.
- Structured JSON sources are versioned under `reports/benchmarks/<mode>/`.
- Verbose false-positive/negative dumps remain untracked in `AI-Agent-Workspace/tmp/benchmarks/<suite>/<mode>/` for local inspection.
- The legacy `reports/test-report.md` only documents the routing above—do not replace it with suite output.

## Contributing Workflow
1. Create changes in a clean workspace.
2. Run `npm run verify` locally before committing. The verify script ensures the correct native binaries are in place.
3. Commit once lint, unit tests, and integration suites are green.

For additional context or troubleshooting steps, see the daily summaries inside `AI-Agent-Workspace/ChatHistory/`.
