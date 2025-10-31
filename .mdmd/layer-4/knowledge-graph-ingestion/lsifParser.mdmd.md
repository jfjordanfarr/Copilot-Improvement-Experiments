# LSIF Parser

## Metadata
- Layer: 4
- Implementation ID: IMP-214
- Code Path: [`packages/server/src/features/knowledge/lsifParser.ts`](../../../packages/server/src/features/knowledge/lsifParser.ts)
- Exports: LSIFParserOptions, LSIFParser, parseLSIF

## Purpose
Convert LSIF newline-delimited JSON exports into `ExternalSnapshot` artifacts and links so the workspace graph understands language-server output.
- Index LSIF vertices/edges to reconstruct documents and symbol relationships.
- Normalise URIs relative to the workspace root to maintain deterministic artifact identities.
- Emit relationship edges that capture cross-document dependencies for diagnostics.

## Public Symbols

### LSIFParserOptions
Configuration passed to the parser containing project root, feed identifier, and optional confidence override used during URI normalisation and metadata labelling.

### LSIFParser
Parser class that indexes vertices, builds artifact/link tables, and outputs an external snapshot ready for ingestion.

### parseLSIF
Convenience helper that instantiates `LSIFParser`, handles parsing, and returns the resulting snapshot in a single call.

## Collaborators
- [`packages/server/src/features/knowledge/feedFormatDetector.ts`](../../../packages/server/src/features/knowledge/feedFormatDetector.ts) routes LSIF files to the parser after format detection.
- [`packages/shared/src/contracts/lsif.ts`](../../../packages/shared/src/contracts/lsif.ts) provides structural types for LSIF payloads.
- [`packages/server/src/features/knowledge/knowledgeGraphIngestor.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.ts) consumes the emitted snapshots and persists artifacts/links into the graph store.

## Linked Components
- [COMP-005 – Knowledge Graph Ingestion](../../layer-3/knowledge-graph-ingestion.mdmd.md#imp214-lsifparser)

## Evidence
- Unit tests: [`packages/server/src/features/knowledge/lsifParser.test.ts`](../../../packages/server/src/features/knowledge/lsifParser.test.ts) cover artifact extraction, link reconstruction, metadata propagation, and resilience to malformed lines.
- Integration coverage: US5 ingestion suites ship LSIF fixtures that verify end-to-end ingestion behaviour.
- Manual smoke: `npm run graph:snapshot` with LSIF inputs logs `[workspace-index]` seed counts and confirms parser output persists without errors.

## Operational Notes
- Malformed lines are skipped with warnings, preventing a single corrupt vertex from halting ingestion.
- URI normalisation falls back to original inputs when conversion fails, keeping snapshots usable.
- Snapshot IDs adopt `lsif-` prefixes for traceability; deduplication remains an upstream responsibility.
