# scripts/live-docs/visualize-explorer.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/live-docs/visualize-explorer.ts
- Live Doc ID: LD-implementation-scripts-live-docs-visualize-explorer-ts
- Generated At: 2025-11-21T19:32:20.770Z

## Authored
### Purpose
Serve as a sandbox CLI that snapshots the workspace graph and spins up a lightweight HTTP server for Gemini’s Live Docs visual explorer.

### Notes
- Generates induced/inheritance link data on the fly, writes it to `data/graph-snapshots/explorer-temp.json`, and renders multiple SVG views (circuit, map, force) inside a browser shell.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-21T19:32:20.770Z","inputHash":"785d26f117756a7a"}]} -->
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
- [`liveDocGraph.LiveDocGraphNode`](./lib/liveDocGraph.ts.mdmd.md#symbol-livedocgraphnode)
- [`liveDocGraph.buildLiveDocGraph`](./lib/liveDocGraph.ts.mdmd.md#symbol-buildlivedocgraph)
<!-- LIVE-DOC:END Dependencies -->
