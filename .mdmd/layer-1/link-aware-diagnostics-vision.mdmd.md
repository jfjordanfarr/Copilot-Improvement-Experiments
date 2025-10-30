# Link-Aware Diagnostics Vision

## Intent
- Deliver a complete, workspace-local understanding of change impact across code, documentation, and tooling without depending on external services ([AI-Agent-Workspace/ChatHistory/2025-10-16.md](../../AI-Agent-Workspace/ChatHistory/2025-10-16.md)).
- Elevate GitHub Copilot from code-completion to project-wide partner by exposing cross-file ripple context directly inside the editor ([specs/001-link-aware-diagnostics/spec.md](../../specs/001-link-aware-diagnostics/spec.md)).
- Render ripple intelligence in formats that humans and LLMs can both digest—Markdown narratives, ASCII diagrams, and structured JSON ([AI-Agent-Workspace/ChatHistory/2025-10-29.md](../../AI-Agent-Workspace/ChatHistory/2025-10-29.md)).
- Preserve architectural and documentation alignment by treating markdown knowledge as first-class citizens in the dependency graph ([AI-Agent-Workspace/ChatHistory/2025-10-19.md](../../AI-Agent-Workspace/ChatHistory/2025-10-19.md)).
- Anchor future decisions to the curated user-intent census so stakeholder guidance stays visible even when autosummarization trims context ([AI-Agent-Workspace/Notes/user-intent-census.md](../../AI-Agent-Workspace/Notes/user-intent-census.md)).

## Target Personas
- **Implementers**: Engineers saving code files need immediate visibility into dependent modules before committing.
- **Writers & Architects**: Documentation owners editing Layer 1–3 markdown must know which implementation assets require review.
- **Leads & Reviewers**: Leads triage ripple alerts, assign follow-up, and close the loop once remediation is complete.

## Desired Outcomes
- Every save event answers three questions within seconds: triggering artifact, impacted artifacts (depth-aware), and remediation guidance.
- Documentation drift is surfaced with the same urgency as code regressions, preventing stale architecture narratives.
- Ripple metadata (relationship, depth, confidence, path) is explorable without leaving VS Code, empowering Copilot prompts with authoritative context and ASCII/Markdown diagrams for summarization.
- Workspace linting treats markdown, code, and symbol links as the same continuum—starting with deterministic markdown link proof ("SlopCop") and expanding toward full pseudocode AST validation.

## Guiding Principles
1. **Graph First** – Treat the knowledge graph as the source of truth; caches are disposable projections rebuildable on demand.
2. **Noise Discipline** – Diagnostics must respect hysteresis, batching, and acknowledgement workflows to avoid alert fatigue.
3. **Human + Copilot Symbiosis** – Surfaces must stay equally legible to humans and LLM prompts, favouring portable Markdown tables and ASCII diagrams over bespoke visualisations.
4. **Workspace-Local First** – Guarantees derive from files, telemetry, and artefacts already present in the repository; external services remain optional accelerators.
5. **Falsifiability** – Every promised behaviour owns a repeatable test (unit, integration, or benchmark) guarding against silent regressions.
6. **Proxy Iterations** – Use high-signal proxies (markdown links, asset paths) to harden tooling before promoting the same guarantees to symbols and generated artifacts.

## Current Capability Snapshot (Dev Day 9)
- **Ripple Diagnostics** – US1–US5 integration suites verify code, documentation, acknowledgement, scope collision, and transform ripple flows ([`tests/integration`](/tests/integration)).
- **Knowledge Graph Tooling** – Graph snapshot/audit CLIs maintain deterministic caches and coverage guarantees ([`scripts/graph-tools`](/scripts/graph-tools)).
- **Documentation Integrity Gate** – SlopCop markdown lint runs as part of `npm run safe:commit`, blocking hallucinated links before commit ([`scripts/slopcop/check-markdown-links.ts`](/scripts/slopcop/check-markdown-links.ts)).
- **Operational Playbooks** – Layer‑3/Layer‑4 MDMD catalogue every runtime/service artifact, keeping Copilot agents aligned with production architecture.

