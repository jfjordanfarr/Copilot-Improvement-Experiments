# scripts/powershell/emit-ast.ps1

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/powershell/emit-ast.ps1
- Live Doc ID: LD-implementation-scripts-powershell-emit-ast-ps1
- Generated At: 2025-11-20T18:00:42.359Z

## Authored
### Purpose
Parse PowerShell source files and emit a compact JSON payload of functions, dot-sources, and module references for the Live Docs adapter.

### Notes
The script targets Windows PowerShell 5.1 compatibility, resolves dot-sourced paths without executing the file, and falls back gracefully when modules are missing.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-20T18:00:42.359Z","inputHash":"1c620f44d281e014"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `Resolve-CandidatePath` {#symbol-resolvecandidatepath}
- Type: function
- Source: [source](../../../../scripts/powershell/emit-ast.ps1#L9)

#### `Extract-StringLiterals` {#symbol-extractstringliterals}
- Type: function
- Source: [source](../../../../scripts/powershell/emit-ast.ps1#L39)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_No dependencies documented yet_
<!-- LIVE-DOC:END Dependencies -->
