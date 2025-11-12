---
applyTo: ".mdmd/layer-3/**/*.mdmd.md"
---

# Layer 3 MDMD Conventions

> Layer 3 documents stored under `.mdmd/layer-3/` capture authored reference architecture. System views generated under `.live-documentation/system/` follow the same structural cues but are treated as ephemeral materialized outputs—produce them with the CLI, tag them with `live-docs:materialized` headers when promotion is intentional, and avoid committing transient files.

Layer 3 documents are **concept-layer** architecture views generated from sets of Layer 4 Live Docs.  Keep authored prose minimal and allow tooling to describe the concrete footprint.

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
  4. `## Generated` with mandatory subsections:
     - `### Components` – tooling-generated bullet list of constituent Layer 4 Live Doc links.  Each entry should point to the Stage‑0 document.
     - `### Topology` – Mermaid diagram distilled from dependency data.  Use `click` directives so each node links back to the relevant Live Doc.
  - Optional additional generated analytics (for example, co-activation insights) may appear after `Topology` when tooling emits them.
- Do not link directly to raw source files; always reference Layer 4 Live Docs so traceability remains intact.
- Architecture docs may reference multiple Layer 2 requirements, but those links belong in `### Purpose` or `### Notes` (authored) rather than in generated sections. When documenting CLI materialized views, point to the command (`npm run live-docs:system`) and fixture workspace instead of committing the generated markdown.
- Keep identifiers stable to avoid churn in cross-layer references.