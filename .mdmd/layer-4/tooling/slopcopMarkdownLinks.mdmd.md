title: "SlopCop Markdown Link Audit"
# SlopCop Markdown Link Audit (Layer 4)

## Source Mapping
- CLI: [`scripts/slopcop/check-markdown-links.ts`](/scripts/slopcop/check-markdown-links.ts)
- Shared utility: [`packages/shared/src/tooling/markdownLinks.ts`](/packages/shared/src/tooling/markdownLinks.ts)
- Unit tests: [`packages/shared/src/tooling/markdownLinks.test.ts`](/packages/shared/src/tooling/markdownLinks.test.ts)
- Safe-to-commit integration: [`scripts/safe-to-commit.mjs`](/scripts/safe-to-commit.mjs)
- Repository config: [`slopcop.config.json`](/slopcop.config.json)
- Shared config loader: [`scripts/slopcop/config.ts`](/scripts/slopcop/config.ts)

## Purpose
Guarantee that every Markdown or MDMD document references real, present files by failing fast when a link target is missing. The audit catches hallucinated documentation edits and stale refactors before they ship and keeps MDMD traceability trustworthy for the broader pseudocode AST vision.

## Behaviour
- Scans `*.md`, `*.mdmd`, and workspace README files while honouring default ignores (`node_modules`, build output, knowledge graph cache, AI chat history).
- Parses inline and reference-style links plus images; external schemes (`http`, `mailto`, anchors) are ignored.
- Resolves absolute `/` links from the workspace root and relative links from the current document before verifying file existence.
- Groups findings by top-level folder with line/column context and returns exit code `3` when gaps are detected, `0` when clean, and `4` on unexpected failures.

## Configuration
- `slopcop.config.json` extends ignore globs (e.g., chat transcripts) and supports regex `ignoreTargets` for known placeholders until they are rewritten. Markdown-specific overrides live under the `markdown` key so additional SlopCop passes (e.g., assets) can reuse the shared config file.
- CLI flags:
  - `--workspace <path>` overrides the discovery root.
  - `--json` emits a machine-readable payload for future CI wiring.
- Additional workspace linting passes can reuse the shared utility so they inherit the same ignore behaviour and path resolution.

## Tests
- `packages/shared/src/tooling/markdownLinks.test.ts` covers missing inline links, reference definitions, workspace-root paths, generic angle brackets, and ignore-pattern support.

## Operations
- `npm run slopcop:markdown` — human-readable audit, optional `-- --json` for JSON output.
- `npm run slopcop:assets` — companion lint that validates HTML/CSS references, sharing the same configuration file and exit semantics.
- `npm run safe:commit` — chains verify → graph snapshot → graph audit → markdown audit so modern linting runs before every commit.
