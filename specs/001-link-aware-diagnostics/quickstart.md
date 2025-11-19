# Quickstart: Live Documentation

Live Documentation pairs every tracked workspace asset with a markdown artifact that combines an authored preamble (`Description`, `Purpose`, `Notes`) and generated sections (`Public Symbols`, `Dependencies`, archetype-specific evidence). This quickstart walks through staging those docs under `/.live-documentation/<baseLayer>/` (default `source/`), reviewing the output, and preparing for migration into Layer‑4 MDMD once parity is proven.

## Prerequisites
- VS Code 1.91+ with the Live Documentation extension loaded from this repository.
- Node.js 22.x and npm.
- Git tooling capable of capturing large workspace diffs (for Live Doc reviews).
- Optional: local LLM runtime (e.g., Ollama) for docstring summarisation once bridges are enabled.

## Bootstrap the Workspace
1. Clone and install dependencies:
   ```powershell
   git clone https://github.com/jfjordanfarr/Copilot-Improvement-Experiments.git
   cd Copilot-Improvement-Experiments
   npm install
   ```
2. Build the packages so shared utilities and extension bundles are in sync:
   ```powershell
   npm run build
   ```
3. Launch the extension in VS Code using the `Launch Extension` configuration. The language server exposes regeneration and lint services once the dev host is ready.
4. Confirm `.live-documentation/` is ignored by git (see `.gitignore`). The generator will stage markdown there until the migration gate flips Layer‑4 MDMD to mirror the new tree.

## Configure Live Documentation
Add the following settings to your workspace (e.g., `.vscode/settings.json`) to establish staging defaults:

```json
{
  "liveDocumentation.root": ".live-documentation",
  "liveDocumentation.baseLayer": "source",
  "liveDocumentation.slugDialect": "github",
  "liveDocumentation.requireRelativeLinks": true,
  "liveDocumentation.glob": [
      "packages/**/src/**/*.{ts,tsx,js,jsx,mjs,cjs,mts,cts}",
      "scripts/**/*.{ts,tsx,mjs,cjs}",
      "tests/**/*.{ts,tsx,js,jsx,mjs,cjs,mts,cts,cs,cshtml,cshtml.cs,py,java,rb,rs,c,cpp,html,css,json}"
  ]
}
```

**Key options**

| Setting | Default | Purpose |
| --- | --- | --- |
| `liveDocumentation.root` | `.live-documentation` | Filesystem root for staged docs. Can point outside the repo for private mirrors. |
| `liveDocumentation.baseLayer` | `source` | Folder name that mirrors the source tree. Rename when layering additional Live Documentation (e.g., `architecture/`, `work-items/`). |
| `liveDocumentation.slugDialect` | `github` | Header slug strategy. Supports `github`, `azure-devops`, and `gitlab`. |
| `liveDocumentation.requireRelativeLinks` | `true` | Forces generated and authored markdown links to remain relative, enabling repo-backed wikis. |
| `liveDocumentation.glob` | `[]` | Glob patterns defining which assets receive Live Docs. Honour the one-doc-per-source rule. |
| `liveDocumentation.enableDocstringBridge` | `false` | Enables bidirectional updates between Live Docs and inline docstrings once bridges stabilise. |
| `liveDocumentation.archetypeOverrides` | `{}` | Optional map for assigning non-default archetypes (e.g., treat `tests/**` as `test`). |

## Stage 0 – Observe
1. **Run the generator (dry-run first):**
   ```powershell
   npm run live-docs:generate -- --dry-run
   ```
   Inspect the diff summary to ensure authored blocks remain untouched. When satisfied, repeat without `--dry-run` to materialise markdown under `/.live-documentation/source/`.
2. **Review placeholders:** The generator produces:
   - `Metadata` front matter with `Live Doc ID`, archetype, source path, and provenance hash.
   - Authored headings seeded from templates. Populate `Description`, `Purpose`, and `Notes` manually.
   - Generated sections marked by HTML fences (`<!-- LIVE-DOC:BEGIN Public Symbols -->`). Editing inside these blocks raises lint failures.
3. **Track regeneration latency:** After running `npm run safe:commit`, copy the Live Documentation timings from the log into `reports/benchmarks/live-docs/latency.md`. These numbers anchor performance budgets before promotion.
4. **Prototype diff tooling:** Use the VS Code diff viewer or `git diff -- .live-documentation/source` to confirm generated sections change deterministically when source files update.

## Trace dependency paths with the inspect CLI
1. **Walk outbound or inbound chains:**
   ```powershell
   npm run live-docs:inspect -- --from Controllers/TelemetryController.cs --to appsettings.json --json
   ```
   The CLI emits `kind: "path"` with a `nodes` array tracing each hop plus a `hops` collection that mirrors the rendered markdown edges. Add `--direction inbound` to reverse the traversal.
