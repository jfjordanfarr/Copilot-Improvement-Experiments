---
applyTo: ".mdmd/layer-3/**/*.mdmd.md"
---

# Layer 3 MDMD Conventions

Layer 3 documents stored under `.mdmd/layer-3/` are the **permanent authored references** for how subsystems collaborate.  They synthesize insights from Layer 4 Live Docs and on-demand System materializations, but the markdown in this tree is curated by humans.  System views generated under `.live-documentation/system/` remain **ephemeral** and should never be committed unless explicitly promoted; treat them as scratch artifacts that inform the Layer 3 write‑ups.

- Start with the canonical metadata block:
  ```markdown
  ## Metadata
  - Layer: 3
  - Archetype: component|interaction|data-model|workflow|integration|testing
  - Live Doc ID: COMP-example-id
  ```
- Required section order:
  1. `# <Component Title>` (include the stable `COMP-…`, `INT-…`, etc. identifier in the heading).
  2. `## Metadata` as above.
  3. `## Authored` containing:
     - `### Purpose` – why this architecture slice exists (include RequirementID references when relevant).
     - `### Notes` – durable context, operational nuance, or waivers.  Omit if empty.
     - `### Strategy` (optional) – upcoming changes, test harness splits, or deployment guidance.
  4. `## System References` – cite the Live Documentation artifacts that justify the authored narrative:
     - `### Components` – bullet list of relevant Layer 4 Live Doc links or `npm run live-docs:system` outputs.  Reference the CLI invocation rather than pasting generated content.
     - `### Topology` (optional) – include Mermaid diagrams only when they are manually curated summaries.  Link each node back to the corresponding Live Doc; note which System CLI snapshot informed the diagram.
  5. `## Evidence` (optional) – reference integration suites, benchmarks, or temp CLIs that validate the architecture.
- Do not commit raw `.live-documentation/system/**` files.  Instead, record the command and timestamp that produced the snapshot so readers can regenerate it locally.
- When Layer 3 docs must link to implementation details, point to Stage‑0 Live Docs under `/.live-documentation/source/…` instead of raw source files.  This keeps traceability intact even as implementation files move.
- Keep identifiers stable to avoid churn in cross-layer references.