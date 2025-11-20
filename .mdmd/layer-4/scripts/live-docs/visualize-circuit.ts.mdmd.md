# scripts/live-docs/visualize-circuit.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/live-docs/visualize-circuit.ts
- Live Doc ID: LD-implementation-scripts-live-docs-visualize-circuit-ts
- Generated At: 2025-11-20T18:00:41.603Z

## Authored
### Purpose
Render the Live Docs graph as a circuit-board style canvas, grouping markdown mirrors by directory and surfacing induced edges between related docs.

### Notes
The CLI snapshots the workspace graph, serves an HTML dashboard on port 3002, and reuses `snapshotWorkspace` to stay aligned with the canonical dependency graph.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-20T18:00:41.603Z","inputHash":"fa182a1f150f9d3d"}]} -->
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
