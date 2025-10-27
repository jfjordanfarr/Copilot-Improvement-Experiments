# SCIP Contracts (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/contracts/scip.ts`](../../../packages/shared/src/contracts/scip.ts)
- Parent design: [Knowledge Graph Ingestion Architecture](../../layer-3/knowledge-graph-ingestion.mdmd.md)

## Exported Symbols

#### SCIPIndex
`SCIPIndex` describes the root object of a SCIP index file, bundling metadata and document entries.

#### SCIPMetadata
`SCIPMetadata` contains tool information, project root, and encoding metadata for the index.

#### SCIPToolInfo
`SCIPToolInfo` records the producer of the index (name, version, arguments).

#### SCIPDocument
`SCIPDocument` captures per-file occurrences and symbol descriptors.

#### SCIPOccurrence
`SCIPOccurrence` models individual symbol occurrences with ranges, roles, diagnostic annotations, and optional documentation overrides.

#### SCIPSymbolInformation
`SCIPSymbolInformation` stores symbol-level metadata (documentation, relationships, display name, signature details).

#### SCIPRelationship
`SCIPRelationship` represents relationships between symbols (reference, implementation, type definition, definition).

#### SCIPDiagnostic
`SCIPDiagnostic` mirrors LSP-style diagnostics embedded within occurrences.

#### SCIPSignature
`SCIPSignature` contains signature documentation that can be attached to symbol information.

#### SCIPSymbolRole
`SCIPSymbolRole` enumerates the bitflag roles used for SCIP occurrences.

#### SCIPSymbolKind
`SCIPSymbolKind` enumerates the symbol kinds used throughout the index.

#### ParsedSCIPIndex
`ParsedSCIPIndex` is an internal helper map used when the workspace index provider ingests SCIP dumps.

## Responsibility
Document the data shapes required to import SCIP indexes so knowledge feeds and workspace providers can convert SCIP metadata into our graph model.

## Evidence
- Referenced by the workspace index provider described in [`workspaceIndexProvider.mdmd.md`](../knowledge-graph-ingestion/workspaceIndexProvider.mdmd.md).
