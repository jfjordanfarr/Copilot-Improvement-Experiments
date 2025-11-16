# Live Documentation Refactor Plan

> Working checklist for re-aligning Layer 1–4 MDMD, spec-kit artifacts, and supporting instructions to the Live Documentation vision. Delete after the docs and tooling land.

## 0. Preparation
- [x] Lock in terminology: "Live Documentation" (LD) == authored+generated markdown mirror for tracked assets; note MIT licensing intent for public comms and emerging archetype vocabulary (Implementation, Test, Asset).
- [x] Rename the generated section heading from "Direct Interactors" to "Dependencies" across instructions, specs, and roadmap before template work begins so vocabulary is aligned.
- [x] Capture today’s pivot in `AI-Agent-Workspace/Notes/user-intent-census.md` (add Live Documentation bullet with Windsurf/GitLab competitive framing).
- [x] Inventory all active doc artifacts (captured in this plan with pointers to Layer‑1/Layer‑4 docs and spec-kit suite):
  - Layer‑1 vision, Layer‑2 roadmap & falsifiability, Layer‑3 component docs, Layer‑4 implementation docs.
  - Spec-kit set (`specs/001-link-aware-diagnostics/**/*`).
  - Copilot instructions & README/Quickstart references.
- [x] Stage instruction harmonization: update `.github/instructions/mdmd.layer4.instructions.md` first with new authored/generated schema, archetype templates, and generated-section contracts, then cascade changes to other MDMD instruction files.
- [x] Snapshot current state (`git status`, optional `npm run safe:commit -- --no-graph` dry run) so regressions are obvious. *(2025-11-09: git status captured after adding Live Docs ignore rules; safe-to-commit wired to new lint/report gates before next validation run.)*
- [x] Treat `/.live-documentation/` as the staging output for generator experiments; place generated docs inside a dedicated subdirectory (e.g., `/.mdmd/layer-4/`) and defer swapping the existing Layer‑4 tree until parity metrics and lint gates prove the new flow.

## 1. Reframe Top-Level Vision (Layer 1)
- [x] Rewrite `link-aware-diagnostics-vision.mdmd.md`:
  - [x] CAPs become LD pillars: **LDG-Backbone**, **LDG-Bridges**, **LDG-Surfaces**.
  - [x] Desired Outcomes emphasize authored/ generated split, markdown-as-AST, `.live-documentation/` mirror tree.
  - [x] Scope/non-goals call out MIT licensing, open-source differentiator from Windsurf Codemaps / GitLab Knowledge Graph.
  - [ ] Evidence links updated once lower layers refreshed.

## 2. Layer 2 Roadmap & Falsifiability
- [x] Collapse existing requirement streams into:
  - **REQ-L1 Live Docs Baseline** (authoring framework + generated sections + directory mirroring).
  - **REQ-L2 Generated Intelligence** (symbol/docstring extraction, asset stubs, heuristics/oracles integration; retain existing benchmark suites here instead of retiring them).
  - **REQ-L3 Consumption & Enforcement** (graph builder, diagnostics, CLI/LLM exports, SlopCop gates).
  - **REQ-E1 Enablers** (polyglot oracles, LLM sampling, benchmark automation).
- [x] Reassign tasks in each stream (T07x/T08x/T09x etc. grouped under new headings).
- [x] Add success criteria for LD freshness (e.g., drift resolved <24h, generated sections regen on `safe:commit`).
- [x] Update falsifiability doc with **REQ-F6 Live Doc Drift** covering:
  - Generated section parity tests.
  - Markdown link audit as AST invariant.
  - Narrative export regression fixtures.

## 3. Spec-Kit Suite (`specs/001-link-aware-diagnostics`)
 - [x] Rename feature framing to "Live Documentation" throughout spec, plan, quickstart, tasks, checklists.
 - [x] Reorder user stories:
   - **US-L1**: Teams author & curate Live Documentation headers.
   - **US-L2**: Generated sections stay in sync (automation, regen CLI, diff tooling).
   - **US-L3**: Consumers leverage the Live Doc graph for change impact (diagnostics/exports).
   - Additional stories: optional metadata, CLI & LLM integration.
 - [x] Update Functional Requirements to an **FR-LD#** series (stub creation, symbol extraction, dependencies, authored-protected sections, narrative exports).
 - [x] Refresh Edge Cases (docstring parsing errors, binary asset handling, partial regeneration failures) and Success Criteria (auditable `.live-documentation/` snapshots, regen latency).
 - [x] Align plan phases & tasks with the reordered stories (Phase naming L1, L2, L3 etc.), marking legacy diagnostic tasks as "uses Live Docs graph" where applicable.
 - [x] Quickstart: describe `.live-documentation/` workflow, toggles for versioning, commands for regenerate/diff.
 - [x] Checklists: ensure requirements checklist validates authored-vs-generated guardrails; inference checklist references LD generator + diagnostics interplay.
 - [x] Knowledge schema doc: add metadata guidance for docstring anchors & Live Doc provenance (link to new schema version once code updates).

