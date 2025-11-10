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
- [x] Treat `/.live-documentation/` as the staging output for generator experiments; place generated docs inside a dedicated subdirectory (e.g., `/.live-documentation/layer-4/`) and defer swapping the existing Layer‑4 tree until parity metrics and lint gates prove the new flow.

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

## 5. Layer 4 Implementation Docs
- [ ] Move Layer 4 summaries toward per-file LD focus:
  - Each doc highlights how the module contributes to authored/ generated sections.
  - Add sections detailing regen commands, SlopCop gates, test coverage bridging LD invariants.
- [ ] Capture archetype rules:
  - [x] Implementation LD files own Description/Purpose/Notes + generated `Public Symbols`, `Dependencies`, optional `Observed Evidence` (tests inferred via graph); lint validates the block when present and enforces waiver comments if automated evidence is absent. *(live-docs:lint now enforces waiver comments and safe-to-commit executes the precision report gate)*
  - [ ] Test LD files mirror projects under a `Tests` template with authored rationale plus generated `Targets` (implementation artifacts exercised) and `Supporting Fixtures` when applicable; enforce CLI/LLM parity for querying the same metadata available in the UI.
  - [ ] Asset coverage: prefer validating markdown links from implementation/test LD files to binary assets; only generate standalone asset LD stubs if link auditing proves insufficient. Expand SlopCop/link tooling tasks if asset stubs are omitted.
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
- [ ] Decide how optional churn metrics remain reproducible without remote git access; document guardrails or defer the metric if determinism cannot be guaranteed.

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
