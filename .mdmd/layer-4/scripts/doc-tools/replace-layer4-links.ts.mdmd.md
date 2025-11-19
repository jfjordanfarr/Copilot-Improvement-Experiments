# scripts/doc-tools/replace-layer4-links.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/doc-tools/replace-layer4-links.ts
- Live Doc ID: LD-implementation-scripts-doc-tools-replace-layer4-links-ts
- Generated At: 2025-11-19T15:01:35.741Z

## Authored
### Purpose
Rewrite curated Layer-4 slug links in legacy documentation to the Stage-0 paths produced by the Live Docs generator so Stage-3 specs and notes resolve to the canonical `.md` mirrors ([Stage-0 migration automation](../../../../AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-15.SUMMARIZED.md#L96-L112)).

### Notes
- Authored 2025-11-15 while repairing the `.md` transition; batch-ran it to swap knowledge-graph and diagnostics references back to the regenerated Stage-0 files, earning a thumbs-up from the user after the brittle one-off scripts failed ([first rollout](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-15.md#L3280-L3336)).
- Reapplied repeatedly later that evening to restore the Stage-0 slate after an accidental `git checkout` reverted the new mirror, underscoring that these rewrites must stay scripted ([post-regression recovery](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-15.md#L3980-L4024)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-19T15:01:35.741Z","inputHash":"a2163c29fa74e2e2"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs/promises` - `fs`
- `node:path` - `path`
- [`liveDocumentationConfig.DEFAULT_LIVE_DOCUMENTATION_CONFIG`](../../packages/shared/src/config/liveDocumentationConfig.ts.mdmd.md#symbol-default_live_documentation_config)
<!-- LIVE-DOC:END Dependencies -->
