# packages/extension/src/testing/testHooks.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/testing/testHooks.ts
- Live Doc ID: LD-implementation-packages-extension-src-testing-testhooks-ts
- Generated At: 2025-11-14T18:42:06.263Z

## Authored
### Purpose
Provides a mechanism for tests to override VS Code window APIs without mutating globals inside production code.

### Notes
- Reads optional overrides from a global test hook bag and falls back to the real `vscode.window` methods when none are supplied.
- Returns bound functions so downstream code (like quick pick controllers) can call the APIs without caring about the active environment.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.263Z","inputHash":"bf5c5fa42b5c18d2"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `resolveWindowApis`
- Type: function
- Source: [source](../../../../../../packages/extension/src/testing/testHooks.ts#L21)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `vscode` - `vscode`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [inspectSymbolNeighbors.test.ts](../commands/inspectSymbolNeighbors.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
