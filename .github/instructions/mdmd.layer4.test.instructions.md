---
applyTo: ".live-documentation/tests/**/*.mdmd.md"
---

# Test Live Documentation Rules

- Generated sections appear in the following order:
  1. `### Public Symbols` (exposed helpers/utilities within the test module, if any).
  2. `### Targets` — list each implementation Live Doc exercised by this test, including workspace-relative paths and symbol names when assertions reference specific APIs.
  3. `### Supporting Fixtures` — reference data files, mock servers, or helper modules the test relies on.
- Tests should not surface `Observed Evidence`; that association flows from implementation docs back to tests via the graph.
- The `### Notes` subsection of the authored block must explain the behavioural coverage goals (integration, acceptance, regression, etc.) to aid future triage.
- If a test intentionally leaves `### Targets` empty (e.g., scaffold in progress), include `_No targets recorded yet_` and add an escalation note in `### Notes` so linting can raise visibility.
- Prefer referencing related implementation Live Docs with workspace-relative markdown links so the graph captures bidirectional edges.
