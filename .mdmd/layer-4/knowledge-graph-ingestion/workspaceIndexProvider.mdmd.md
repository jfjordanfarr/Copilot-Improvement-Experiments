# WorkspaceIndexProvider (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/knowledge/workspaceIndexProvider.ts`](../../../packages/server/src/features/knowledge/workspaceIndexProvider.ts)
- Parent design: [Knowledge Graph Ingestion Architecture](../../layer-3/knowledge-graph-ingestion.mdmd.md)
- Spec references: [FR-015](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-016](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements)

## Exported Symbols

#### DEFAULT_CODE_EXTENSIONS
`DEFAULT_CODE_EXTENSIONS` lists the implementation-file extensions (.ts, .tsx, .js, .jsx, .mjs, .cts, .mts) used when seeding code artifacts from the workspace.

#### DEFAULT_DOC_EXTENSIONS
`DEFAULT_DOC_EXTENSIONS` enumerates the documentation/file extensions (.md, .mdx, .markdown, .txt, .yaml, .yml) that feed the requirements layer index when scanning docs directories.

#### ExportedSymbolKind
`ExportedSymbolKind` is the discriminated union describing TypeScript export kinds ("class", "interface", "type", etc.) recorded in exportedSymbols metadata for code seeds.

#### ExportedSymbolMetadata
`ExportedSymbolMetadata` captures each export's name, kind, and flags (isDefault, isTypeOnly) so downstream audits can compare code against MDMD coverage.

#### DocumentSymbolReferenceMetadata
`DocumentSymbolReferenceMetadata` records inline-code references discovered in documentation, storing the symbol slug and optional context hint for later matching.

#### createWorkspaceIndexProvider
`createWorkspaceIndexProvider` constructs a workspace link provider that scans implementation, documentation, and script targets, emitting workspace seeds plus relationship hints for ingestion.

## Responsibility
Provide a lightweight filesystem-backed indexer that seeds the knowledge graph with code and documentation artifacts when no advanced language service is available. The provider powers graph snapshots, tests, and offline tooling by ensuring exported symbols and doc references reach the ingestion pipeline.

## Seeding Strategy
- **Implementation directories** (`src/` by default) are scanned recursively, filtering to `DEFAULT_CODE_EXTENSIONS`, skipping likely binary files, and reading UTF-8 content for symbol extraction.
- **Documentation directories** (defaults include `docs`, `specs`, `.mdmd`, `README.md`) are mapped to the `requirements` layer and annotated with `DocumentSymbolReferenceMetadata` for inline code references.
- **Scripts** (e.g., `scripts/`) reuse the code path so tooling and CLIs surface in the knowledge graph even when stored outside `src/`.

## Symbol Extraction
- `extractExportedSymbols` uses TypeScript AST traversal to detect exported declarations and populate exportedSymbols metadata attached to code seeds.
- `extractDocumentSymbolReferences` scans for inline code spans that resemble identifiers, emitting DocumentSymbolReferenceMetadata entries consumed by symbol coverage audits.
- Path reference directives and Markdown link hints are harvested via `extractPathReferenceHints` / `extractLinkHints`, helping the ingestion pipeline infer cross-file relationships.

## Observability
- Optional `logger.info` emits `[workspace-index] collected ...` messages summarising seed + hint counts and the directories scanned.
- Return payload matches the shared `WorkspaceLinkContribution` contract so graph tooling and diagnostics can trace ingestion provenance.

## Follow-ups
- Honour `.gitignore` / workspace ignore patterns to avoid indexing generated artefacts.
- Surface timing metrics and file counts to aid performance tuning on large repositories.
