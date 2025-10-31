# Link-Aware Diagnostics Vision

## Metadata
- Layer: 1
- Capability IDs: CAP-001, CAP-002, CAP-003, CAP-004, CAP-005

## Capabilities

### CAP-001 – Workspace Local Ripple Lens
Deliver workspace-local understanding of change impact across code, documentation, and tooling without relying on external services ([AI-Agent-Workspace/ChatHistory/2025-10-16.md](../../AI-Agent-Workspace/ChatHistory/2025-10-16.md)).

### CAP-002 – Copilot Partnership
Elevate GitHub Copilot from code completion to project partner by exposing cross-file ripple context inside the editor ([specs/001-link-aware-diagnostics/spec.md](../../specs/001-link-aware-diagnostics/spec.md)).

### CAP-003 – Dual Channel Narratives
Render ripple intelligence in formats humans and LLMs both digest, including markdown narratives, ASCII diagrams, and structured JSON ([AI-Agent-Workspace/ChatHistory/2025-10-29.md](../../AI-Agent-Workspace/ChatHistory/2025-10-29.md)).

### CAP-004 – Traceable Knowledge Graph
Preserve architectural and documentation alignment by treating markdown knowledge as first-class citizens in the dependency graph ([AI-Agent-Workspace/ChatHistory/2025-10-19.md](../../AI-Agent-Workspace/ChatHistory/2025-10-19.md)).

### CAP-005 – Stakeholder Memory
Anchor future decisions to the curated user-intent census so stakeholder guidance stays visible even after autosummarization ([AI-Agent-Workspace/Notes/user-intent-census.md](../../AI-Agent-Workspace/Notes/user-intent-census.md)).

## Desired Outcomes
- Every save event answers three questions within seconds: triggering artefact, impacted artefacts (depth-aware), and remediation guidance.
- Documentation drift is surfaced with the same urgency as code regressions, preventing stale architecture narratives.
- Ripple metadata (relationship, depth, confidence, path) is explorable without leaving VS Code, empowering Copilot prompts with authoritative context and ASCII or markdown diagrams.
- Workspace linting treats markdown, code, and symbol links as the same continuum, starting with deterministic link proof and growing into full pseudocode AST validation.

## Downstream Requirements

