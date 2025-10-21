# Link-Aware Diagnostics Vision

## Intent
- Deliver the definitive answer to "what other files will be impacted by this change?" for every artifact in a VS Code workspace. *(Ref: AI-Agent-Workspace/ChatHistory/2025-10-16.md)*
- Elevate GitHub Copilot from code-completion to project-wide partner by exposing cross-file ripple context directly inside the editor. *(Ref: specs/001-link-aware-diagnostics/spec.md)*
- Preserve architectural and documentation alignment by treating markdown knowledge as first-class citizens in the dependency graph. *(Ref: AI-Agent-Workspace/ChatHistory/2025-10-19.md)*
- Anchor future decisions to the curated user-intent census so stakeholder guidance stays visible even when autosummarization trims context. *(Ref: AI-Agent-Workspace/Notes/user-intent-census.md)*

## Target Personas
- **Implementers**: Engineers saving code files need immediate visibility into dependent modules before committing.
- **Writers & Architects**: Documentation owners editing Layer 1–3 markdown must know which implementation assets require review.
- **Leads & Reviewers**: Leads triage ripple alerts, assign follow-up, and close the loop once remediation is complete.

## Desired Outcomes
- Every save event answers three questions within seconds: triggering artifact, impacted artifacts (depth-aware), and remediation guidance.
- Documentation drift is surfaced with the same urgency as code regressions, preventing stale architecture narratives.
- Ripple metadata (relationship, depth, confidence, path) is explorable without leaving VS Code, empowering Copilot prompts with authoritative context.

## Guiding Principles
1. **Graph First** – Treat the knowledge graph as the source of truth; caches are disposable projections rebuildable on demand.
2. **Noise Discipline** – Diagnostics must respect hysteresis, batching, and acknowledgement workflows to avoid alert fatigue.
3. **Human + Copilot Symbiosis** – Surfaces should be equally legible to humans and consumable by Copilot prompt engineering.
4. **Falsifiability** – Every promised behaviour owns a repeatable test (unit, integration, or benchmark) guarding against silent regressions.

## Success Signals
- ≥95% of relevant ripple diagnostics appear within 5 seconds of a save (SC-001).
- Teams report ≥50% reduction in undocumented ripple fallout during pilot audits (SC-002).
- Layered MDMD stack stays synchronized with code through automated falsifiability suites and knowledge-feed ingestion checks.

## Scope & Non-Goals
- **In Scope**: VS Code extension + language server, SQLite-backed knowledge graph, knowledge-feed ingestion, ripple diagnostics, MDMD traceability.
- **Out of Scope (current spec)**: IDE-agnostic clients, automated remediation of drift, CI/CD enforcement beyond local verify task, non-code assets such as binaries or images.

## Open Questions
- What UX affordances best expose ripple metadata without overwhelming users? *(tracked in T042 roadmap)*
- How should we prioritize future feed integrations (e.g., LSIF/SCIP vs. GitLab Knowledge Graph) given current offline-first stance?
- When Copilot suggests a change, how do we feed ripple awareness back into the suggestion pipeline without blocking latency-critical paths?
