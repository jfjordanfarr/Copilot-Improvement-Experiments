# Checklist: Live Documentation Evidence Waiver Policy

**Purpose**: Define the acceptable scenarios and documentation requirements when Live Documentation generated sections cannot populate evidence automatically.

## Waiver Preconditions
- [ ] Confirm analyzers and coverage bridges ran for the artifact (`npm run live-docs:generate`, coverage ingestors) and produced no actionable evidence.
- [ ] When a waiver is recorded, ensure the generated `Observed Evidence` block (if emitted) begins with `_No automated evidence found_` and a `<!-- evidence-waived -->` marker summarising the rationale.
- [ ] Ensure the authored `### Notes` section records the rationale, owner, and review date for the waiver.
- [ ] Capture a follow-up task or issue linking to the waiver entry when evidence work is deferred.

## Waiver Categories
- [ ] **Third-Party Shim** – Source file proxies behaviour into an external module; document external verification strategy or monitored upstream tests.
- [ ] **Legacy Debt** – Tests absent due to historical debt; include the backlog ID and signal priority in roadmap.
- [ ] **Non-Deterministic Output** – Evidence would produce flaky telemetry (e.g., time-dependent integration); outline the guardrails preventing regressions.
- [ ] **Manual QA** – Behaviour validated by manual QA or staging sign-off; link the runbook or checklist.
- [ ] **Tooling Gap** – Analyzer/coverage bridge lacks language support; add a benchmark/backlog task to expand coverage.

## Review & Expiry
- [ ] Waivers include an expiry checkpoint (date or release) after which they must be revalidated or removed.
- [ ] Safe-to-commit and CI pipelines surface waiver counts with owners for audit.
- [ ] Quarterly review process verifies waivers against test coverage dashboards and closes stale entries.

## Evidence of Compliance
- [ ] `tests/integration/live-docs/evidence.test.ts` exercises waiver annotations and ensures lint warns when prerequisites are missing.
- [ ] `reports/benchmarks/live-docs/waivers.json` (planned) tracks waiver trends across regeneration cycles.
- [ ] Safe-to-commit summary logs enumerate waiver IDs, owners, and expiry dates for reviewer sign-off.
