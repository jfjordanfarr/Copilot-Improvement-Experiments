# packages/server/src/features/knowledge/symbolBridgeProvider.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/symbolBridgeProvider.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-symbolbridgeprovider-ts
- Generated At: 2025-11-14T16:30:21.399Z

## Authored
### Purpose
Bridges workspace link analysis requests to the extension host, validating responses before seeding hints and evidences into the server graph.

### Notes
- Issues `COLLECT_WORKSPACE_SYMBOLS_REQUEST` RPCs over the language server connection and forwards seeds back when contributions exist.
- Uses zod schemas to guard against malformed payloads, surfacing parse errors through structured warnings.
- Emits summary telemetry via the provided logger so operators can track how many files and symbols were analysed.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T16:30:21.399Z","inputHash":"e0b62fa10c9692f1"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `createSymbolBridgeProvider`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/knowledge/symbolBridgeProvider.ts#L19)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `COLLECT_WORKSPACE_SYMBOLS_REQUEST`, `CollectWorkspaceSymbolsParams`, `WorkspaceLinkProvider`
- `vscode-languageserver/node` - `Connection`
- `zod` - `z`
<!-- LIVE-DOC:END Dependencies -->
