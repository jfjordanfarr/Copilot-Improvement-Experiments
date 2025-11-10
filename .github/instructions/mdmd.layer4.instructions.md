---
applyTo: ".mdmd/layer-4/**/*.mdmd.md"
---

# Layer 4 Live Documentation Base Rules

- Layer‑4 files are **Live Documentation artifacts**: every file mirrors exactly one source asset (code, test, or binary) and contains an authored preamble followed by machine-generated sections.
- Canonical layout:
  1. `# <Title>` — title matches the source artifact name; avoid duplicating the extension.
  2. `## Metadata` — short bullet list containing at least `Layer: 4`, `Archetype: implementation|test|asset|stub`, `Code Path: <workspace-relative path>`, and `Live Doc ID: LD-XXXX` (stable identifier for provenance).
  3. `## Authored` — human-maintained portion with the fixed subsection order `### Description`, `### Purpose`, `### Notes`. Omit subsections only when legitimately empty and leave a placeholder sentence so tooling can diff safely.
  4. `## Generated` — tooling-maintained portion. Never edit content between the generated markers.
- Generated boundaries **must** use HTML comments so automation can detect safe rewrite regions:
  - Start marker: `<!-- LIVE-DOC:BEGIN <Section Name> -->`
  - End marker: `<!-- LIVE-DOC:END <Section Name> -->`
  - Place markers directly above/below the related heading, e.g.:
    ```markdown
    <!-- LIVE-DOC:BEGIN Public Symbols -->
    ### Public Symbols
    ...auto-generated content...
    <!-- LIVE-DOC:END Public Symbols -->
    ```
- All generated sections appear after the `## Generated` heading and before any optional appendix content. Tooling may replace everything between paired markers during regeneration; keep manual edits out of those blocks.
- Required generated sections for every archetype: `### Public Symbols` and `### Dependencies`.
- Additional generated sections depend on archetype-specific instructions (see `mdmd.layer4.implementation.instructions.md`, `mdmd.layer4.test.instructions.md`, `mdmd.layer4.asset.instructions.md`). When multiple generated sections are present, order them alphabetically unless overridden by the archetype rules.
- Optional appendix content (e.g., `## Appendix`) belongs after the generated block and is human-owned; avoid embedding generated data there.
- Use workspace-relative markdown links only; absolute or protocol links require an explicit waiver. Header anchors must follow the workspace slug dialect (default GitHub) declared in tooling configuration so generated docs remain wiki-friendly.
- If a generated section would otherwise be empty, include an explicit placeholder such as `_No data available_` so linting can flag the condition. Suppressions must be noted in the `### Notes` subsection of the authored block.
- Keep formatting ASCII-only unless the source asset mandates otherwise (e.g., unicode in code identifiers). Ensure trailing whitespace within generated blocks is trimmed to aid diff stability.