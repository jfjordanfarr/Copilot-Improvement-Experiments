# scripts/doc-tools/slug-heading.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/doc-tools/slug-heading.ts
- Live Doc ID: LD-implementation-scripts-doc-tools-slug-heading-ts
- Generated At: 2025-11-19T15:01:35.748Z

## Authored
### Purpose
Slug candidate headings with the same GitHub dialect the generator uses so we can confirm the exact anchor a Live Doc will emit before patching links ([anchor triage](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-15.md#L3333-L3388)).

### Notes
- Introduced beside `show-heading-codepoints.ts` on 2025-11-15 to repair the `REQ-H1 Hosted Showcase Pipeline` anchor without guessing at hyphen rules ([slug helper creation](../../../../AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-15.SUMMARIZED.md#L112-L124)).
- Reused whenever SlopCop flags header drift so we can validate the canonical slug before mass search-and-replace updates ([follow-up runs](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-15.md#L3335-L3394)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-19T15:01:35.748Z","inputHash":"4f398252f4838d3f"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
- [`githubSlugger.createSlugger`](../../packages/shared/src/tooling/githubSlugger.ts.mdmd.md#symbol-createslugger)
<!-- LIVE-DOC:END Dependencies -->