### REQ-001 – Ripple Observability Foundations
[FR-001–FR-013](../../specs/001-link-aware-diagnostics/spec.md#functional-requirements) supports CAP-001 and CAP-002.

### REQ-020 – Documentation Bridges and LLM Surfaces
[FR-020–FR-021](../../specs/001-link-aware-diagnostics/spec.md#functional-requirements) supports CAP-003 and CAP-004.

### REQ-030 – Adoption Profiles
T07x–T09x roadmap milestones in [product-roadmap.mdmd.md](../layer-2/product-roadmap.mdmd.md) support CAP-004 and CAP-005.

### REQ-040 – Symbol Correctness Profiles
T10x–T11x roadmap milestones in [product-roadmap.mdmd.md](../layer-2/product-roadmap.mdmd.md#req040-symbol-correctness-profiles-in-design) support CAP-003 and CAP-004.

## Success Signals
- ≥95% of relevant ripple diagnostics appear within 5 seconds of a save (SC-001).
- Teams report ≥50% reduction in undocumented ripple fallout during pilot audits (SC-002).
- Layered MDMD stack stays synchronised with code through automated falsifiability suites and knowledge-feed ingestion checks.
- `npm run safe:commit` exits cleanly when markdown, asset, and symbol integrity checks report zero drift, proving proxy-first discipline in practice.

## Evidence
- US1–US5 integration suites validate ripple diagnostics for code, documentation, acknowledgement, scope collision, and transforms ([tests/integration](/tests/integration)).
- Graph snapshot and audit CLIs keep deterministic caches and coverage guarantees ([scripts/graph-tools](/scripts/graph-tools)).
- SlopCop markdown lint runs inside the safe-to-commit gate, blocking hallucinated links before commit ([scripts/slopcop/check-markdown-links.ts](/scripts/slopcop/check-markdown-links.ts)).
- Layer 3 and 4 MDMD catalogues provide live operational playbooks for extension runtime, ingestion pipelines, and diagnostics surfaces.

## Target Personas
- **Implementers**: engineers saving code files need immediate visibility into dependent modules before committing.
- **Writers and Architects**: documentation owners editing Layer 1–3 markdown must know which implementation assets require review.
- **Leads and Reviewers**: leads triage ripple alerts, assign follow-up, and close the loop once remediation is complete.

## Guiding Principles
1. **Graph First** - treat the knowledge graph as the source of truth; caches stay disposable projections rebuildable on demand.
2. **Noise Discipline** - diagnostics respect hysteresis, batching, and acknowledgement workflows to avoid alert fatigue.
3. **Human plus Copilot Symbiosis** - surfaces stay legible to humans and LLM prompts, favouring markdown tables and ASCII diagrams over bespoke visuals.
4. **Workspace Local First** - guarantees derive from repository artefacts; external services remain optional accelerators.
5. **Falsifiability** - every promised behaviour owns a repeatable test (unit, integration, or benchmark) guarding against silent regressions.
6. **Proxy Iterations** - use high-signal proxies such as markdown links and asset paths before expanding to symbol-level guarantees.

## Scope and Non Goals
- **In scope**: VS Code extension plus language server, SQLite-backed knowledge graph, knowledge-feed ingestion, ripple diagnostics, MDMD traceability.
- **Out of scope (current spec)**: IDE-agnostic clients, automated remediation, CI enforcement beyond the local verify task, non-code binary assets.

## Evolution Path
- **Markdown integrity (present)**: deterministic markdown link verification keeps documentation trustworthy and flags hallucinations early.
- **Docstring bridges (near term)**: synchronise public symbol docstrings with Layer 4 MDMD sections so documentation stays live without leaving the repo.
- **Asset path awareness (near term)**: extend linting to HTML, CSS, and config references so static assets participate in ripple guarantees.
- **LLM-friendly ripple surfaces (mid term)**: standardise ASCII diagrams, markdown tables, and structured JSON exports for humans and copilots alike.
- **Symbol graph grounding (long term)**: promote these guarantees to code symbols, closing the loop between documentation proxies and a projectwide pseudocode AST.

## Adoption Path
- **Stage 0 - Observe**: ship read-only diagnostics, ripple reports, and ASCII or markdown exports with zero documentation contracts required so teams can trial the graph on any workspace slice.
- **Stage 1 - Guard**: layer path-scoped profiles over folders to enable informational lint and coverage checks until enforcement is chosen.
- **Stage 2 - Bridge**: attach docstring, schema, or telemetry bridges to selected profiles and provide preview or apply commands so drift fixes remain intentional.
- **Stage 3 - Sustain**: treat profiles as contractual; safe-to-commit and CI block on failures while ASCII narratives document ripple health for copilots and humans.

## Open Questions
- What UX affordances best expose ripple metadata without overwhelming users? (Tracked in T042 roadmap.)
- How should we prioritise future feed integrations such as LSIF, SCIP, or GitLab knowledge graphs under the offline-first stance?
- When Copilot suggests a change, how do we feed ripple awareness back into the suggestion pipeline without impacting latency?

## Implementation Touchpoints
- [Knowledge Feed Manager](../layer-4/knowledge-graph-ingestion/knowledgeFeedManager.mdmd.md) keeps external LSIF and SCIP feeds healthy so ripple answers stay accurate.
- [Link Inference Orchestrator](../layer-4/language-server-runtime/linkInferenceOrchestrator.mdmd.md) merges workspace heuristics, knowledge feeds, and LLM hints to deliver change context.
- [Diagnostics Tree View](../layer-4/extension-views/diagnosticsTree.mdmd.md) and [Export Diagnostics Command](../layer-4/extension-commands/exportDiagnostics.mdmd.md) surface ripple intelligence inside VS Code.
- [SlopCop Markdown Audit](../layer-4/tooling/slopcopMarkdownLinks.mdmd.md) proves the proxy iteration, ensuring documentation integrity before expanding to assets and symbols.

## Code Anchors
- [`packages/server/src/main.ts`](../../packages/server/src/main.ts) bootstraps the language server runtime that interprets every change event.
- [`packages/server/src/runtime/changeProcessor.ts`](../../packages/server/src/runtime/changeProcessor.ts) coordinates inference results that power the cross-file impact promise.
- [`packages/server/src/features/diagnostics/publishCodeDiagnostics.ts`](../../packages/server/src/features/diagnostics/publishCodeDiagnostics.ts) and [`publishDocDiagnostics.ts`](../../packages/server/src/features/diagnostics/publishDocDiagnostics.ts) emit ripple alerts that uphold the definitive answer guarantee.
