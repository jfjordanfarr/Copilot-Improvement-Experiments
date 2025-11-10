# packages/extension/src/commands/inspectSymbolNeighbors.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/commands/inspectSymbolNeighbors.ts
- Live Doc ID: LD-implementation-packages-extension-src-commands-inspectsymbolneighbors-ts
- Generated At: 2025-11-09T22:52:09.427Z

## Authored
### Purpose
Offers the `linkDiagnostics.inspectSymbolNeighbors` command so users can explore relationship graph neighbors and jump to related artifacts inside VS Code.

### Notes
- Normalizes command targets from active editors, URIs, or explicit params before asking the language server for neighbor data.
- Validates the server response with zod schemas, summarises neighbor groups, and renders them in a quick pick with direction, depth, and confidence metadata.
- Opens the chosen artifact in the editor and reroutes window APIs through test hooks, which allows deterministic unit test coverage.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:09.427Z","inputHash":"72c1a9eb7797ef64"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `registerInspectSymbolNeighborsCommand`
- Type: function
- Source: [source](../../../../../../packages/extension/src/commands/inspectSymbolNeighbors.ts#L28)

#### `SymbolNeighborQuickPickController`
- Type: class
- Source: [source](../../../../../../packages/extension/src/commands/inspectSymbolNeighbors.ts#L39)

#### `ParsedInspectSymbolNeighborsResult`
- Type: type
- Source: [source](../../../../../../packages/extension/src/commands/inspectSymbolNeighbors.ts#L251)

#### `ParsedNeighborNode`
- Type: type
- Source: [source](../../../../../../packages/extension/src/commands/inspectSymbolNeighbors.ts#L254)

#### `InspectSymbolNeighborsResultValidator`
- Type: const
- Source: [source](../../../../../../packages/extension/src/commands/inspectSymbolNeighbors.ts#L256)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `INSPECT_SYMBOL_NEIGHBORS_REQUEST`, `InspectSymbolNeighborsParams`
- [`artifactSchemas.KnowledgeArtifactSchema`](../shared/artifactSchemas.ts.mdmd.md#knowledgeartifactschema)
- [`artifactSchemas.LinkRelationshipKindSchema`](../shared/artifactSchemas.ts.mdmd.md#linkrelationshipkindschema)
- [`testHooks.resolveWindowApis`](../testing/testHooks.ts.mdmd.md#resolvewindowapis)
- `vscode` - `vscode`
- `vscode-languageclient/node` - `LanguageClient`
- `zod` - `z`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [inspectSymbolNeighbors.test.ts](./inspectSymbolNeighbors.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