## 4. Layer 3 Architecture Docs
- [x] Draft or repurpose component docs to map onto LD pipeline:
  - `live-documentation-pipeline.mdmd.md` (new): overview of authored template, generator, graph ingestion, export surfaces.
  - Update existing docs (diagnostics, language server, fallback inference, knowledge ingestion, relationship rules) to describe their role feeding the LD generator and graph.
  - Tie benchmark telemetry doc to validating generated sections (precision/recall on symbols & dependencies).
  - LLM ingestion doc: position as optional enhancer for generated sections + narratives.
- [x] Ensure cross-links reference new spec FR identifiers and roadmap streams.
- [ ] Specify deterministic derivation rules for System analytics archetypes (component, interaction, data-model, workflow, integration, testing) using only Layer‑4 graph signals; capture expected outputs by cross-checking legacy `.mdmd/layer-3/**` docs as validation references.
  - Available signals: Live Doc metadata (paths, archetype tags, provenance), generated `Public Symbols`, generated `Dependencies`, observed evidence links, file ownership (packages/extension/server/shared) – all sourced from deterministic workspace artefacts.
  - Expected outputs: per-archetype System analytics views with generated `Components` lists and Mermaid `Topology` derived solely from dependency/evidence data; authored `Purpose`/`Notes` drafted as a follow-up step when snapshots are intentionally persisted.
- [ ] Prototype an on-demand System analytics generator that writes to stdout or a caller-provided temp directory instead of committing artefacts by default.
- [ ] Implement generator support that rolls Layer‑4 analyzers into System analytics outputs (auto-populated `Components` lists and Mermaid `Topology` with `click` links) while keeping persistence optional.
- [x] Extract shared Live Doc generation foundation (target discovery, authored block merge, provenance hashing, diff classification) so Layer‑4 and System Layer generators compose the same core pipeline. *(2025-11-16: promoted into `packages/shared/src/live-docs/core.ts` + adapters so extension, server, and harnesses share the same implementation.)*
- [x] Wire Options 2 + 3 harnesses: add `npm run live-docs:headless` for deterministic fixture runs plus optional container-spec emission so hosted showcase rehearsals share the same pipeline artifacts. *(2025-11-16: headless harness reports land under `AI-Agent-Workspace/tmp/headless-harness/<scenario>/<timestamp>` with optional `container-spec.json` outputs.)*
- [x] Stage-0 pruning safeguards ensure stale docs without authored content are deleted while preserving authored stubs; added regression test coverage in `packages/server/src/features/live-docs/generator.test.ts`. *(2025-11-10)*
- [x] Backfill authored `Purpose`/`Notes` across System analytics is no longer required; rely on Layer‑4 authored sections and generated narratives to contextualise on-demand views.
- [ ] Add lint rules (live-docs:lint + SlopCop) verifying any persisted System exports carry explicit `live-docs:materialized` markers and forbidding stray files under `/.live-documentation/system/`.
- [ ] Validate topology diagrams render and links resolve inside VS Code, CLI previews, and markdown exports before promotion; ensure ephemeral runs clean up temporary files automatically.
- [ ] Refine generated output: drop compiled artefacts from `Components`, dedupe overlapping interaction/workflow docs, add orchestrator stage edges, and aggregate testing graphs to highlight Live Docs suites.
- [ ] Design the "materialized view" workflow: default System analytics to on-demand CLI output (`npm run live-docs:system`) that streams markdown/JSON to stdout or a caller-provided temp directory; keep repo check-ins opt-in only.
- [ ] Stage deletion plan for the current `.live-documentation/system/` mirror once the CLI lands, capturing rollback steps and lint updates that guard against accidentally committed views.
- [ ] Author integration tests that run the System analytics CLI against intentionally messy fixtures to prove technical debt surfaces without persisting artefacts (pair with doc examples for developer education).

