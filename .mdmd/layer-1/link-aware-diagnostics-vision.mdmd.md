# Live Documentation Vision

## Metadata
- Layer: 1
- Capability IDs: CAP-001, CAP-002, CAP-003, CAP-004

## Capabilities

### CAP-001 – LDG Backbone
Deliver a repository-embedded corpus of Live Documentation where every tracked asset owns an authored preamble and generated sections (`Public Symbols`, `Dependencies`, archetype metadata) stored in a mirror tree under `/.live-documentation/layer-4/` (path configurable per workspace). The corpus must be reproducible from source artefacts without cloud dependencies ([AI-Agent-Workspace/ChatHistory/2025-11-08.md](../../AI-Agent-Workspace/ChatHistory/2025-11-08.md)).

### CAP-002 – LDG Bridges
Automate symbol extraction, docstring harvesting, asset stubs, and test evidence so the generated portion of each Live Doc stays current and lintable. The engine should reuse existing heuristics, benchmarks, and knowledge feeds while remaining transparent and auditable ([specs/001-link-aware-diagnostics/spec.md](../../specs/001-link-aware-diagnostics/spec.md)).

### CAP-003 – LDG Surfaces
Expose the Live Documentation graph through diagnostics, CLI queries, shareable exports, and LLM-ready narratives so humans and copilots consume the same authoritative context ([AI-Agent-Workspace/ChatHistory/2025-10-29.md](../../AI-Agent-Workspace/ChatHistory/2025-10-29.md)).

### CAP-004 – LDG Memory
Keep stakeholder directives, MIT licensing posture, and competitive research (Windsurf Codemaps, GitLab Knowledge Graph) codified alongside Live Docs so future contributors inherit context without rummaging through chat histories ([AI-Agent-Workspace/Notes/user-intent-census.md](../../AI-Agent-Workspace/Notes/user-intent-census.md)).

## Desired Outcomes
- Generated content for every Live Doc can be reproduced on demand and compared deterministically; authored content stays small, intentional, and easy to review.
- Implementation Live Docs always list their public surface, dependencies, and observed evidence so ripple impact and test coverage are auditable in markdown alone.
- Test and asset archetypes expose their relationships through generated sections (`Targets`, `Supporting Fixtures`, `Consumers`), enabling cross-language AST traversal without bespoke parsers.
- Diagnostics, exports, and LLM prompts all rely on the same markdown-as-AST graph, shrinking the gap between human review workflows and autonomous copilots.
- Markdown links stay relative (slug dialect configurable) so Live Docs double as wiki-friendly artefacts consumers can publish directly.
- The Live Documentation corpus remains MIT-licensed, open, and portable so other teams can adopt the tooling without vendor lock-in.

## Downstream Requirements

