# scripts/fixture-tools/summarize-snapshot.mjs

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/fixture-tools/summarize-snapshot.mjs
- Live Doc ID: LD-implementation-scripts-fixture-tools-summarize-snapshot-mjs
- Generated At: 2025-11-16T22:34:13.886Z

## Authored
### Purpose
Produces a human-readable summary of knowledge-graph snapshot JSON files so we can audit fixture coverage counts (artifacts, include edges, hot headers) after each benchmark refresh ([libuv snapshot analysis](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-01.md#L4781-L4804)).

### Notes
- Authored 2025-11-01 while importing the libuv benchmark to report its 74 files and 130 include edges, letting us validate that the graph snapshot matched the manifest hash set ([creation log](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-01.md#L4781-L4804)).
- Reused 2025-11-02 during the follow-up integrity pass to confirm the curated snapshot remained consistent as we trimmed vendor noise and regenerated inferred edges ([integrity sweep](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-02.md#L20-L140)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:13.886Z","inputHash":"7803d39022c5776e"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
- `node:path` - `path`
- `node:process` - `process`
<!-- LIVE-DOC:END Dependencies -->
