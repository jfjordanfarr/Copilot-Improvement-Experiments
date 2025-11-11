---
applyTo: ".mdmd/layer-1/**/*.mdmd.md"
---

# Layer 1 MDMD Conventions

Layer 1 documents are **concept-layer** artefacts that should read like polished release notes or public roadmap statements.  Authored content leads; generated blocks provide lightweight rollups derived from linked Layer 2 requirements.

- Start every file with the canonical metadata block:
  ```markdown
  ## Metadata
  - Layer: 1
  - Archetype: capability|release|narrative
  - Live Doc ID: CAP-example-id
  ```
- Required section order:
  1. `# <Capability or Release Title>`.
  2. `## Metadata` as shown above.
  3. `## Authored` containing:
     - `### Intent` – concise promise or vision statement.
     - `### Signals` – curated success indicators (planned milestones, stakeholder commitments, externally facing KPIs).  Use prose or bullet lists; avoid inline metrics the generator cannot verify.
     - Optional `### Notes` for durable context.  Omit when empty.
  4. `## Generated` with the following headings when data exists:
     - `### Completion Snapshot` – deterministic counts derived from linked Layer 2 docs (for example, “Requirements satisfied: 3 / 4”).
     - `### Evidence Snapshot` – list of immutable artefacts (release blog, public demo link) discovered from the workspace or configured metadata.  Leave `_No evidence recorded yet_` when empty.
  5. `## Dependencies` – markdown list of direct Layer 2 requirement links.  This is the only required downward reference.
- Limit authored hyperlinks to Layer 2 or peer Layer 1 docs.  Do **not** link directly to Layer 3/4 artefacts; rollups should flow through the requirement layer.
- Keep identifiers stable (`CAP-…`) so tooling can correlate capabilities with requirements and architecture components.