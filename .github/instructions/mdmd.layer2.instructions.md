---
applyTo: ".mdmd/layer-2/**/*.mdmd.md"
---

# Layer 2 MDMD Conventions

Layer 2 documents are **unit-layer** records for requirements or work items.  They balance human-owned checklists with generated completion summaries so Layer 1 can roll up progress deterministically.

- Begin with the canonical metadata block (add `External Tracker:` when mirroring to Spec-Kit tasks or GitHub Issues):
  ```markdown
  ## Metadata
  - Layer: 2
  - Archetype: requirement|work-item
  - Live Doc ID: REQ-example-id
  ```
- Required section order:
  1. `# <Requirement Title>` (use the stable `REQ-…` identifier in the heading).
  2. `## Metadata` as above.
   3. `## Authored` containing:
     - `### Requirement` – list acceptance expectations as Markdown checkboxes (`- [ ]` / `- [x]`).  Each line should include concise wording so tooling can count completion.
     - `### Acceptance Criteria` – additional verification checkboxes (functional, non-functional, regression).  Keep the same checkbox syntax.
     - `### Evidence` – curated links to artefacts proving progress (testing architecture docs, logs, design notes).  Use bullet lists; avoid inline status phrases that drift.
     - Optional `### Integration` – enumerate the Spec-Kit tasks, GitHub Issues, or Azure DevOps items that track day-to-day execution (use plain-text IDs plus links where available).
     - Optional `### Notes` for durable context.
     - Optional `### Upstream` containing exactly one markdown link to the owning Layer 1 capability or release.
  4. `## Dependencies` – bullet list of Layer 3 architecture docs this requirement depends on.  Do not link directly to Layer 4.
  5. `## Generated` with the following headings when data exists:
     - `### Completion Snapshot` – counts of checked boxes (requirement vs acceptance criteria) or other deterministic rollups.
     - `### Linked Components` – machine-generated list of Layer 3 docs discovered from dependencies or traceability tooling.
     - `### Linked Evidence` – summarised artefacts automatically detected (latest benchmark report, CI log, etc.).  Leave `_No evidence recorded yet_` when empty.
- Keep all links workspace-relative.  If no evidence is available, note the gap in `### Evidence` and surface a placeholder in the generated block. External trackers should be referenced via their summary page (e.g., Spec-Kit markdown) rather than deep-linking to SaaS URLs when offline parity matters.
- Avoid referencing Git history directly inside authored sections; instead, capture commit evidence under `### Evidence` so tooling can keep the generated summaries clean.