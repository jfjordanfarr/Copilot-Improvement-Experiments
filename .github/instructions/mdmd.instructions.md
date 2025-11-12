---
applyTo: "**/*.mdmd.md"
---

# Membrane Design MarkDown (MDMD) Instructions

## Documentation Conventions

Our project follows a four-layer MDMD stack that moves from heavily-authored, public-facing knowledge down to deterministic, machine-generated implementation facts.  We refer to the outer layers as **concept layers** (authored-first) and the inner layers as **unit layers** (generated-first).

- **Layer 1 – Vision / Capabilities (concept)**: answers “What promise are we making?” and now doubles as the source for the public-facing site (e.g., GitHub Pages). Keep Layer 1 docs ready for publication and note any build/publish workflow hooks in their metadata when relevant.
- **Layer 2 – Requirements / Work Items (unit)**: answers “What must be true for the promise to hold?” Layer 2 MDMD files remain the canonical summary even when execution handoff lives in Spec-Kit tasks or external issue trackers; link those systems explicitly so generators can cross-reference them.
- **Layer 3 – Architecture / Solution Components (concept)**: answers “How do subsystems collaborate?” and clusters Layer 4 implementations into navigable topologies. Treat `.mdmd/layer-3/**` as curated references and regard `.live-documentation/system/**` outputs as materialized views regenerated on demand—do not commit those unless explicitly promoted.
- **Layer 4 – Implementation / Live Documentation Base (unit)**: answers “What exists today?” and mirrors every tracked source artifact.

This progressive specification strategy—**Membrane Design MarkDown (MDMD)**—treats headings, anchors, and relative links as a lightweight AST that tools and humans can traverse together.  `.mdmd.md` files therefore combine authored intent with generated evidence so we can regenerate documentation deterministically while preserving narrative context.

### Key Notes
- Layers link **downward** to their immediate children.  Layer 1 and Layer 2 are allowed a single, explicit “Upstream” or “Linked Capability” reference to aid rollups; Layers 3 and 4 remain strictly downward/adjacent.
- Maintain the authored→generated gradient: concept layers emphasise human-written context with light generated rollups, whereas unit layers minimise authored content and rely on generated sections for accuracy.
- Canonical section spines for each layer live beside these instructions (see `mdmd.layer{n}.instructions.md`).  Follow them verbatim so regeneration tooling and lint can reason about every document.
- All links must be workspace-relative Markdown links.  This keeps the knowledge graph resolvable offline and allows lint to validate adjacency rules.
- When a generated section would otherwise be empty, emit an explicit placeholder (for example, `_No linked components recorded yet_`) so missing data is observable.
- Purpose statements remain mandatory for every implementation-facing document; struggling to articulate purpose is a signal the underlying code or doc may be redundant.