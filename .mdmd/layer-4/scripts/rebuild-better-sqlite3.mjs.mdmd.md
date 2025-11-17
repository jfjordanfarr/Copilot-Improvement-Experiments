# scripts/rebuild-better-sqlite3.mjs

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/rebuild-better-sqlite3.mjs
- Live Doc ID: LD-implementation-scripts-rebuild-better-sqlite3-mjs
- Generated At: 2025-11-16T22:34:14.072Z

## Authored
### Purpose
Prepares `better-sqlite3` native binaries for both the Node 22 runtime and VS Code's Electron runtime so the extension and tooling share a working SQLite layer without manual `npm rebuild` steps.

### Notes
- Authored 2025-10-21 while harmonising the toolchain on Node 22; created to unblock the diagnostics tree view which persisted data through `GraphStore` (`2025-10-21.SUMMARIZED.md`).
- Expanded 2025-10-26 to cache binaries per ABI and prefer prebuilt artifacts before falling back to a source rebuild, covering both Node and Electron bindings (`2025-10-26.SUMMARIZED.md`).
- Exposes `--force`, `SKIP_BETTER_SQLITE3_REBUILD`, and VS Code-specific env vars (`VSCODE_ELECTRON_VERSION`/`VSCODE_ELECTRON_ABI`) so CI and local workflows choose the right Electron target while still restoring the default Node binary afterwards.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:14.072Z","inputHash":"a15064011a2acc0d"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:child_process` - `spawnSync`
- `node:fs` - `fs`
- `node:module` - `createRequire`
- `node:path` - `path`
- `node:url` - `fileURLToPath`
<!-- LIVE-DOC:END Dependencies -->
