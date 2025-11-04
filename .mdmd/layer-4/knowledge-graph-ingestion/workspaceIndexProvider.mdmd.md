# Workspace Index Provider

## Metadata
- Layer: 4
- Implementation ID: IMP-212
- Code Path: [`packages/server/src/features/knowledge/workspaceIndexProvider.ts`](../../../packages/server/src/features/knowledge/workspaceIndexProvider.ts)
- Exports: DEFAULT_CODE_EXTENSIONS, DEFAULT_DOC_EXTENSIONS, ExportedSymbolKind, ExportedSymbolMetadata, DocumentSymbolReferenceMetadata, createWorkspaceIndexProvider

## Purpose
Seed the knowledge graph with local code and documentation artifacts without relying on heavy language services.
- Discover implementation files, exported symbols, and inline documentation references through filesystem scans.
- Emit workspace link contributions for graph snapshots, audits, and fallback inference.
- Produce relationship hints so downstream tooling correlates MDMD symbols with code exports.

## Public Symbols

### DEFAULT_CODE_EXTENSIONS
Set of file extensions (ts/tsx/js/jsx/mjs/cts/mts/c/h) used to filter implementation directories when collecting code artifacts.

### DEFAULT_DOC_EXTENSIONS
Set of documentation-oriented extensions (md/mdx/markdown/txt/yaml/yml) used to harvest Layer 2/3 MDMD files into the requirements layer.

### ExportedSymbolKind
Discriminated union describing recognised TypeScript export kinds (class, interface, type alias, enum, function, variable) recorded for coverage audits.

### ExportedSymbolMetadata
Structure capturing export name, kind, and flags (`isDefault`, `isTypeOnly`) attached to each code artifact to power symbol coverage reporting.

### DocumentSymbolReferenceMetadata
Metadata emitted for inline code spans within documentation, storing the referenced symbol slug and optional context to assist relationship inference.

### createWorkspaceIndexProvider
Factory that returns a workspace provider, scanning configured roots, extracting exports/references, and returning `WorkspaceLinkContribution` seeds plus relationship hints.

## Collaborators
- [`packages/server/src/features/knowledge/knowledgeGraphBridge.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphBridge.ts) consumes provider outputs during ingestion bootstrap.
- [`packages/shared/src/inference/fallbackInference.ts`](../../../packages/shared/src/inference/fallbackInference.ts) relies on emitted hints when surfacing ripple suggestions without model assistance.
- [`packages/server/src/features/knowledge/feedDiagnosticsGateway.ts`](../../../packages/server/src/features/knowledge/feedDiagnosticsGateway.ts) uses provider log output to contextualise feed health with seed counts.

## Linked Components
- [COMP-005 – Knowledge Graph Ingestion](../../layer-3/knowledge-graph-ingestion.mdmd.md#imp212-workspaceindexprovider)

## Evidence
- Providers exercised via `npm run graph:snapshot`, which invokes the indexer and verifies deterministic seed counts through snapshot fixtures.
- Fallback inference unit tests cover exported symbol harvesting by asserting `ExportedSymbolMetadata` contents for sample files.
- [`packages/server/src/features/knowledge/workspaceIndexProvider.test.ts`](../../../packages/server/src/features/knowledge/workspaceIndexProvider.test.ts) validates TypeScript import evidences by ensuring real module edges (e.g. `models.ts → types.ts`) are emitted while unused helpers stay unlinked.
- Manual smoke: running `npm run graph:audit` produces `[workspace-index]` logs summarising collected seeds, confirming directory scanning coverage.

## Operational Notes
- Ignores binary files by size/extension heuristics; future work includes honouring `.gitignore` and workspace-specific excludes.
- Symbol extraction is best-effort; ambiguous TypeScript syntax falls back to minimal metadata rather than failing collection.
- Directory configuration may be overridden via provider options, enabling targeted scans during tests or fixtures.