### System Layer Signal Catalog (draft)

- **Global graph inputs**
  - Layer‑4 Live Doc metadata (`Code Path`, `Archetype`, `Live Doc ID`, provenance timestamps).
  - Generated `Public Symbols` (identify entry points, orchestration functions, schema exports).
  - Generated `Dependencies` (import graph edges with symbol-level detail where available).
  - Observed evidence / coverage relationships (tests referencing implementations, once `Targets` lands).
  - Filesystem structure (`packages/extension/src/commands`, `scripts/live-docs`, `packages/shared/src/live-docs`, etc.).
  - Intentionally exclude local git history (churn/co-change) to preserve reproducibility across contributors; rely on deterministic graph-derived analytics instead.

- **Component archetype**
  - Form strongly connected components or high-cohesion clusters within the dependency graph (closure over implementation docs sharing bidirectional edges).
  - Prefer clusters whose `Code Path` share a common ancestor directory (e.g., `packages/server/src/features/live-docs/**`).
  - Require minimum edge density / shared symbol usage to avoid trivial one-to-one docs.

- **Interaction (API surface) archetype**
  - Detect Layer‑4 docs located under `scripts/**`, `packages/extension/src/commands/**`, VS Code activation points, or files exporting CLI handlers.
  - Confirm exports match known command signatures (e.g., `registerCommand`, `program.command`).
  - Generated `Components` list references both the entry file and its primary collaborators (dependency fan-out directly beneath the surface).

- **Data model archetype**
  - Identify implementation docs under directories containing `schema`, `model`, `metadata`, or files exporting pure types/interfaces.
  - Flag exports containing `schemaVersion`, `z.object`, or serialization helpers.
  - Link downstream consumers by scanning dependency edges where data model files are imported.

- **Workflow archetype**
  - Target orchestrator files whose dependency set includes multiple distinct steps (e.g., `run-all.ts` imports manifest builder + generators).
  - Recognise exports with verbs like `run`, `sync`, `process` and asynchronous control flow (presence of `await`, concurrency helpers) via symbol metadata.
  - Build topology ordering from import sequence or explicit invocation order once call graph extraction is available.

- **Integration archetype**
  - Detect dependencies on external modules (`node:http`, `node:fs/promises`, third-party SDKs) or config providers referencing remote endpoints.
  - Require presence of environment setting access (`process.env`, `workspace.getConfiguration`).
  - Topology highlights boundary nodes and their internal adapters.

- **Testing architecture archetype**
  - Use observed evidence/coverage manifests to find tests that exercise multiple implementations or guard an entire subsystem.
  - Prefer test files under `tests/integration/**` or `*.test.ts` that target >1 Live Doc; group by shared targets.
  - Generated `Components` list pulls Target implementation docs; topology links test suites to covered components.

- **Validation loop**
  - Compare generated System Layer docs against legacy `.mdmd/layer-3/**` for coverage; discrepancies flagged for manual review rather than used as input.
  - Record false positives/negatives in this plan to refine heuristics before promotion.

#### System Layer signal validation (2025-11-10)

- **Component** – `packages/shared/src/live-docs/{markdown,schema}.ts` + `packages/server/src/features/live-docs/generator.ts` share dense bidirectional dependency edges, confirming the SCC-based clustering will group the Live Docs pipeline correctly.  Need to set a minimum cluster size ≥2 to avoid generating singleton components for leaf utilities.
- **Interaction** – `packages/extension/src/commands/exportDiagnostics.ts` and `scripts/live-docs/generate.ts` expose command constants or CLI entrypoints; path heuristics plus symbol names (`registerExportDiagnosticsCommand`, `generateLiveDocs`) are sufficient to flag interaction surfaces.  No additional runtime metadata required.
- **Data model** – `packages/shared/src/live-docs/schema.ts` exports only types/interfaces and includes `schemaVersion` patterns; dependency fan-out lists downstream consumers, validating that import-based discovery covers this archetype.
- **Workflow** – `scripts/live-docs/run-all.ts` orchestrates the pipeline but static dependency extraction misses stage relationships (strings inside `stages` array).  Action: extend the derivation pass to parse literal stage descriptors (label/script/args) via AST rather than relying solely on import edges.
- **Integration** – `packages/server/src/runtime/environment.ts` imports `node:fs`, `node:url`, and VS Code config guards, confirming external boundary detection via dependency modules works.  Need to whitelist other boundary modules (`node:http`, fetch clients) as the dataset grows.
- **Testing architecture** – Observed Evidence blocks already link regeneration tests to implementations (e.g., `generator.test.ts`, `renderPublicSymbolLines.test.ts`).  However, until `Targets` manifests land, coverage direction is one-sided; System Layer derivation must consume the forthcoming `coverage/live-docs/targets.json` (currently stubbed) to avoid false positives.
- **Cross-cutting assumptions** – Stage‑0 metadata provides timestamps and Live Doc IDs for provenance; no additional fields required.  Git churn remains optional—omit from first pass to keep determinism simple.

