# scripts/doc-tools/update-stage0-links.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/doc-tools/update-stage0-links.ts
- Live Doc ID: LD-implementation-scripts-doc-tools-update-stage0-links-ts
- Generated At: 2025-11-16T22:53:01.773Z

## Authored
### Purpose
Mass-rewrite Stage-0 Live Documentation links so every reference adopts the configured root and `.md` extension, preventing future extension flips from leaving stale `.mdmd.md` or `.md` pointers behind ([Stage-0 migration tooling](../../../../AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-15.SUMMARIZED.md#L96-L112)).

### Notes
- Built on 2025-11-15 after repeated PowerShell one-offs corrupted `mdmd-layer-content-census.md`; the dedicated CLI restored the `.md` links and locked in the safer workflow the user asked for ([initial repair pass](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-15.md#L2648-L2708)).
- Extended and rerun on 2025-11-16 across all `.mdmd/**/*.mdmd.md` mirrors and notes via the `--glob` option so the Stage-0 tree stayed synchronized once the extension setting moved back to `.mdmd.md` ([global sweep](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-16.md#L4418-L4446)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:53:01.773Z","inputHash":"88b06223ad7dd787"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `glob` - `globSync`
- `node:fs` - `fs`
- `node:path` - `path`
- [`liveDocumentationConfig.DEFAULT_LIVE_DOCUMENTATION_CONFIG`](../../packages/shared/src/config/liveDocumentationConfig.ts.mdmd.md#default_live_documentation_config)
<!-- LIVE-DOC:END Dependencies -->