## Success Signals
- ≥95% of relevant ripple diagnostics appear within 5 seconds of a save (SC-001).
- Teams report ≥50% reduction in undocumented ripple fallout during pilot audits (SC-002).
- Layered MDMD stack stays synchronized with code through automated falsifiability suites and knowledge-feed ingestion checks.
- `npm run safe:commit` exits cleanly when markdown, asset (future), and symbol integrity checks report zero drift, proving the proxy-first discipline works in practice.

## Scope & Non-Goals
- **In Scope**: VS Code extension + language server, SQLite-backed knowledge graph, knowledge-feed ingestion, ripple diagnostics, MDMD traceability.
- **Out of Scope (current spec)**: IDE-agnostic clients, automated remediation of drift, CI/CD enforcement beyond local verify task, non-code assets such as binaries or images.

## Evolution Path
- **Markdown Integrity (present)**: Deterministic markdown link verification ("SlopCop") ensures Layer 1–4 MDMD serve as reliable proxies for impact analysis and spot LLM hallucinations early.
- **Docstring Bridges (near-term)**: Synchronise public symbol docstrings with Layer‑4 MDMD sections so workspace documentation stays live without leaving the repo.
- **Asset Path Awareness (near-term)**: Extend linting to HTML/CSS and config files that embed file paths so static assets participate in ripple guarantees.
- **LLM-Friendly Ripple Surfaces (mid-term)**: Standardise ASCII relationship diagrams, Markdown tables, and structured JSON exports so humans and copilots consume the same change-impact story.
- **Symbol Graph Grounding (long-term)**: Promote the same guarantees to code symbols, closing the loop between documentation proxies and the full pseudocode AST vision.

## Adoption Path
- **Stage 0 – Observe**: Ship read-only diagnostics, ripple reports, and ASCII/Markdown/JSON exports with zero documentation contracts required, so teams can trial the graph on any workspace slice.
- **Stage 1 – Guard**: Layer path-scoped profiles on top of existing folders to enable markdown/symbol/asset linting and graph coverage checks, keeping results informational until the profile opts into enforcement.
- **Stage 2 – Bridge**: Attach docstring, schema, or telemetry bridges to selected profiles; provide explicit preview/apply commands so drift fixes remain intentional and auditable.
- **Stage 3 – Sustain**: Treat profiles as contractual—safe-to-commit and CI block on failures, ASCII narratives document ripple health, and code + docs operate as a living AST that copilots and humans both trust.

## Open Questions
- What UX affordances best expose ripple metadata without overwhelming users? *(tracked in T042 roadmap)*
- How should we prioritize future feed integrations (e.g., LSIF/SCIP vs. GitLab Knowledge Graph) given current offline-first stance?
- When Copilot suggests a change, how do we feed ripple awareness back into the suggestion pipeline without blocking latency-critical paths?

## Implementation Touchpoints
- [Knowledge Feed Manager](../layer-4/knowledge-graph-ingestion/knowledgeFeedManager.mdmd.md) keeps external LSIF/SCIP feeds healthy so ripple answers stay accurate.
- [Link Inference Orchestrator](../layer-4/language-server-runtime/linkInferenceOrchestrator.mdmd.md) merges workspace heuristics, knowledge feeds, and LLM hints to deliver "what changed" context.
- [Diagnostics Tree View](../layer-4/extension-views/diagnosticsTree.mdmd.md) and [Export Diagnostics Command](../layer-4/extension-commands/exportDiagnostics.mdmd.md) surface ripple intelligence inside VS Code for implementers and reviewers.
- [SlopCop Markdown Audit](../layer-4/tooling/slopcopMarkdownLinks.mdmd.md) proves the proxy iteration, ensuring documentation integrity before expanding to assets and symbols.

## Code Anchors
- [`packages/server/src/main.ts`](../../packages/server/src/main.ts) bootstraps the language server runtime that interprets every change event.
- [`packages/server/src/runtime/changeProcessor.ts`](../../packages/server/src/runtime/changeProcessor.ts) coordinates inference results that power the cross-file impact promise.
- [`packages/server/src/features/diagnostics/publishCodeDiagnostics.ts`](../../packages/server/src/features/diagnostics/publishCodeDiagnostics.ts) and [`publishDocDiagnostics.ts`](../../packages/server/src/features/diagnostics/publishDocDiagnostics.ts) emit ripple alerts that uphold the "definitive answer" guarantee.