#### Generator refactor design notes

- Split the existing generator into three layers:
  1. **Core pipeline** – handles configuration normalization, target discovery, analyzer invocation, authored block preservation, provenance hashing, diff classification, and filesystem writes. Lives under `packages/server/src/features/live-docs/core/`.
  2. **Layer‑specific adapters** – supply archetype rules and generated section emitters. One adapter for Implementation (Layer‑4), another for System Layer (Layer‑3). Future capability layers can plug in later.
  3. **Entry scripts** – thin orchestrators in `scripts/live-docs/*.ts` that call the appropriate adapter.
- Prepare unit seams: reuse `discoverTargetFiles`, `analyzeSourceFile`, and markdown rendering across both layers; expose TypeScript program reuse to avoid rebuilding ASTs per layer.
- Ensure the refactor preserves current CLI behaviour (`npm run live-docs:generate`) by aliasing the Layer‑4 adapter as the default entrypoint until System Layer generation ships.

## 5. Layer 4 Implementation Docs
- [ ] Move Layer 4 summaries toward per-file LD focus:
  - Each doc highlights how the module contributes to authored/ generated sections.
  - Add sections detailing regen commands, SlopCop gates, test coverage bridging LD invariants.
- [ ] Capture archetype rules:
  - [x] Implementation LD files own Description/Purpose/Notes + generated `Public Symbols`, `Dependencies`, optional `Observed Evidence` (tests inferred via graph); lint validates the block when present and enforces waiver comments if automated evidence is absent. *(live-docs:lint now enforces waiver comments and safe-to-commit executes the precision report gate)*
  - [ ] Test LD files mirror projects under a `Tests` template with authored rationale plus generated `Targets` (implementation artifacts exercised) and `Supporting Fixtures` when applicable; enforce CLI/LLM parity for querying the same metadata available in the UI.
  - [ ] Asset coverage: prefer validating markdown links from implementation/test LD files to binary assets; only generate standalone asset LD stubs if link auditing proves insufficient. Expand SlopCop/link tooling tasks if asset stubs are omitted.
