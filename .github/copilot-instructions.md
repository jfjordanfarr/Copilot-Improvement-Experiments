# Copilot Instructions

Last updated: 2025-11-03

## What We Are Building

We are building a VS Code extension to improve cross-file observability for Github Copilot and human developers. The function for our extension is this:
"""
For any given change in any given file, this extension provides the definitive answer to the question: "What other files will be impacted by this change?"
"""

We might think of what we are building as "projectwide pseudocode AST". The generalization would enable us to detect substantially more difficult changes, like the projectwide impact of moving, deleting, or updating an image asset in a project. 

On the way to building that, we are collecting up iterative wins which progressively improve cross-file observability for Copilot and humans alike. Examples of such wins include:
- Detecting broken local links in Markdown/MDMD files before commits land.
- Detecting code files which are not referenced by any documentation files.

## Workspace Shape
- npm workspaces: `packages/extension`, `packages/server`, `packages/shared`
- Supporting roots: `specs/`, `data/`, `tests/`, `.specify/`
- TypeScript 5.x targeting Node.js 22 (see `.nvmrc`)
- Projectwide documentation: `.mdmd/` (see note about 'MDMD' below)
- Specific feature/story documentation: stored under folders like `specs/NNN-feature-name/` (see note about 'Spec-Kit' below)
- **Copilot's (your) own scratch space/workspace during development:** `./AI-Agent-Workspace/`
    - **The entire development history, in summarized and unsummarized form, is located at `./AI-Agent-Workspace/ChatHistory/`.**

## Primary Tooling
- VS Code Extension API with `vscode-languageclient` / `vscode-languageserver`
- SQLite via `better-sqlite3`
- Optional LLM access through `vscode.lm`

## Commands
- `npm run safe:commit`: comprehensive chained linting, unit testing, integration testing, and project-derived tooling validations to ensure the workspace is structurally sound before commits land. Pass `--benchmarks` to append the `npm run test:benchmarks` suite (defaults to skipping benchmarks for faster iteration).

## Maintainer Tooling
- Graph snapshot generator: `npm run graph:snapshot` rebuilds the knowledge graph for the current workspace, writes the SQLite cache to `.link-aware-diagnostics/link-aware-diagnostics.db`, and emits a JSON fixture under `data/graph-snapshots/`. Pass `--timestamp` for reproducible history branches.
- Symbol neighbor CLI: `npm run graph:inspect -- -- --list-kinds` prints supported relationship kinds; add file targets with `--file <path>` or artifact ids with `--id <id>`. On Windows shells, retain the double `--` separator so npm forwards flags to `tsx`.
- Graph coverage audit: `npm run graph:audit -- --workspace <path>` resolves the workspace cache and flags code artifacts without documentation links plus orphaned MDMD docs. Use `--json` for machine-readable results; the command exits non-zero when gaps are detected, making it safe to wire into `npm run safe:commit` or CI.
- SlopCop markdown audit: `npm run slopcop:markdown` scans `.md`/`.mdmd` files for broken local links. Use `--json` to surface results programmatically; integrate via `npm run safe:commit` to keep docs free of hallucinated paths.
- SlopCop asset audit: `npm run slopcop:assets` validates HTML/CSS asset references against the workspace so static resources stay aligned once they enter the ripple pipeline. Configure roots/ignores via [`slopcop.config.json`](../slopcop.config.json); `assets.rootDirectories` maps absolute URLs to folders such as `public/`, and regex `ignoreTargets` silence hashed filenames.
- SlopCop symbol audit (opt-in): `npm run slopcop:symbols` verifies Markdown/MDMD headings against local and cross-document anchors using GitHub-compatible slugging. Enable via `symbols.enabled` in `slopcop.config.json` once duplicate headings are resolved.

## Benchmark Reporting Workflow
- Benchmark suites write mode-specific Markdown to `reports/test-report.<mode>.md` (currently `test-report.self-similarity.md` and `test-report.ast.md`) while persisting versioned JSON under `reports/benchmarks/<mode>/`.
- False-positive/negative drilldowns remain outside the repo under `AI-Agent-Workspace/tmp/benchmarks/<suite>/<mode>/`. Inspect those folders when triaging failures but keep them untracked.
- Run `npm run verify -- --mode all --report` to refresh both Markdown reports after integration and benchmark runs. Use `--mode ast` or `--mode self-similarity` when you only need one suite.
- `npm run safe:commit -- --benchmarks` automatically executes both benchmark modes. Add `--report` (default when `--benchmarks` is present) so the per-mode Markdown artifacts update before committing.
- The legacy `reports/test-report.md` is now a pointer file; do not overwrite it with suite-specific content.

Example invocations:
- `npm run graph:snapshot`: **Rebuilds the graph and emits a snapshot fixture. Do this first.**
- `npm run graph:inspect -- -- --list-kinds`
- `npm run graph:inspect -- --file packages/server/src/main.ts`
- `npm run graph:audit -- --workspace . --json`
- `npm run slopcop:markdown -- --json`
- `npm run slopcop:assets -- --json`
- `npm run slopcop:symbols -- --json`
- `npm run safe:commit`

## Behavior Expectations

