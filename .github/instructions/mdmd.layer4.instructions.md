---
applyTo: ".mdmd/layer-4/**/*.mdmd.md"
---

# Layer 4 Live Documentation Base Rules

Default storage for generated Layer‑4 Live Docs is `/.live-documentation/source/`; adjust configuration only when adopters need a different mirror root.

- Layer 4 files are **Live Documentation mirrors**: every markdown entry represents exactly one source asset (implementation, test, fixture, or asset) and preserves authored context while exposing generated program facts.
- Canonical layout:
  1. `# <Title>` — use the source artifact name (for example, `packages/shared/src/live-docs/markdown.ts`).
  2. `## Metadata` — bullet list containing at minimum `Layer: 4`, `Archetype: implementation|test|asset|stub`, `Code Path: <workspace-relative path>`, `Live Doc ID: LD-…`, and `Generated At: <ISO timestamp>` if emitted by the tool.
  3. `## Authored` — fixed subsection order:
     - `### Purpose` (required) – justify why the asset exists.
     - `### Notes` (optional) – durable insights; omit the heading if there is nothing to add.
  4. `## Generated` — tooling replaces content between paired markers; never hand-edit these regions.
- Generated boundaries **must** use the HTML comment markers already standardised by the generator:
  ```markdown
  <!-- LIVE-DOC:BEGIN Public Symbols -->
  ### Public Symbols
  ...auto-generated content...
  <!-- LIVE-DOC:END Public Symbols -->
  ```
- Required generated sections for every archetype: `### Public Symbols` and `### Dependencies`.  Additional sections (for example, `### Observed Evidence`, `### Targets`, `### Supporting Fixtures`) are controlled by archetype-specific instructions (`mdmd.layer4.*.instructions.md`).  When multiple sections are present, follow the order defined by those files.
- The generator may prepend a provenance marker (`<!-- LIVE-DOC:PROVENANCE … -->`) before the first generated section; keep it intact.
- Optional human-owned appendices must appear **after** the generated block.  Do not mix manual notes inside generated sections.
- Use workspace-relative Markdown links throughout the document so tooling can resolve references offline.
- When a generated section has no data, emit `_No data recorded yet_` (or a similarly explicit placeholder).  Mention any intentional waivers in `### Notes`.
- Keep content ASCII unless the underlying artifact demands Unicode (for example, identifiers).  Trim trailing whitespace inside generated sections to minimise diff churn.