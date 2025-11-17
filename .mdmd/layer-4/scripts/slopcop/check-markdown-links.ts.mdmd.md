# scripts/slopcop/check-markdown-links.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/slopcop/check-markdown-links.ts
- Live Doc ID: LD-implementation-scripts-slopcop-check-markdown-links-ts
- Generated At: 2025-11-16T22:34:14.118Z

## Authored
### Purpose
Scans markdown and MDMD files for broken relative links so Live Docs, specs, and maintainer guides never ship dangling references.

### Notes
- Built during the October 2025 SlopCop hardening to replace ad-hoc link grep checks with a deterministic CLI consumed by `npm run slopcop:markdown` and the Stage‑0 migration tasks (`2025-10-31.md`).
- Shares configuration with other SlopCop tools via `slopcop.config.json`, letting us tailor ignored paths (for example ChatHistory) while keeping CI failure codes consistent (exit 3 when issues exist).
- Backed by `packages/shared/src/tooling/markdownLinks.test.ts`, which stress-tests the parser while the CLI surfaces regressions to `safe-to-commit.mjs` and maintainer tasks.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:14.118Z","inputHash":"98f1e22e5ae24cb6"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `glob` - `globSync`
- `node:fs` - `fs`
- `node:path` - `path`
- `node:process` - `process`
- [`markdownLinks.MarkdownLinkIssue`](../../packages/shared/src/tooling/markdownLinks.ts.mdmd.md#markdownlinkissue)
- [`markdownLinks.findBrokenMarkdownLinks`](../../packages/shared/src/tooling/markdownLinks.ts.mdmd.md#findbrokenmarkdownlinks)
- [`config.compileIgnorePatterns`](./config.ts.mdmd.md#compileignorepatterns)
- [`config.loadSlopcopConfig`](./config.ts.mdmd.md#loadslopcopconfig)
- [`config.resolveIgnoreGlobs`](./config.ts.mdmd.md#resolveignoreglobs)
- [`config.resolveIncludeGlobs`](./config.ts.mdmd.md#resolveincludeglobs)
<!-- LIVE-DOC:END Dependencies -->
