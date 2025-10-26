---
title: "SlopCop Workspace Linting"
order: 310
status: draft
---

## Purpose
Capture the design for our growing "SlopCop" linting suite: repository-level checks that catch modern AI-assistance mistakes (broken documentation links, stale graph coverage, hallucinated files) before a commit lands. The suite lives alongside our `graph:*` tooling and flows into `npm run safe:commit` so every validation run answers “is the workspace structurally sound?”.

## Scope
- Markdown/MDMD link integrity across docs, specs, README, and chat transcripts.
- Asset path integrity for HTML/CSS bundles so static artefacts stay aligned with MDMD proxies; coverage includes `<img>/<source>` `src` & `srcset`, `<link rel="stylesheet">`, preload hints, and CSS `url()` references while honouring workspace and configurable root directories.
- Future add-ons: symbol-level orphan detection, stale snapshot fixtures, generated-file drift.
- CLI ergonomics must mirror the existing graph tooling (`--json`, deterministic exit codes, Windows-friendly flag forwarding).

## Entry Points
- `npm run slopcop:markdown` (new) — checks Markdown links.
- `npm run slopcop:assets` (new) — checks HTML/CSS `src`/`href`/`url()` references against the workspace.
- `npm run safe:commit` (updated) — chains `verify`, `graph:snapshot`, `graph:audit`, and SlopCop checks.

## Guardrails
- Zero reliance on heuristics that mutate the workspace; all commands run in read-only mode.
- Output must be actionable: grouped by package/folder with line/column context plus optional JSON for future automation.
- Exit codes align with `graph:audit` so CI and local scripts can short-circuit on failures.
- Shared configuration (`slopcop.config.json`) supports per-check include/ignore patterns, asset root directories (e.g., `/public`, `/static`), and hashed-filename ignore regexes so future passes inherit consistent ergonomics.

## Implementation Notes
- Lint logic will live in shared TypeScript utilities for testing; CLIs will consume those helpers via `tsx`.
- Ignore patterns should default to our gitignore-aware seeds (skip `node_modules`, coverage, built artifacts) with optional overrides in later iterations.
- Documentation-first workflow: Layer‑4 implementation doc + quickstart/copilot-instructions updates keep Copilot agents on the happy path.

## Traceability
- Layer 4 implementation: [SlopCop Markdown Link Audit](../layer-4/tooling/slopcopMarkdownLinks.mdmd.md)
- Layer 4 implementation: [SlopCop Asset Reference Audit](../layer-4/tooling/slopcopAssetPaths.mdmd.md)
- Layer 4 placeholder: [SlopCop Symbol Reference Audit](../layer-4/tooling/slopcopSymbolReferences.mdmd.md)
- CLI entry point: [`scripts/slopcop/check-markdown-links.ts`](../../scripts/slopcop/check-markdown-links.ts)
- CLI entry point: [`scripts/slopcop/check-asset-paths.ts`](../../scripts/slopcop/check-asset-paths.ts)
- Shared utility and tests: [`packages/shared/src/tooling/markdownLinks.ts`](../../packages/shared/src/tooling/markdownLinks.ts), [`packages/shared/src/tooling/markdownLinks.test.ts`](../../packages/shared/src/tooling/markdownLinks.test.ts)
- Shared utility and tests: [`packages/shared/src/tooling/assetPaths.ts`](../../packages/shared/src/tooling/assetPaths.ts), [`packages/shared/src/tooling/assetPaths.test.ts`](../../packages/shared/src/tooling/assetPaths.test.ts), [`packages/shared/src/tooling/slopcopAssetCli.test.ts`](../../packages/shared/src/tooling/slopcopAssetCli.test.ts)
- Fixture workspace: [`tests/integration/fixtures/slopcop-assets`](../../tests/integration/fixtures/slopcop-assets)
- Automation hook: [`scripts/safe-to-commit.mjs`](../../scripts/safe-to-commit.mjs)
- Configuration: [`slopcop.config.json`](../../slopcop.config.json)
