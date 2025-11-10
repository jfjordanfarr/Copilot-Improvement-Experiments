# Live Documentation Roadmap

## Metadata
- Layer: 2
- Requirement IDs: REQ-L1, REQ-L2, REQ-L3, REQ-E1

## Requirements

### REQ-L1 Live Documentation Baseline
Supports CAP-001 by delivering authored+generated Live Documentation artefacts in a configurable mirror tree with deterministic regeneration and human-friendly editing flows.

#### Stream LD1-A – Authored Framework *(in progress)*
- Update Layer‑4 instructions and archetype overlays (Implementation, Test, Asset) so every Live Doc shares the same authored template (`Description`, `Purpose`, `Notes`).
- Provide extension commands and snippets that protect the authored block while exposing convenient editing entry points.
- Document consent flows for storing generated Live Docs inside or outside the repository (`.live-documentation/` by default, configurable for adopters).

#### Stream LD1-B – Mirror Tree & Migration *(planned)*
- Stage generator output under `/.live-documentation/<baseLayer>/` (default `source/`), validate parity with existing Layer‑4 MDMD, then orchestrate an opt-in migration that flips the default storage path once confidence is proven.
- Maintain one-to-one Live Doc ↔ source relationships; ensure configuration surfaces align with monorepos and asset directories.
- Publish migration guide and automation scripts (e.g., `npm run live-docs:migrate`) for external adopters.

#### Stream LD1-C – Safety & Governance *(planned)*
- Embed lint rules and safe-commit hooks that detect missing generated sections or unauthorized edits inside generated blocks.
- Capture waivers for intentionally empty sections (`Observed Evidence`, `Targets`, `Consumers`) via HTML comments so automation can track debt.
- Record MIT licensing notices in Live Docs and packaging materials to reinforce open-source distribution.

### REQ-L2 Generated Intelligence
Supports CAP-002 by keeping generated sections current through analyzers, docstring bridges, coverage inference, and polyglot oracles.

