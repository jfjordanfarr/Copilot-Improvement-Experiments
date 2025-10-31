# SCIP Parser

## Metadata
- Layer: 4
- Implementation ID: IMP-213
- Code Path: [`packages/server/src/features/knowledge/scipParser.ts`](../../../packages/server/src/features/knowledge/scipParser.ts)
- Exports: SCIPParserOptions, SCIPParser, parseSCIP

## Purpose
Convert SCIP indexes into external snapshots so the knowledge graph can ingest language-analyser output alongside workspace-derived intelligence.
- Normalise document URIs to `file://` paths rooted at the workspace.
- Emit artifacts and cross-document links for symbol definitions and references.
- Preserve feed metadata and confidence scores for auditing.

## Public Symbols

### SCIPParserOptions
Configuration passed to the parser—workspace root, feed ID, optional confidence override—used for URI normalisation and metadata labelling.

### SCIPParser
Parser class that traverses SCIP documents, collects artifacts, maps symbol definitions, and emits relationship edges based on reference occurrences.

### parseSCIP
Convenience wrapper that instantiates `SCIPParser`, performs parsing, and returns the resulting snapshot in a single call.

## Collaborators
- [`packages/server/src/features/knowledge/feedFormatDetector.ts`](../../../packages/server/src/features/knowledge/feedFormatDetector.ts) invokes the parser when a feed file is classified as SCIP.
- [`packages/shared/src/contracts/scip.ts`](../../../packages/shared/src/contracts/scip.ts) provides type definitions that describe SCIP payload structures.
- [`packages/shared/src/db/graphStore.ts`](../../../packages/shared/src/db/graphStore.ts) ultimately receives the emitted snapshot through `KnowledgeGraphIngestor`.

## Linked Components
- [COMP-005 – Knowledge Graph Ingestion](../../layer-3/knowledge-graph-ingestion.mdmd.md#imp213-scipparser)

## Evidence
- Unit tests: [`packages/server/src/features/knowledge/scipParser.test.ts`](../../../packages/server/src/features/knowledge/scipParser.test.ts) verify artifact extraction, cross-file link generation, write/read classification, and confidence propagation.
- Integration coverage: US5 ingestion suites include SCIP fixtures that exercise parser + ingestor wiring end to end.
- Manual smoke: running `npm run graph:snapshot` in a workspace with `.scip` fixtures confirms parser output persists into the graph without errors.

## Operational Notes
- Cross-document references become `depends_on` for write occurrences and `references` for reads; same-document references are ignored to reduce noise.
- URI normalisation tolerates failures by falling back to relative paths, keeping ingestion resilient to unusual data.
- Confidence defaults to `0.95` but may be overridden per feed to reflect analyser certainty or experimental mode.
