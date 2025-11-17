# scripts/doc-tools/show-heading-codepoints.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/doc-tools/show-heading-codepoints.ts
- Live Doc ID: LD-implementation-scripts-doc-tools-show-heading-codepoints-ts
- Generated At: 2025-11-16T22:34:13.762Z

## Authored
### Purpose
Print the raw Unicode code points for any heading that SlopCop highlights so we can see stray dashes or zero-width characters that break GitHub-style anchors during doc lint sessions ([slug debugging session](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-15.md#L3333-L3372)).

### Notes
- Introduced on 2025-11-15 after repeated slug mismatches on `REQ-H1 Hosted Showcase Pipeline`; the script gave a quick view of the problematic characters before re-slugging the heading ([creation log](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-15.md#L3333-L3360)).
- Paired with `slug-heading.ts` to confirm the corrected anchor and keep future investigations shell-friendly per the user's request ([tooling follow-up](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-15.md#L3359-L3388)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:13.762Z","inputHash":"8f73f8bc961c7217"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
<!-- LIVE-DOC:END Dependencies -->
