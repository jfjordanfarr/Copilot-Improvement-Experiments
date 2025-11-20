# packages/shared/src/live-docs/adapters/powershell.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/live-docs/adapters/powershell.ts
- Live Doc ID: LD-implementation-packages-shared-src-live-docs-adapters-powershell-ts
- Generated At: 2025-11-20T18:00:41.009Z

## Authored
### Purpose
Provide the Stage-0 adapter that translates PowerShell scripts and modules into Live Docs symbols and dependency edges.

### Notes
The adapter shells out to `scripts/powershell/emit-ast.ps1`, caches per-file payloads, and accepts either `pwsh` or Windows PowerShell.
Dot-sourced paths are normalized to workspace-relative form so downstream graph tooling can reason about cross-script hops.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-20T18:00:41.009Z","inputHash":"5fe55869a7c8d652"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `powershellAdapter` {#symbol-powershelladapter}
- Type: const
- Source: [source](../../../../../../../packages/shared/src/live-docs/adapters/powershell.ts#L35)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:child_process` - `execFile`
- `node:path` - `path`
- `node:util` - `promisify`
- [`index.LanguageAdapter`](./index.ts.mdmd.md#symbol-languageadapter) (type-only)
- [`core.DependencyEntry`](../core.ts.mdmd.md#symbol-dependencyentry) (type-only)
- [`core.PublicSymbolEntry`](../core.ts.mdmd.md#symbol-publicsymbolentry) (type-only)
- [`core.SourceAnalysisResult`](../core.ts.mdmd.md#symbol-sourceanalysisresult) (type-only)
- [`pathUtils.normalizeWorkspacePath`](../../tooling/pathUtils.ts.mdmd.md#symbol-normalizeworkspacepath)
<!-- LIVE-DOC:END Dependencies -->
