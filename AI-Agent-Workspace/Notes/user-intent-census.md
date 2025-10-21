# User Intent Census – Link-Aware Diagnostics

Tracking the explicit guidance provided by `jfjordanfarr` across Dev Days 1–5. Each entry references the source chat log and line range so future agents can reconstruct the full context during autosummarization windows.

## 2025-10-16 (Dev Day 1)
- `2025-10-16.md:L1-L32` — Mandate: build a system that raises IntelliSense-style diagnostics between linked markdown layers and implementation files; adopt the four-layer MDMD documentation model.
- `L160-L213` — Request deep research on VS Code vs. LSP backends and polyglot graph strategies; approves pursuing Language Server architecture despite extension tooling friction.
- `L246-L344` — Emphasizes riding existing language server improvements, leveraging parser tiers, and prioritizing provenance/confidence in the graph.
- `L378-L517` — Runs full SpecKit bootstrap (`/speckit.specify`, `.plan`, `.tasks`, `.analyze`); expects docs to stay authoritative and updated.
- `L693-L716` — Executes `/speckit.clarify`; chooses option **C** (block diagnostics until user explicitly selects an LLM provider) for responsible AI consent.
- `L1005-L1146` — Redirects link discovery toward VS Code’s workspace indexing model; insists on inference-first graph rebuilds, no manual front matter.
- `L1707-L1816` — Clarifies AST benchmark use for development-time verification; reaffirms MDMD layering per implementation artifacts.
- `L2177-L2765` — Grants high-agency execution of SpecKit tasks T022–T038, stressing continuous checklist audits and documentation alignment.

## 2025-10-17 (Dev Day 2)
- `2025-10-17.md:L1-L140` — Demands rigorous daily summaries (10:1 compression, turn-by-turn, line ranges) to preserve auditability; verifies LSP decision provenance.
- `L164-L376` — Orders `/speckit.implement` continuation (T026 onward); expects Copilot to own lint/test setup and resolve Node tooling friction.
- `L455-L870` — Drives sequential completion of T028–T032 with SpecKit hydration, integration test seeding, and ongoing doc updates.
- `L1065-L1310` — Coordinates git hygiene, manual cleanup of tool artifacts, and staged commits before machine handoff; insists lint noise be addressed at the configuration level.

## 2025-10-19 (Dev Day 3)
- `2025-10-19.md:L1-L210` — Repeats summary mandate plus git correlation; praises adherence and reinforces summary-as-source-of-truth credo.
- `L239-L808` — Pushes for hysteresis implementation (T033) and full integration harness; reports manual onboarding blockers that must be automated.
- `L1110-L1613` — Flags communication gaps; directs deterministic onboarding, readiness commands, and resilience against integration host crashes.
- `L2094-L2216` — After commit, reorients product focus toward code-to-code ripple detection before doc drift; mandates spec realignment (US1 vs. US2) and successive T034–T038 delivery.
- `L2399-L2765` — Offers manual file deletions when tooling falls short; expects GraphStore stubs, automation of better-sqlite3 rebuilds, and commits once suites are green.

## 2025-10-20 (Dev Day 4)
- `2025-10-20.md:L1-L236` — Starts day with recap + commit provenance updates; authorizes T035 once spec hydration reread.
- `L642-L962` — Greenlights documentation-first practice for new capabilities; approves MDMD layering with explicit links to SpecKit sections.
- `L1690-L1804` — Reinforces 1:1 mapping between MDMD layers and implementation files; demands double-checks after autosummarization cycles.
- `L2056-L2392` — Validates knowledge graph ingestion work, ensures doc cleanup, and maintains policy of committing chat history for audit trails.
- `L2487-L2911` — Chooses Option A (continue implementation), instructs manual assistance for long-file edits, and ensures runtime modularization despite tooling limitations.
- `L3651-L4476` — Updates Copilot instructions regarding large files; authorizes continued T041 execution and expects commits to include chat logs.

## 2025-10-21 (Dev Day 5)
- `2025-10-21.md:L1-L86` — Opens with summary request for 10/20 and demands concrete planning beyond prior “Next Phase” bullets.
- `L81-L752` — Embeds previous summaries in chat for persistent grounding; approves implementation of ripple UX/falsifiability remediation.
- `L987-L1405` — Requests lint/test reruns, rebuilds, prioritization among options (Implementation vs. Falsifiability vs. Documentation); selects **Option B** for falsifiability focus.
- `L1411-L1470` — Specifies three falsifiability scenarios (broken markdown links, false positive guardrails, metaprogramming transforms); emphasizes prompt-cost model to encourage high-agency check-ins.
- `L1470-L1854` — Authorizes creation of falsifiability MDMD docs, new integration suites (US3–US5), and staging/committing of related fixtures.
- `L1854-L1923` — Directs transition toward MDMD crystallization: bottom-up sweep completion followed by top-down census of every `jfjordanfarr:` prompt.

## Usage Notes
- Treat this census as the canonical index of stakeholder intent; cross-link relevant bullets into Layer-1/Layer-2 MDMD documents as needed.
- When future autosummarization truncates context, rehydrate by locating the referenced `ChatHistory/YYYY-MM-DD.md` line ranges.
- Update this file when new design-shaping prompts appear so MDMD layers remain anchored to explicit guidance.
