# SCIPParser (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/knowledge/scipParser.ts`](../../../packages/server/src/features/knowledge/scipParser.ts)
- Tests: [`packages/server/src/features/knowledge/scipParser.test.ts`](../../../packages/server/src/features/knowledge/scipParser.test.ts)
- Upstream detector: [`feedFormatDetector.ts`](../../../packages/server/src/features/knowledge/feedFormatDetector.ts)
- Parent design: [Knowledge Graph Ingestion Architecture](../knowledge-graph-ingestion.mdmd.md)

## Responsibility
Normalize SCIP indexes produced by language analyzers into `ExternalSnapshot` objects. The parser emits code artifacts and dependency/reference links so the ingestion pipeline can merge SCIP intelligence with workspace-derived diagnostics.

## Key Concepts
- **SCIPIndex**: Structured JSON containing documents, occurrences, and symbols emitted by SCIP exporters.
- **Symbol roles**: Bit flags on occurrences used to differentiate definitions, write accesses, and plain references.
- **Language inference**: Fallback mapping from file extension to language when exporters omit the language field.

## Public API
- `class SCIPParser` with `parse(index: SCIPIndex): ExternalSnapshot`
- `parseSCIP(index, options): ExternalSnapshot` convenience wrapper

## Internal Flow
1. Iterate documents to create artifacts, normalizing URIs to `file://` and capturing metadata (feed ID, relative path, confidence).
2. Build a lookup table of definitions per symbol across documents.
3. Emit cross-document links when a reference occurrence targets a symbol defined elsewhere; mark writes as `depends_on`, reads as `references`.
4. Return an `ExternalSnapshot` labeled with the feed ID and annotated with SCIP metadata.

## Error Handling
- URI normalization is best effort; failures return the raw relative path so ingestion still proceeds.
- Confidence defaults to `0.95` but respects caller overrides for feeds with lower certainty.

## Observability Hooks
- No direct logging; calling infrastructure surfaces parser failures. Deterministic IDs make it easy to trace generated links.

## Integration Notes
- Only cross-document relationships generate links, keeping snapshots focused on actionable navigation edges.
- Tests exercise artifact creation, cross-file references, write-dependency classification, language inference, and metadata propagation.
- Designed for extension by adding new symbol role mappings or richer metadata without affecting current consumers.