- [ ] Ship fixture-scoped polyglot emitters: extend the generator to hydrate `Public Symbols` and `Dependencies` for benchmark fixture languages (TypeScript, Python, C#, Java, Ruby, Rust, C) using repository-hosted analyzers before attempting external repositories.
- [ ] Prepare for final state where Layer 4 docs themselves become Live Documentation outputs (authored preamble + generated metadata). Document interim state & migration plan.

## 6. Supporting Instructions & README
- [x] Update `.github/copilot-instructions.md` to speak in LD terminology (authored/ generated, `.live-documentation/`, MIT license mention, doc regen expectations).
- [x] Refresh README/Quickstart references (rename extension to Live Documentation, highlight mirror directory and audit guarantees).
- [x] Adjust instructions `.mdmd` layers 2/3/4 references where slug names change.
- [x] Extend instruction set with archetype-specific overlays (e.g., `.github/instructions/mdmd.layer4.implementation.instructions.md`, `.tests.`, `.assets.`) that inherit base Layer‑4 rules and enforce template nuances.
- [x] Capture link hygiene requirements: Layer 4 instructions must mandate relative markdown links and surface slugging configuration knobs so adopters targeting Azure DevOps/GitHub wikis can keep Live Docs portable.

## 7. Tooling & Automation Notes (for follow-up implementation)
- [ ] Outline requirements for LD generator CLI:
  - Inputs: glob config, existing authored files, symbol/docstring data.
  - Outputs: deterministic generated sections, diff-friendly segmentation markers.
  - Safety: preserve authored block, annotate generated block with checksum/metadata.
- [ ] Design archetype-aware emitters so Implementation/Test/Asset LD templates share infrastructure but tailor generated sections (e.g., Evidence lint for implementations, Targets mapping for tests, Consumers for assets).
- [x] Introduce coverage manifest (`coverage/live-docs/targets.json`) consumed by evidence bridge to map tests → implementations → fixtures for Observed Evidence/Targets sections.
- [ ] Map existing heuristics/oracles to generated sections:
  - Symbol extraction per language (TS, Python, Rust, Java, Ruby, C, C#, etc.).
  - Dependency resolution (imports, inheritance, asset refs).
  - Asset stub generation rules (only if markdown link validation proves insufficient).
- [ ] Define regression tests: integration suite verifying `.live-documentation/` contents vs fixtures.
- [ ] Identify SlopCop extensions (ensure generated sections validated, authored sections untouched; expand link audits if asset LD stubs are skipped).
- [ ] Add configuration support for relative-link enforcement and optional header-slug dialects (GitHub vs. Azure DevOps) so generated docs remain wiki-friendly.
- [ ] Plan graph ingestion updates so LD markdown links feed existing knowledge graph.
- [ ] Document migration switch: once `/.live-documentation/` output is verified, flip configuration to point consumers (and eventually the default Layer‑4 tree) at the generated docs.
- [ ] Guarantee feature parity between UI surfaces and CLI/LLM commands (diagnostics, diff previews, exports) so copilots can drive Live Documentation without the VS Code UI.
- [ ] Design a deterministic `Live Doc ID` scheme (e.g., hash of archetype + normalized relative path) stored inside generated metadata.
- [ ] Document that churn metrics are out of scope for the core workspace intelligence; focus analytic enrichers on deterministic signals (co-activation, dependency centrality, evidence coverage).
- [ ] Document the CLI surface area (generate, lint, inspect, co-activation, forthcoming system views) in a single reference so onboarding copilots know which commands exist and what format they emit.

## 9. Layer Distribution Strategy
- [ ] Define the long-term Layer ownership model: Capability stories delivered via a public site (GitHub Pages or similar), Commitment backlog tracked in Spec-Kit / issue trackers, System analytics emitted as materialized views, Implementation Layer rooted in `.mdmd/layer-4/`. Call out that Stage 8 lands this split before any hosted showcase work (Stage 9) proceeds.
- [ ] Add tasks/spec entries for scaffolding a GitHub Pages (Astro) site sourced from Layer‑1 content, including build script, publish workflow, live preview instructions, and `npm run site:build -- --check` wiring inside `safe:commit`. The site + CI/CD gates must be green before the hosted showcase pipeline earns approval.
- [ ] Capture expectations for integrating external work-item systems (GitHub Issues/Azure DevOps) as the canonical Layer‑2 home while Live Docs reference them through generated links. Document how Spec-Kit exports map into the public site to keep roadmap + tracker states DRY.
- [ ] Update rollout comms (Layer‑1 vision, roadmap, quickstart) to describe the distribution model, explicitly stating that the Cloudflare-hosted showcase is a marketing trial that reuses the local generator and links back to offline-first workflows across VS Code, Windsurf, Cursor, and future forks.

> Note: This distribution layer must ship inside the CI/CD pipeline hardening window so the static site exists—and is health-checked—before the hosted demo (Stage 9) spins up.

## 8. Final Alignment & Cleanups
- [ ] Ensure all references to "Link-Aware Diagnostics" either retire or become “Live Documentation” (document historical note where needed).
- [ ] Insert MIT License file (or confirm existing license update) and reference in docs.
- [ ] Run full validations (`npm run safe:commit -- --benchmarks`) after doc edits and any supporting script updates.
- [ ] Remove this planning note once LD documentation & generator tooling are in place.

---
**End Goal:** Layer 4 MDMD files generated by our Live Documentation tooling, stored within the MDMD Layer‑4 tree (path configurable; default mirrors source structure), each containing:
1. Authored header (Description, Purpose, Notes) maintained by humans.
2. Generated sections (Public Symbols, Dependencies, archetype-specific metadata such as Observed Evidence/Targets/Consumers) produced deterministically from analyzers with preserved benchmark coverage.
3. Provenance markers enabling audits, CI/CLI gating, and markdown-as-AST graph ingestion.
