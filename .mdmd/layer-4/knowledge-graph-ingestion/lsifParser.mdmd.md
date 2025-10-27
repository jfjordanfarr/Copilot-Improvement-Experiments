# LSIFParser (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/knowledge/lsifParser.ts`](../../../packages/server/src/features/knowledge/lsifParser.ts)
- Tests: [`packages/server/src/features/knowledge/lsifParser.test.ts`](../../../packages/server/src/features/knowledge/lsifParser.test.ts)
- Upstream detector: [`feedFormatDetector.ts`](../../../packages/server/src/features/knowledge/feedFormatDetector.ts)
- Parent design: [Knowledge Graph Ingestion Architecture](../../layer-3/knowledge-graph-ingestion.mdmd.md)

## Exported Symbols

### `LSIFParserOptions`
Configuration for the parser (project root, feed id, optional confidence) so URIs normalise correctly and metadata carries deterministic provenance.

### `LSIFParser`
Stateful parser class that indexes LSIF vertices/edges, extracts artifacts/links, and emits an `ExternalSnapshot`.

### `parseLSIF`
Convenience wrapper that instantiates `LSIFParser` and returns the parsed snapshot in one call.

## Responsibility
Translate LSIF newline-delimited JSON dumps into the project-wide `ExternalSnapshot` format. The parser lifts documents into artifacts and builds cross-file reference links, allowing the ingestion pipeline to fold LSIF exports into the link-aware diagnostics graph.

## Internal Flow
1. Split the incoming LSIF dump into lines and build a typed index of vertices/edges (`buildIndex`).
2. Convert document vertices into artifacts, normalizing URIs relative to the workspace root and attaching metadata.
3. Walk definition/reference edges to construct `references` links between documents, skipping same-document relationships.
4. Return an `ExternalSnapshot` with metadata describing LSIF as the source and tagging each item with the feed ID.

## Error Handling
- Malformed lines are skipped with a console warning, preventing a single bad vertex from aborting the parse.
- URI normalization falls back to the original string when conversion fails, ensuring the snapshot stays usable.

## Observability Hooks
- Warnings for malformed LSIF lines surface during parsing, aiding feed debugging without halting ingestion.

## Integration Notes
- Invoked by `feedFormatDetector.parseFeedFile` when the detector classifies input as LSIF.
- Tests cover artifact extraction, link reconstruction, metadata population, URI normalization, and resilience to invalid lines.
- Snapshot IDs use a timestamped prefix (`lsif-${Date.now()}`), making deduplication an upstream concern when needed.
