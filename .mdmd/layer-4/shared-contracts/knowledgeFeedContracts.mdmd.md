# Knowledge Feed Contracts (Layer 4)

## Source Mapping
- LSIF interfaces: [`packages/shared/src/contracts/lsif.ts`](../../../packages/shared/src/contracts/lsif.ts)
- SCIP interfaces: [`packages/shared/src/contracts/scip.ts`](../../../packages/shared/src/contracts/scip.ts)
- Consumers: [`feedFormatDetector.ts`](../../../packages/server/src/features/knowledge/feedFormatDetector.ts), [`lsifParser.ts`](../../../packages/server/src/features/knowledge/lsifParser.ts), [`scipParser.ts`](../../../packages/server/src/features/knowledge/scipParser.ts)

## Responsibility
Define strongly typed representations of LSIF and SCIP payloads so parsers and ingestion code can operate on structured data instead of loose JSON. Provides a single source of truth for vertex/edge labels, symbol metadata, and parsed index structures used while normalizing external knowledge feeds.

## Key Concepts
- **LSIF types**: Enumerations for vertex/edge labels plus `ParsedLSIFIndex`, a helper structure that groups parsed vertices and edges for downstream traversal.
- **SCIP types**: Metadata, document, occurrence, and symbol interfaces mirroring the SCIP JSON schema; includes enums for symbol roles/kinds.
- **Parsed indexes**: Maps that keep parsed LSIF/SCIP artifacts keyed by identifiers, speeding up lookup operations within parsers.

## Public API
- Exported TypeScript interfaces and enums for LSIF/SCIP structures (vertices, edges, documents, occurrences, symbol metadata, etc.).
- Aggregated `ParsedLSIFIndex` / `ParsedSCIPIndex` used internally by ingestion modules.

## Integration Notes
- Parsers rely on these definitions to guarantee type safety (e.g., `contains` edges include `inVs`, symbol roles use bitflags).
- Shared contracts are re-exported via `packages/shared/src/index.ts`, making them available to both server and extension code.
- When upstream specifications change, update these contracts first so TypeScript catches mismatches across the ingestion pipeline.
