---
applyTo: ".live-documentation/implementation/**/*.mdmd.md"
---

# Implementation Live Documentation Rules

- Generated sections appear in the following order when present:
  1. `### Public Symbols`
  2. `### Dependencies`
  3. `### Observed Evidence` (emitted only when automated evidence or a recorded waiver exists)
  4. Any optional metadata sections (e.g., `### Churn Metrics`, `### Referenced By`) appended alphabetically after `Observed Evidence`.
- `Observed Evidence`, when emitted, lists every test Live Doc that references this implementation. If no automated evidence exists, the block begins with `_No automated evidence found_` plus an `<!-- evidence-waived: reason -->` comment, and the authored `### Notes` section should record the waiver rationale.
- Lint guards validate the structure of `Observed Evidence` when the section is present; missing sections are acceptable for implementations without recorded evidence.
- Within `Public Symbols`, render each export as a bullet list item containing the symbol signature, docstring summary (if available), and a workspace-relative link to the source line.
- `Dependencies` enumerates first-order outbound relationships, grouping entries by file path. Include symbol anchors when known to keep graph edges precise.
- Implementation docs may include an optional human-owned appendix after the generated block for callouts such as TODOs or migration notes; avoid mixing manual notes inside generated sections.