### REQ-101 – Live Documentation Baseline
[Product roadmap – REQ-L1](../layer-2/product-roadmap.mdmd.md#req-l1-live-documentation-baseline) aligns authored templates, mirror directories, and consent workflows to CAP-001.

### REQ-201 – Generated Intelligence
[Product roadmap – REQ-L2](../layer-2/product-roadmap.mdmd.md#req-l2-generated-intelligence) and [spec Functional Requirements](../../specs/001-link-aware-diagnostics/spec.md#functional-requirements) cover symbol/docstring extraction, heuristics, and asset stubs for CAP-002.

### REQ-301 – Consumption & Enforcement
[Product roadmap – REQ-L3](../layer-2/product-roadmap.mdmd.md#req-l3-consumption--enforcement) and [spec tasks](../../specs/001-link-aware-diagnostics/tasks.md) drive diagnostics, CLI, and lint integrations supporting CAP-003.

### REQ-401 – Ecosystem Enablement
[Product roadmap – REQ-E1](../layer-2/product-roadmap.mdmd.md#req-e1-enablers) keeps competitive research, MIT licensing, and future feed integrations in view for CAP-004.

## Success Signals
- ≥95% of modified source files have Live Docs regenerated within the same verify run, and all generated sections hash-match local analyser output (SC-LD-001).
- No Live Doc ships without observed evidence or an approved waiver, cutting undocumented implementations by 80% during pilot audits (SC-LD-002).
- Copilot and CLI queries return Live Doc links for impact analysis within 2 seconds for repositories under 10k files (SC-LD-003).
- External adopters can enable the Live Documentation extension, regenerate docs, and pass safe-commit checks on day one thanks to MIT licensing and deterministic pipelines (SC-LD-004).

## Evidence
- US1–US5 integration suites validate ripple diagnostics for code, documentation, acknowledgement, scope collision, and transforms ([tests/integration](/tests/integration)).
- Graph snapshot and audit CLIs keep deterministic caches and coverage guarantees ([scripts/graph-tools](/scripts/graph-tools)).
- SlopCop markdown lint runs inside the safe-to-commit gate, blocking hallucinated links before commit ([scripts/slopcop/check-markdown-links.ts](/scripts/slopcop/check-markdown-links.ts)).
- Layer 3 and 4 MDMD catalogues—soon to become Live Docs themselves—document runtime, ingestion, and diagnostics flows that feed CAP-001 through CAP-003.

## Target Personas
- **Implementers**: engineers expect Live Docs to show programmatic surface, dependents, and tests before accepting Copilot suggestions or merging a PR.
- **Test Authors**: quality engineers rely on test Live Docs to declare coverage scope and fixture responsibilities without spelunking large suites.
- **Writers and Architects**: documentation owners edit a concise authored block while trusting generated sections to reflect the latest code reality.
- **Leads and Reviewers**: reviewers pull Live Docs and CLI summaries to gauge blast radius and evidence before approving changes.

## Guiding Principles
1. **Markdown as AST** – treat markdown links, headings, and sections as the canonical graph; code analyzers exist to refresh markdown, not replace it.
2. **Workspace Local First** – run entirely on developer machines, keeping data private and reproducible; remote feeds are optional accelerators.
3. **Generated Blocks are Sacred** – tooling owns generated sections; humans curate authored notes and waivers with discipline.
4. **Evidence or Escalation** – every implementation must link to proof, or record a waiver explaining the gap.
5. **Shareable by Default** – Live Docs, CLI exports, and MIT licensing keep artefacts portable across GitHub, Azure DevOps, and other wiki surfaces.
7. **Layered Growth** – higher-layer Live Docs (releases, work items, architecture) inherit the same authored/generated contract so the roadmap, requirements, and architecture can be rebuilt from the base corpus.
6. **Continuous Falsifiability** – benchmarks, integration suites, and SlopCop rules back every guarantee with repeatable tests.

## Scope and Non Goals
- **In scope**: Live Documentation VS Code extension, language server pipelines, markdown graph builder, docstring bridges, diagnostics and CLI exports, MIT license preparation.
- **Out of scope (current spec)**: IDE-agnostic clients, automated remediation, CI enforcement beyond safe-commit, hosted SaaS offerings, non-configurable storage locations.

## Evolution Path
- **Live Doc Baseline (present)**: converge MDMD Layer‑4 docs onto authored/generated structure and stage generator output in `/.live-documentation/`.
- **Docstring & Evidence Bridges (near term)**: wire analyzers and coverage tools so generated sections stay accurate across languages and test suites.
- **Consumption Surfaces (near term)**: deliver CLI, diagnostics, and LLM exports backed by the Live Doc graph.
- **Metadata Enrichers (mid term)**: add churn metrics, reference counts, and change history as optional generated sections; experiment with higher-layer docs (releases, work items, architecture) generated from Layer‑4 facts.
- **Ecosystem Expansion (long term)**: share MIT-licensed tooling, integrate alternative knowledge feeds, and explore IDE-agnostic adapters.

## Adoption Path
- **Stage 0 – Observe**: bootstrap Live Docs from existing MDMD content, allow read-only exploration, and collect feedback.
- **Stage 1 – Guard**: enable lint warnings for missing evidence or stale generated sections; provide regeneration commands in safe-commit.
- **Stage 2 – Bridge**: enforce docstring and coverage sync, introduce CLI/LLM exports, and activate diagnostics sourced from Live Docs.
- **Stage 3 – Sustain**: require green Live Doc gates before merge; external adopters configure storage and regen workflows mirroring ours.

## Open Questions
- What UX affordances best expose ripple metadata without overwhelming users? (Tracked in T042 roadmap.)
- How should we prioritise future feed integrations such as LSIF, SCIP, or GitLab knowledge graphs under the offline-first stance?
- When Copilot suggests a change, how do we feed Live Doc awareness back into the suggestion pipeline without impacting latency?
- What is the minimal metadata set required for binary assets so generated sections stay useful without bloating the repo?

## Implementation Touchpoints
- [Live Documentation Generator](../layer-3/language-server-architecture.mdmd.md) will orchestrate analyzers, docstring bridges, and markdown emitters to refresh generated sections.
- [Knowledge Feed Manager](../layer-4/knowledge-graph-ingestion/knowledgeFeedManager.mdmd.md) keeps optional LSIF/SCIP feeds healthy so generated sections remain accurate.
- [Diagnostics Tree View](../layer-4/extension-views/diagnosticsTree.mdmd.md) and [Export Diagnostics Command](../layer-4/extension-commands/exportDiagnostics.mdmd.md) consume Live Docs for impact analysis.
- [SlopCop Markdown Audit](../layer-4/tooling/slopcopMarkdownLinks.mdmd.md) and future Live Doc-specific lint rules enforce authored/generated boundaries and evidence guarantees.

## Code Anchors
- [`packages/server/src/main.ts`](../../packages/server/src/main.ts) bootstraps the language server runtime that triggers Live Doc regeneration.
- [`packages/server/src/runtime/changeProcessor.ts`](../../packages/server/src/runtime/changeProcessor.ts) coordinates analyzers that populate generated sections.
- [`packages/server/src/features/diagnostics/publishCodeDiagnostics.ts`](../../packages/server/src/features/diagnostics/publishCodeDiagnostics.ts) and [`publishDocDiagnostics.ts`](../../packages/server/src/features/diagnostics/publishDocDiagnostics.ts) will source messages from the Live Doc graph to uphold the “definitive answer” promise.