2. **List terminal fan-out:**
   ```powershell
   npm run live-docs:inspect -- --from Services/TelemetryScheduler.cs --direction outbound --json
   ```
   Omitting `--to` returns `kind: "fanout"` alongside `terminalPaths` up to the configured `maxDepth` (defaults to 25). Each terminal path lists the artefacts encountered so prompt tooling can highlight downstream impact.
3. **Diagnose missing edges:**
   ```powershell
   npm run live-docs:inspect -- --from Services/TelemetryScheduler.cs --to Controllers/TelemetryController.cs --json
   ```
   When no chain exists the CLI exits with code 1, reports `kind: "not-found"`, and enumerates a `frontier` array with reasons such as `terminal`, `max-depth`, or `missing-doc`. LD-402 regression tests assert these payloads to keep failure diagnostics stable.

## Stage 1 – Guard
1. **Update authored headers:** Replace placeholder text in the staged docs with human-curated intent. Keep entries concise—LLMs ingest the authored block before generated sections.
2. **Enable lint gates:**
   ```powershell
   npm run live-docs:lint
   ```
   The lint pass enforces relative links, generated-marker integrity, and evidence presence (unless a waiver HTML comment exists).
3. **Wire safe-commit:** Add the Live Docs lint step to `scripts/safe-to-commit.mjs` (the repo already chains it) so every commit validates structure.
4. **Adopt docstring bridges:** Toggle `liveDocumentation.enableDocstringBridge` in settings once the archetype instructions are satisfied. Regeneration will fail if docstrings drift beyond one cycle without waivers.

## Stage 2 – Bridge
1. **Connect coverage sources:** Configure language-specific adapters (Vitest, Pytest, dotnet test) so evidence sections populate automatically.
2. **Inspect drift diagnostics:** Regeneration surfaces markdown/implementation mismatches via diagnostics and CLI output (`npm run live-docs:evidence -- path/to/file.ts`). Resolve or waive before migration.
3. **Verify CLI/UI parity:** Ensure every Live Documentation insight has both an extension command and a CLI equivalent (inspect, evidence, docstring sync, migrate, report). This enables GitHub Copilot and headless tooling to exercise the same features.

## Stage 3 – Sustain
1. **Dry-run migration:**
   ```powershell
   npm run live-docs:migrate -- --dry-run
   ```
   Compare the staged docs to `.mdmd/layer-4/` using the generated report.
2. **Flip the canonical toggle:** When parity is proven, set `liveDocumentation.promoteLayer4` to `true`. The next regeneration writes directly into `.mdmd/layer-4/` while preserving the staging tree for audits.
3. **Audit telemetry:** Check `reports/benchmarks/live-docs/*.json` and telemetry dashboards for regeneration latency, waiver counts, and evidence coverage. Document anomalies before closing the migration work item.

## Maintenance Cheat-Sheet
- **Regenerate after source edits:** `npm run live-docs:generate -- --changed` scopes regeneration to recently modified files (watch mode forthcoming).
- **Inspect dependencies:** `npm run live-docs:inspect -- --from packages/server/src/foo.ts --to packages/server/src/bar.ts --json` traces the Live Doc graph. Drop `--to` to enumerate terminal fan-out or add `--direction inbound` to reverse the search.
- **Sync docstrings:** `npm run live-docs:sync-docstrings -- packages/server/src/foo.ts` reconciles inline comments with the Live Doc summary.
- **Report coverage gaps:** `npm run live-docs:report -- --format markdown` produces dashboards summarising evidence waivers and dependency fan-out.

## Testing & CI Hooks
- **Regeneration tests:** `npm run test:integration -- --filter live-docs` (coming soon) verifies authored preservation and deterministic output.
- **Benchmarks:** `npm run run-benchmarks -- --mode live-docs` replays polyglot AST fixtures to guard symbol/dependency accuracy.
- **Safe commit:** `npm run safe:commit` already chains Live Doc lint, regeneration dry-run, standard linting, unit tests, integration suites, and benchmark drift checks. Use `--benchmarks` to capture AST accuracy results before migration approvals.

## Implementation Traceability
- [`packages/shared/src/live-docs/schema.ts`](../../packages/shared/src/live-docs/schema.ts) (planned) defines the metadata contract enforced across archetypes.
- [`packages/server/src/features/live-docs/generator.ts`](../../packages/server/src/features/live-docs/generator.ts) will orchestrate regeneration, authored preservation, and provenance hashing.
- [`scripts/live-docs/generate.ts`](../../scripts/live-docs/generate.ts) exposes the CLI entry used throughout this quickstart.
- `.github/instructions/mdmd.layer4*.instructions.md` document the authored/generated schema and archetype-specific sections that the generator honours.

Keep this guide close during the migration. Once Live Docs become canonical, Layer‑4 MDMD files emerge directly from the generator, giving both humans and copilots the same ground-truth view of the repository.