#### Stream LD2-A – Symbol & Docstring Extraction *(in motion)*
- Refactor language analyzers (TypeScript, Python, Rust, Java, Ruby, C, C#) to emit export signatures, docstrings, and source anchors for the `Public Symbols` section.
- Build docstring bridges that keep Live Docs synchronized with inline documentation (TSDoc, XML comments, Sphinx, Rustdoc) while honouring consent signals.
- Maintain precision/recall benchmarks per language to keep regeneration trustworthy.

#### Stream LD2-B – Dependency Resolution *(in progress)*
- Upgrade import/call/asset heuristics to list first-order collaborators for every implementation Live Doc.
- Extend asset analyzers to detect HTML/CSS/image relationships, emitting lightweight Live Docs for non-plaintext assets.
- Store provenance metadata indicating heuristic family, benchmark score, and last regeneration timestamp.

#### Stream LD2-C – Evidence & Coverage *(planned)*
- Aggregate unit, integration, and benchmark coverage to populate `Observed Evidence` for implementations and `Targets` / `Supporting Fixtures` for tests.
- Integrate coverage CLI output and heuristics to reduce manual curation while keeping waivers auditable.
- Ensure regenerated evidence respects one-to-one Live Doc mapping and flags orphaned tests or implementations.

#### Stream LD2-D – Polyglot Oracles *(in progress)*
- Maintain deterministic AST benchmarks and regeneration CLIs (TypeScript, Python, C#, Rust, Java, Ruby, C) that feed analyzer confidence scores.
- Capture drift deltas in `reports/benchmarks/**` and expose them inside Live Docs as optional generated metadata.
- Layer an LLM sampling harness atop deterministic oracles with strict gating so predictions remain reviewable and reversible.

### REQ-L3 Consumption & Enforcement
Supports CAP-003 by making Live Documentation the backbone of diagnostics, CLI tooling, and lint enforcement.

#### Stream LD3-A – Diagnostics & Views *(in progress)*
- Pivot diagnostics providers to source their findings from the Live Doc graph, including hover tooltips, Problems entries, and acknowledgement workflows.
- Refresh tree views and quick pick commands so they display Live Doc metadata (generated timestamps, evidence counts, dependency fan-out).
- Provide diff previews comparing authored versus generated changes before accepting regeneration.

#### Stream LD3-B – CLI & Export Surfaces *(planned)*
- Ship CLI commands (e.g., `npm run live-docs:inspect`) that answer “what else does this touch?” by traversing markdown links and returning shareable markdown or JSON.
- Generate ASCII/markdown narratives and lightweight architecture diagrams consumable by humans and copilots.
- Support shareable codemap snapshots similar to Windsurf Codemaps but grounded entirely in markdown.

#### Stream LD3-C – Enforcement & Linting *(planned)*
- Integrate Live Doc validation with safe-commit, CI, and SlopCop so missing generated sections, stale timestamps, or absent evidence block merges.
- Emit JSON reports for dashboards and future IDE integrations (JetBrains, Vim) without duplicating business logic.
- Support staged adoption (Observe → Sustain) with profile configurations that control enforcement scope.

### REQ-E1 Ecosystem Enablement
Supports CAP-004 by packaging the Live Documentation system for open adoption and long-term sustainability.

#### Stream LD4-A – Packaging & Licensing *(in progress)*
- Publish MIT license, contributor guide, and extension marketplace messaging emphasising Live Documentation capabilities.
- Bundle sample workspaces and docs showing before/after Live Doc migrations.
- Provide tooling to scaffold archetype templates for new projects.

#### Stream LD4-B – External Integrations *(planned)*
- Research GitLab Knowledge Graph, LSIF, and SCIP ingestion paths that complement markdown-as-AST without compromising offline guarantees.
- Offer MCP/OpenAPI surfaces so other IDE agents can consume the Live Doc graph.
- Track competitive differentiators (Windsurf Codemaps) within roadmap updates and marketing materials.

## Acceptance Criteria

### REQ-L1 Acceptance Criteria
- Every Live Doc contains `Metadata`, `Authored`, and `Generated` sections with required subsections; safe-commit fails if structure is missing.
- Regeneration commands (`npm run live-docs:generate`) produce deterministic output and leave authored content untouched.
- Migration dry-runs compare existing Layer‑4 MDMD docs to generated Live Docs with <5% diff noise before enabling swap.
- Relative-link lint passes with the configured slug dialect (GitHub default) so staged docs can be published directly to wiki surfaces.
- Generated sections refresh within a single `safe:commit` run for modified files; stale Live Docs raise warnings within 24 hours if regeneration is skipped.

### REQ-L2 Acceptance Criteria
- Per-language benchmarks report ≥0.9 precision/recall for exported symbol detection and ≥0.8 for dependency resolution.
- Docstring bridges emit drift diagnostics and update generated sections during regeneration.
- Implementation Live Docs list at least one evidence artefact or record a waiver comment.
- Benchmark suites remain green for legacy languages (C#, Java, Rust, Python, Ruby, C) so Generated sections keep polyglot coverage parity.

### REQ-L3 Acceptance Criteria
- Diagnostics, CLI, and narrative commands reference Live Docs as the single source of truth (no bespoke graph queries).
- Safe-commit and CI pipelines block merges when Live Doc regeneration or lint checks fail.
- CLI exports and diagnostics respond within target latency (≤2 s for repos under 10k files).
- Every UI interaction (diagnostics, diff previews, tree views) exposes an equivalent CLI or LLM-accessible command so automation matches human capabilities.

### REQ-E1 Acceptance Criteria
- MIT license, README, and marketing materials describe Live Documentation capabilities and configuration knobs.
- Sample workspaces regenerate Live Docs using out-of-the-box tooling with zero manual steps.
- External API surfaces (CLI, MCP/OpenAPI) expose Live Doc graph queries with authentication disabled by default for local use.




## Linked Components

### COMP-001 Diagnostics Pipeline
Supports REQ-301. [Diagnostics Pipeline Architecture](../layer-3/diagnostics-pipeline.mdmd.md)

### COMP-002 Extension Surfaces
Supports REQ-301. [Extension Surfaces Architecture](../layer-3/extension-surfaces.mdmd.md)

### COMP-003 Language Server Runtime
Supports REQ-101 and REQ-201. [Language Server Architecture](../layer-3/language-server-architecture.mdmd.md)

### COMP-004 SlopCop Tooling
Supports REQ-101 and REQ-301. [SlopCop Architecture](../layer-3/slopcop.mdmd.md)

### COMP-005 Knowledge Graph Ingestion
Supports REQ-201 and REQ-401. [Knowledge Graph Ingestion Architecture](../layer-3/knowledge-graph-ingestion.mdmd.md)

### COMP-006 LLM Ingestion Pipeline
Supports REQ-201 and REQ-301. [LLM Ingestion Pipeline](../layer-3/llm-ingestion-pipeline.mdmd.md)

### COMP-007 Diagnostics Benchmarking
Supports REQ-201. [Benchmark Telemetry Pipeline](../layer-3/benchmark-telemetry-pipeline.mdmd.md)

### COMP-008 Integration Test Architecture
Supports REQ-030. [Integration Testing Architecture](../layer-3/testing-integration-architecture.mdmd.md)

### COMP-010 Relationship Rule Engine
Supports REQ-040. [Relationship Rule Engine Architecture](../layer-3/relationship-rule-engine.mdmd.md#comp010-relationship-rule-engine)

### COMP-011 Relationship Coverage Auditor
Supports REQ-040. [Relationship Rule Engine Architecture](../layer-3/relationship-rule-engine.mdmd.md#comp011-relationship-coverage-auditor)

### COMP-012 Symbol Correctness Profile Evaluator
Supports REQ-040. [Relationship Rule Engine Architecture](../layer-3/relationship-rule-engine.mdmd.md#comp012-symbol-correctness-profile-evaluator)

### COMP-013 Polyglot Fixture Oracles
Supports REQ-030. [Polyglot Oracles & Sampling Architecture](../layer-3/polyglot-oracles-and-sampling.mdmd.md#comp-013-polyglot-fixture-oracles)

### COMP-014 LLM Sampling Harness
Supports REQ-020 and REQ-030. [Polyglot Oracles & Sampling Architecture](../layer-3/polyglot-oracles-and-sampling.mdmd.md#comp-014-llm-sampling-harness)

## Linked Implementations

### IMP-101 docDiagnosticProvider
Supports REQ-301. [Extension Diagnostic Provider](../layer-4/extension-diagnostics/docDiagnosticProvider.mdmd.md)

### IMP-102 publishDocDiagnostics
Supports REQ-301. [Server Diagnostics Publisher](../layer-4/server-diagnostics/publishDocDiagnostics.mdmd.md)

### IMP-103 changeProcessor
Supports REQ-101 and REQ-201. [Change Processor Runtime](../layer-4/language-server-runtime/changeProcessor.mdmd.md)

### IMP-201 slopcopMarkdownLinks CLI
Supports REQ-101. [SlopCop Markdown Audit](../layer-4/tooling/slopcopMarkdownLinks.mdmd.md)

### IMP-202 slopcopAssetPaths CLI
Supports REQ-101. [SlopCop Asset Audit](../layer-4/tooling/slopcopAssetPaths.mdmd.md)

### IMP-203 documentationBridge Schema
Supports REQ-201. [Workspace Graph Snapshot](../layer-4/tooling/workspaceGraphSnapshot.mdmd.md)

### IMP-301 safe-to-commit Orchestrator
Supports REQ-101 and REQ-301. [Safe to Commit Pipeline](../layer-4/tooling/safeToCommit.mdmd.md)

### IMP-302 graphCoverageAudit CLI
Supports REQ-030. [Graph Coverage Audit](../layer-4/tooling/graphCoverageAudit.mdmd.md)

### IMP-303 inspectSymbolNeighbors CLI
Supports REQ-030. [Inspect Symbol Neighbors CLI](../layer-4/tooling/inspectSymbolNeighborsCli.mdmd.md)

### IMP-401 Relationship Rule Engine
Supports REQ-040. [Relationship Rule Engine](../layer-4/tooling/relationshipRuleEngine.mdmd.md)

### IMP-402 Relationship Rule Audit
Supports REQ-040. [Relationship Rule Audit](../layer-4/tooling/relationshipRuleAudit.mdmd.md)

### IMP-403 Relationship Rule Resolvers
Supports REQ-040. [Relationship Rule Resolvers](../layer-4/tooling/relationshipRuleResolvers.mdmd.md)

### IMP-404 Relationship Rule Types
Supports REQ-040. [Relationship Rule Types](../layer-4/tooling/relationshipRuleTypes.mdmd.md)

### IMP-480 Symbol Correctness Profiles
Supports REQ-040. [Symbol Correctness Profiles](../layer-4/tooling/symbolCorrectnessProfiles.mdmd.md)

### IMP-481 Symbol Correctness Validator
Supports REQ-040. [Symbol Correctness Validator](../layer-4/server-diagnostics/symbolCorrectnessValidator.mdmd.md)

### IMP-510 Python Fixture Oracle
Supports REQ-030. [Python Fixture Oracle](../layer-4/testing/benchmarks/pythonFixtureOracle.mdmd.md)

### IMP-521 C Fixture Oracle
Supports REQ-030. [C Fixture Oracle](../layer-4/testing/benchmarks/cFixtureOracle.mdmd.md)

### IMP-522 Rust Fixture Oracle
Supports REQ-030. [Rust Fixture Oracle](../layer-4/testing/benchmarks/rustFixtureOracle.mdmd.md)

### IMP-523 Java Fixture Oracle
Supports REQ-030. [Java Fixture Oracle](../layer-4/testing/benchmarks/javaFixtureOracle.mdmd.md)

### IMP-524 Ruby Fixture Oracle
Supports REQ-030. [Ruby Fixture Oracle](../layer-4/testing/benchmarks/rubyFixtureOracle.mdmd.md)

### IMP-541 C# Fixture Oracle
Supports REQ-050. [CSharp Fixture Oracle](../layer-4/testing/benchmarks/csharpFixtureOracle.mdmd.md)

### IMP-530 LLM Sampling Harness
Supports REQ-201 and REQ-301. [LLM Sampling Harness](../layer-4/shared/llmSampling.mdmd.md)

## Evidence

### REQ-101 Evidence
- Live Documentation generator spike stored under `AI-Agent-Workspace/tmp/live-docs` demonstrates authored block preservation and generated diff stability.
- Safe-to-commit logs from 2025-11-08 record lint guards catching missing markers until instructions were updated.
- Updated Layer-4 instruction files (`.github/instructions/mdmd.layer4*.instructions.md`) align archetype templates with new structure.

### REQ-201 Evidence
- AST benchmarks (`reports/benchmarks/ast/*.json`) track precision/recall deltas for each language-specific oracle.
- Integration fixtures covering docstring bridges (`tests/integration/fixtures/slopcop-symbols`) regenerate without manual edits.
- Fallback heuristic tests (`fallbackInference.languages.test.ts`) validate dependency extraction across languages.

### REQ-301 Evidence
- Diagnostics integration suites US1–US5 now reference Live Docs in assertions.
- CLI prototypes under `scripts/live-docs` emit markdown narratives derived from staged Live Docs.
- SlopCop symbol audit verifies generated markers and evidence placeholders.

### REQ-401 Evidence
- MIT license draft and README updates tracked in `AI-Agent-Workspace/Notes/live-documentation-doc-refactor-plan.md`.
- Competitive research notes (Windsurf Codemaps, GitLab Knowledge Graph) captured in 2025-11-08 chat and surfaced in Layer‑1 vision.
- Sample workspace scaffolding spike recorded under `AI-Agent-Workspace/tmp/live-docs/sample-workspace`.

## Verification Strategy
- Pre-commit guard: [`npm run safe:commit`](/scripts/safe-to-commit.mjs) chaining lint, tests, graph snapshot or audit, and the SlopCop suite (markdown, asset, symbol audits).
- Integration coverage: US1 to US5 suites emulate writer, developer, rename, and template ripple flows.
- Knowledge feed diffs: snapshot JSON fixtures under [`tests/integration/fixtures/simple-workspace/data/knowledge-feeds`](/tests/integration/fixtures/simple-workspace/data/knowledge-feeds).
- Live Doc verification: integrate regeneration assertions into `npm run safe:commit -- --benchmarks` once generator stabilises.

## Traceability Links
- Vision alignment: [Layer 1 Vision](../layer-1/link-aware-diagnostics-vision.mdmd.md)
- Stakeholder prompts: [User Intent Census](/AI-Agent-Workspace/Notes/user-intent-census.md)
- Architecture docs: see linked components above.
- Implementation summaries: see linked implementations above.

## Active Questions
- Which external feed (LSIF, SCIP, GitLab knowledge graph) should open the T05x MVP pipeline?
- What coverage threshold do we need before promoting SlopCop asset and symbol lint beyond markdown?
- Do we gate Copilot metadata exposure until acknowledgement UX is complete?
- What diff heuristics keep authored block edits readable when generated sections change significantly?
- How do we package Live Docs inside the extension without inflating download size for adopters who regenerate on demand?
- Which narrative/diagram presets best serve both humans and copilots while remaining deterministically regenerable?
