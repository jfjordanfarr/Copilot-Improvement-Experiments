# scripts/doc-tools/list-layer4-links.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/doc-tools/list-layer4-links.ts
- Live Doc ID: LD-implementation-scripts-doc-tools-list-layer4-links-ts
- Generated At: 2025-11-16T22:34:13.737Z

## Authored
### Purpose
Catalogue every `layer-4` markdown link inside the staged `.mdmd` tree so we know exactly which authored docs still point at the old mirrors before we rewrite them to `.live-documentation/source/**.md` ([initial scan](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-15.md#L3088-L3106)).

### Notes
- Built in response to the user’s request for deterministic helpers over brittle PowerShell snippets; the first run surfaced 96 stale links across 13 files and guided the follow-up replacements ([tooling mandate](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-15.md#L3090-L3102)).
- The 2025-11-16 dev-day summary now codifies this script as the canonical pattern for future link rewrites, warning us away from ad-hoc shell hacks on the Win10 host ([instruction capture](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-16.md#L350-L530)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:13.737Z","inputHash":"74a868985a16e574"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs/promises` - `fs`
- `node:path` - `path`
<!-- LIVE-DOC:END Dependencies -->