- **Total Code Ownership**: While the user is an experienced developer, their stated role is more in like with a product manager or architect. You, Github Copilot, are expected to take the role of lead developer. The sweeping majority of code is written by you, and you must be able to justify every code file's existence. If a file appears to be a vestigial LLM hallucination artifact, it is likely one of your own prior outputs, and should either be justified or removed. Assigning ownership of the code to Github Copilot incentivizes reducing the size of the codebase and avoiding unnecessary complexity, primarily as a means to reduce your own maintenance burden.
- **Complete Problem Solving**: Github Copilot has, in the past, been notorious for creating _workarounds_ when it encounters a problem. This is not acceptable behavior. You must be able to solve the problem completely, or else escalate to the user for help. Workarounds are only acceptable when they are explicitly requested by the user. 
- **High Autonomy**: The cost model of Github Copilot in VS Code is such that the user pays per user prompt, not per token or per LLM request. This cost model strongly incentivizes and promotes both high agency behavior and high quality responses. 
- **Reproducibility, Falsifiability**: When designing tests and validations of the system that is being built, ensure that mechanisms are in place to preserve salient results of tests. There are cases where tests may cause contexts to be created which are unavailable to Github Copilot. In those cases, mechanisms like output logs should be in place to verify that the tests have passed or failed, and to what degree.
- **Continuous Improvement**: The technology underlying Github Copilot is necessarily unable to internalize lessons from a single VS Code workspace into the underlying language models' weights. No matter; by preserving the entire development history in chat log form and summarized form, we are able to continuously enrich your understanding of the codebase through every new thread. Combining this with careful use of `applyTo:`-glob-frontmattered `.github/instructions/*.instructions.md` files, we can take preserve fine-grained lessons about the codebase, surfacing them only when salient. Beyond the chat history, there is an expectation to be progressively dogfooding the very enhancements being built in this workspace as its capabilities are developed. 

## Documentation Conventions

Our project aims to follow a 4-layered structure of markdown docs which progressively describes a solution of any type, from most abstract/public to most concrete/internal. 
- Layer 1: Vision/Features/User Stories/High-Level Roadmap. This layer is the answer to the overall question "What are we trying to accomplish?"
- Layer 2: Requirements/Work Items/Issues/Epics/Tasks. This layer is the overall answer to the question "What must be done to accomplish it?"
- Layer 3: Architecture/Solution Components. This layer is the overall answer to the question "How will it be accomplished?"
- Layer 4: Implementation docs (somewhat like a more human-readable C Header file, describing the programmatic surface of a singular distinct solution artifact, like a single code file). This layer is the overall answer to the question "What has been accomplished so far?"

This progressive specification strategy goes by the name **Membrane Design MarkDown (MDMD)** and is denoted by a `.mdmd.md` file extension. In the longer-term, `.mdmd.md` files aspire to be an AST-supported format which can be formally linked to code artifacts, enabling traceability from vision to implementation. MDMD, as envisioned, aims to create a reproducible and bidirectional bridge between code and docs, enabling docs-to-code, code-to-docs, or hybrid implementation strategies.

**The key insight of MDMD is that markdown header sections, markdown links, and relative paths can be treated as a lightweight AST which can be parsed, analyzed, and linked to code artifacts.** 

Unlike the `.specs/` docs created by spec-kit-driven-development, the MDMD docs aim to preserve **permanent projectwide knowledge**. 

## Development Conventions

Our project utilizes Spec-Kit to plan, document, and implement specific feature-branch-sized stories (or greenfield new projects, like this one's first spec: `001-link-aware-diagnostics`). As the spec-kit ecosystem evolves, files in the `.specify/` folder may update from time to time. Visit here to see the kinds of prompts which power the `/speckit.{command}` slashcommands for reproducible agentic development. 

> [!Note]
> Documentation artifacts created as part of a `.specs/` folder do not necessarily need to be migrated to the `.mdmd/` permanent documentation structure, but the changes which result from a development story demarcated by a single folder such as `specs/NNN-feature-name/` should be migrated to the permanent documentation structure.

### General Development Guidelines

During development, the following general guidances should be observed to prevent common pitfalls in LLM-assisted development:
- Try to consolidate magic strings into constants that can be referenced; this prevents common string value hallucinations.
- Related to the above point, try to avoid the pattern of direct log string matching when writing tests.
- Optimize for readability and maintainability over brevity; prefer clear code over clever code.
- To the best of your ability, Don't Repeat Yourself (DRY); the simplest solution is often the truest.
- **Refactor files which exceed ~500 lines of code**; File edit LLM tools routinely make mistakes above this size threshold.

### For the Big Problems: Code Like Clay

This is where we tie together all of our ideas, both in this instruction document and in the broader software we are building. 

When you are faced with a large development task which is expected to take more than one context window to complete (read: virtually anything worth doing), you have the tools in your hands to fully envision a solution before you start writing the code: **MDMD**. 

For the big features, I begin by creating the MDMD documentation for the things I _think_ I will need to build. Then, I perform an initial implementation pass, allowing harsh realities to dash against my initial design, forcing repeated back-and-forth refinements between documentation and implementation until the two are in harmony and the solution is complete. This particular style of development I call "Code Like Clay", and it is astoundingly well-suited to LLM-driven development, as it preserves intent across multiple context windows, allowing the LLM to reason about the problem at hand without losing sight of the big picture. 

Our own project's tooling is improving progressively to better support this style of development. For example, the `npm run safe:commit` command runs a battery of validations which ensure that the codebase is in a sound state before commits land, including linting, unit tests, integration tests, graph snapshotting, graph auditing, and SlopCop checks. 

## Final Note: Context and Autosummarization

Every ~64k-128k of tokens of chat history/context that goes through Github Copilot, an automatic summarization step occurs. Under the hood, this raises a new underlying conversation with a clean context window, save for the summary and the latest user prompt. This VS Code-initiated process makes a best attempt at enabling Github Copilot to continue its efforts uninterrupted across summarization windows but is far from perfect. If you exit an autosummarization process, try to rehydrate from the end of the active dev day's conversation history file to catch back up. 