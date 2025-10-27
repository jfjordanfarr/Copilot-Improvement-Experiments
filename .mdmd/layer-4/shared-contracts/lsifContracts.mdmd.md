# LSIF Contracts (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/contracts/lsif.ts`](../../../packages/shared/src/contracts/lsif.ts)
- Parent design: [Knowledge Graph Ingestion Architecture](../../layer-3/knowledge-graph-ingestion.mdmd.md)

## Exported Symbols

#### LSIFVertexLabel
`LSIFVertexLabel` enumerates the supported LSIF vertex kinds expected in imported indexes.

#### LSIFEdgeLabel
`LSIFEdgeLabel` enumerates the supported LSIF edge kinds encountered in LSIF dumps.

#### LSIFElement
`LSIFElement` is the base shape shared by every LSIF vertex or edge record.

#### LSIFVertex
`LSIFVertex` narrows `LSIFElement` to vertex records, enforcing the `type: "vertex"` discriminator.

#### LSIFEdge
`LSIFEdge` narrows `LSIFElement` to edges, capturing `outV` and `inV` endpoints.

#### LSIFMetaData
`LSIFMetaData` represents the top-level metadata vertex with project root and tool information.

#### LSIFProject
`LSIFProject` models project vertices, including optional name and resource identifiers.

#### LSIFDocument
`LSIFDocument` captures document vertices with URIs and optional language/content metadata.

#### LSIFRange
`LSIFRange` describes source ranges (start/end positions) and optional hover tags.

#### LSIFResultSet
`LSIFResultSet` represents result-set vertices used to connect definitions/references.

#### LSIFDefinitionResult
`LSIFDefinitionResult` identifies definition result vertices linked from ranges.

#### LSIFReferenceResult
`LSIFReferenceResult` captures reference result vertices.

#### LSIFContainsEdge
`LSIFContainsEdge` represents containment edges with their list of child vertices.

#### LSIFItemEdge
`LSIFItemEdge` models `item` edges that join documents to definitions or references.

#### LSIFNextEdge
`LSIFNextEdge` captures `next` edges connecting sequential vertices in LSIF paths.

#### LSIFDefinitionEdge
`LSIFDefinitionEdge` maps `textDocument/definition` LSIF edges.

#### LSIFReferencesEdge
`LSIFReferencesEdge` maps `textDocument/references` LSIF edges.

#### LSIFEntry
`LSIFEntry` is the union of all vertex and edge shapes, matching individual LSIF JSON lines.

#### ParsedLSIFIndex
`ParsedLSIFIndex` is an internal helper structure holding indexed LSIF entities for fast lookup during ingestion.

## Responsibility
Document the LSIF data shapes the knowledge bridge ingests so external providers (SCIP/LSIF) can emit compatible payloads and tests can validate parsing.

## Evidence
- Referenced by the workspace index provider and LSIF ingestion routines documented in [`workspaceIndexProvider.mdmd.md`](../knowledge-graph-ingestion/workspaceIndexProvider.mdmd.md).
