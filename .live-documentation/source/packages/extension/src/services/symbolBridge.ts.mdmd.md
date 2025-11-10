# packages/extension/src/services/symbolBridge.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/services/symbolBridge.ts
- Live Doc ID: LD-implementation-packages-extension-src-services-symbolbridge-ts
- Generated At: 2025-11-09T22:52:09.782Z

## Authored
### Purpose
Answers the language server's workspace symbol collection request by turning VS Code references into link evidence and additional seeds.

### Notes
- Validates incoming payloads with zod, filters eligible seeds to TypeScript/JavaScript sources, and bounds traversal with per-symbol and global reference caps.
- Opens documents, gathers symbols and references via VS Code commands, and records `depends_on` evidences plus relationship hints at fixed confidence levels.
- Queues newly discovered URIs as additional seeds so the server can expand coverage on subsequent passes while tracking collection metrics.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:09.782Z","inputHash":"54e5181e92f0be88"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `registerSymbolBridge`
- Type: function
- Source: [source](../../../../../../packages/extension/src/services/symbolBridge.ts#L69)

#### `SymbolBridgeAnalyzer`
- Type: class
- Source: [source](../../../../../../packages/extension/src/services/symbolBridge.ts#L80)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `ArtifactSeed`, `COLLECT_WORKSPACE_SYMBOLS_REQUEST`, `LinkEvidence`, `RelationshipHint`, `WorkspaceLinkContribution`
- `vscode` - `vscode`
- `vscode-languageclient/node` - `LanguageClient`
- `zod` - `z`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [symbolBridge.test.ts](./symbolBridge.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
