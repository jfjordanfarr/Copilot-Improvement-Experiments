title: "SlopCop Symbol Reference Audit"
# SlopCop Symbol Reference Audit (Layer 4)

## Source Mapping
- Placeholder utility: [`packages/shared/src/tooling/symbolReferences.ts`](/packages/shared/src/tooling/symbolReferences.ts)
- Placeholder unit test: [`packages/shared/src/tooling/symbolReferences.test.ts`](/packages/shared/src/tooling/symbolReferences.test.ts)

## Purpose
Track symbol-level orphans and stale references once the knowledge graph exposes a reliable symbol inventory. This document seeds the implementation surface so future work can connect SlopCop to the pseudocode AST directly, eventually surfacing missing exports, renamed symbols, or unreferenced Layer-4 docs.

## Current Status
- The shared utility currently returns an empty list, acting as a stub while symbol harvesting APIs are designed.
- Forthcoming iterations will load symbol edges from the graph snapshot and flag gaps between documentation, code, and knowledge feeds.

## Next Steps
- Integrate symbol graph queries into the shared utility once the server exposes neighbour listings for all symbols.
- Produce fixtures that mimic workspace snapshots with intentionally orphaned symbols.
- Wire a dedicated CLI (`scripts/slopcop/check-symbols.ts`) once detection logic stabilises, then add it to `npm run safe:commit` alongside other SlopCop gates.
