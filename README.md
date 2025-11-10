# Live Documentation

Live Documentation is a VS Code extension and CLI suite that mirrors every tracked workspace artifact into deterministic markdown stored under `/.live-documentation/<baseLayer>/` (default `source/`). Each Live Doc contains an authored preamble plus generated sections (`Public Symbols`, `Dependencies`, archetype-specific metadata such as `Observed Evidence`), creating a markdown-as-AST graph that answers: **“What else does this change impact?”**

The workspace contains three npm packages:

- `packages/extension`: VS Code client, commands, diagnostics tree view, and Live Doc UX.
- `packages/server`: Language server, analyzer orchestration, regeneration, coverage bridges, and diagnostics publication.
- `packages/shared`: Domain contracts, schema models, benchmark harnesses, and tooling utilities.

## Prerequisites
- Node.js 22.x (see `.nvmrc`) and npm 10+
- VS Code 1.91+ with extension development tools (Insiders recommended for multi-window runs)
- Optional: local LLM runtime (for example, Ollama at `http://localhost:11434`) once Live Doc enrichers go online

## Getting Started
1. Install dependencies:
   ```powershell
   npm install
   ```
2. Build the packages:
   ```powershell
   npm run build
   ```
3. Launch the extension:
   - Open the repository in VS Code.
   - Run the `Launch Extension` configuration to start the language server inside the Extension Development Host.
4. Stage Live Docs (optional until generator lands):
   ```powershell
   npm run live-docs:generate -- --dry-run
   ```
   When ready, rerun without `--dry-run` to materialise markdown under `/.live-documentation/source/`.

## Configuration Overview
Settings live under `Settings → Extensions → Live Documentation` (or directly in `.vscode/settings.json`). Core options:

| Setting | Default | Notes |
| --- | --- | --- |
| `liveDocumentation.root` | `.live-documentation` | Filesystem root for staged Live Docs; can be repo-relative or external. |
| `liveDocumentation.baseLayer` | `source` | Mirror folder for Layer‑4 (implementation) docs. Additional layers (e.g., `architecture`, `work-items`) can be added later. |
| `liveDocumentation.glob` | `[]` | Glob patterns selecting artefacts to mirror. Honour one Live Doc per source asset. |
| `liveDocumentation.archetypeOverrides` | `{}` | Map path globs to archetypes (`test`, `asset`, etc.). |
| `liveDocumentation.requireRelativeLinks` | `true` | Enforces workspace-relative markdown links for wiki portability. |
| `liveDocumentation.slugDialect` | `github` | Header-slug dialect for generated anchors (supports `github`, `azure-devops`, `gitlab`). |
| `liveDocumentation.enableDocstringBridge` | `false` | Opt-in docstring drift reconciliation once adapters stabilise. |
| `liveDocumentation.evidence.strict` | `warning` | Controls lint severity when evidence sections are empty (`warning | error | off`). |

Live Docs can be stored inside the repository (versioned) or excluded via `.gitignore` during evaluation. Configure the root/baseLayer per workspace to match your staging strategy.

## Adoption Stages
1. **Observe** – Generate Live Docs under `/.live-documentation/source/`, inspect diffs, and collect regeneration latency.
2. **Guard** – Enable Live Doc lint (`npm run live-docs:lint`), require relative links, enforce HTML markers, and start tracking evidence waivers.
3. **Bridge** – Wire coverage ingestion and docstring bridges; pivot diagnostics and CLI exports to consume Live Docs.
4. **Sustain** – Promote Live Docs as canonical Layer‑4 MDMD, block merges on regeneration drift, and publish Live Doc mirrors to wikis.

## Key Commands
| Command | Purpose |
| --- | --- |
| `npm run lint` | ESLint across packages. |
| `npm run test:unit` | Vitest suite with coverage (auto rebuilds `better-sqlite3` for Node). |
| `npm run test:integration` | VS Code integration harness (rebuilds `better-sqlite3` for Electron). |
| `npm run verify` | Lint → unit → integration → doc link audits; `-- --report` refreshes benchmark markdown. |
| `npm run live-docs:generate` | Regenerate Live Docs (supports `--dry-run`, `--changed`). |
| `npm run live-docs:inspect -- <path>` | Output authored + generated summaries for a given artefact (markdown or JSON). |
| `npm run live-docs:lint` | Validate structure, generated markers, relative links, slug dialect, and evidence placeholders. |
| `npm run live-docs:migrate -- --dry-run` | Compare staged Live Docs to `.mdmd/layer-4/` before promotion (coming soon). |
| `npm run safe:commit` | Composite gate chaining verify, graph snapshot/audit, SlopCop lint, and soon Live Doc regeneration checks (`--benchmarks` adds analyzer suites). |
| `npm run slopcop:markdown` / `npm run slopcop:assets` / `npm run slopcop:symbols` | Markdown, asset, and symbol audits; now cover staged Live Docs as well. |

### SlopCop Configuration
- All passes read [`slopcop.config.json`](./slopcop.config.json). Top-level `ignoreGlobs` apply globally.
- `markdown.ignoreTargets` and slug enforcement keep Live Docs wiki-compatible; adjust dialect when targeting Azure DevOps or GitLab wikis.
- Asset audits remain valuable even without standalone asset Live Docs: broken references surface before regeneration.

### Native Module Rebuilds
- `npm run rebuild:better-sqlite3:force` installs the correct native binary for the active Node runtime.
- Integration tests always rebuild against Electron to prevent ABI drift (`SKIP_NATIVE_REBUILD` is ignored for those suites).

## Documentation
- Live Documentation spec, plan, tasks, and quickstart live under `specs/001-live-documentation/` (pivoted from Link-Aware Diagnostics).
- Layered MDMD docs reside under `.mdmd/` (Vision, Roadmap, Architecture, Implementation) and will eventually be generated from Live Docs.
- Working notes and chat transcripts are tracked in `AI-Agent-Workspace/` for reproducibility.

### Benchmark Reports
- Mode-specific markdown summaries live in `reports/test-report.self-similarity.md` and `reports/test-report.ast.md`.
- Analyzer precision/recall snapshots remain in `reports/benchmarks/<mode>/`; Live Doc-specific summaries will join under `reports/benchmarks/live-docs/`.
- Untracked deep-dive outputs live under `AI-Agent-Workspace/tmp/benchmarks/<suite>/<mode>/`.

## Contributing Workflow
1. Develop in a clean branch; keep the staged Live Docs tree in sync via `npm run live-docs:generate -- --dry-run`.
2. Run `npm run safe:commit` (`--benchmarks` when touching analyzers) before pushing.
3. Commit once lint, tests, Live Doc lint/regeneration, and benchmarks are green.

Consult the daily summaries in `AI-Agent-Workspace/ChatHistory/` for context, decision logs, and migration progress.
