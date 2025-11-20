# scripts/live-docs/visualize-explorer.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/live-docs/visualize-explorer.ts
- Live Doc ID: LD-implementation-scripts-live-docs-visualize-explorer-ts
- Generated At: 2025-11-20T20:35:25.711Z

## Authored
### Purpose
Serve as a sandbox CLI that snapshots the workspace graph and spins up a lightweight HTTP server for Gemini’s Live Docs visual explorer.

### Notes
- Generates induced/inheritance link data on the fly, writes it to `data/graph-snapshots/explorer-temp.json`, and renders multiple SVG views (circuit, map, force) inside a browser shell.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-20T20:35:25.711Z","inputHash":"d12f85d8a2a82404"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `child_process` - `exec`
- `fs/promises` - `fs`
- `http` - `createServer`
- `path` - `path`
- [`snapshot-workspace.snapshotWorkspace`](../graph-tools/snapshot-workspace.ts.mdmd.md#symbol-snapshotworkspace)
<!-- LIVE-DOC:END Dependencies -->
