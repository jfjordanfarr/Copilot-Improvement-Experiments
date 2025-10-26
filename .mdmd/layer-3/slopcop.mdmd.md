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
- Symbol relationship integrity so documentation headings, code symbols, and knowledge-graph nodes stay synchronized; initial focus on Markdown heading anchors before expanding to language-aware symbol harvesting (TypeScript, JSON schemas, etc.) without implementing bespoke compilers.
- Future add-ons: symbol-level orphan detection, stale snapshot fixtures, generated-file drift.
- CLI ergonomics must mirror the existing graph tooling (`--json`, deterministic exit codes, Windows-friendly flag forwarding).

## Entry Points
- `npm run slopcop:markdown` — checks Markdown links.
- `npm run slopcop:assets` — checks HTML/CSS `src`/`href`/`url()` references against the workspace.
- `npm run slopcop:symbols` — audits Markdown/MDMD headings for duplicate slugs and broken anchors (opt-in via config).
- `npm run safe:commit` — chains `verify`, `graph:snapshot`, `graph:audit`, and the SlopCop suite (markdown, asset, symbol audits).

## Guardrails
- Zero reliance on heuristics that mutate the workspace; all commands run in read-only mode.
- Output must be actionable: grouped by package/folder with line/column context plus optional JSON for future automation.
- Exit codes align with `graph:audit` so CI and local scripts can short-circuit on failures.
- Shared configuration (`slopcop.config.json`) supports per-check include/ignore patterns, asset root directories (e.g., `/public`, `/static`), and hashed-filename ignore regexes so future passes inherit consistent ergonomics.

## Implementation Notes
- Lint logic will live in shared TypeScript utilities for testing; CLIs will consume those helpers via `tsx`.
- Ignore patterns should default to our gitignore-aware seeds (skip `node_modules`, coverage, built artifacts) with optional overrides in later iterations.
- Documentation-first workflow: Layer‑4 implementation doc + quickstart/copilot-instructions updates keep Copilot agents on the happy path.

- **Phase S0 status – Markdown anchors** *(delivered)*:
	- Headings scanned with a vendored GitHub slugger to ensure VS Code/GitHub parity.
	- Diagnostics emitted for duplicate slugs (warn) and missing anchors (error), honouring ignore patterns from config.
	- CLI + integration fixture validates fail/fix behaviour and ships JSON/human output.
- **Phase S1 – Documentation ↔ Code parity**: Use the graph snapshot SQLite cache to correlate Layer‑4 docs to the code symbols they describe. Emit diagnostics when docs reference non-existent exports or when exported symbols lack Layer‑4 coverage. Prefer the existing knowledge graph over ad-hoc file scans.
- **Phase S2 – Language harvest without new compilers**: Reuse existing tooling for symbol inventories. Examples: leverage the TypeScript compiler API already present in the workspace, consume JSON schema definitions, or ingest LSIF/SCIP payloads we import during `graph:snapshot`. Where no parser exists, allow opt-in configuration rather than guessing.
- **Phase S3 – Developer-facing surfacing**: Add a SlopCop symbol CLI (`check-symbols.ts`), wire it into `npm run safe:commit`, and surface symbol lint in the VS Code Problems view. Provide remediation hints (e.g., suggested headings) and store results so future auto-repair flows can consume them.
- **Evidence plan**: Introduce a fixture workspace mixing Markdown docs and TypeScript modules with deliberate symbol gaps, extend unit coverage around slug extraction + graph queries, and add integration smoke that drives the CLI against the fixture.

## Traceability
- Layer 4 implementation: [SlopCop Markdown Link Audit](../layer-4/tooling/slopcopMarkdownLinks.mdmd.md)
- Layer 4 implementation: [SlopCop Asset Reference Audit](../layer-4/tooling/slopcopAssetPaths.mdmd.md)
- Layer 4 implementation: [SlopCop Symbol Reference Audit](../layer-4/tooling/slopcopSymbolReferences.mdmd.md)
- CLI entry points: [`scripts/slopcop/check-markdown-links.ts`](../../scripts/slopcop/check-markdown-links.ts), [`scripts/slopcop/check-asset-paths.ts`](../../scripts/slopcop/check-asset-paths.ts), [`scripts/slopcop/check-symbols.ts`](../../scripts/slopcop/check-symbols.ts)
- Shared utilities and tests: [`packages/shared/src/tooling/markdownLinks.ts`](../../packages/shared/src/tooling/markdownLinks.ts), [`packages/shared/src/tooling/assetPaths.ts`](../../packages/shared/src/tooling/assetPaths.ts), [`packages/shared/src/tooling/symbolReferences.ts`](../../packages/shared/src/tooling/symbolReferences.ts)
- CLI regression tests: [`packages/shared/src/tooling/slopcopAssetCli.test.ts`](../../packages/shared/src/tooling/slopcopAssetCli.test.ts), [`packages/shared/src/tooling/slopcopSymbolsCli.test.ts`](../../packages/shared/src/tooling/slopcopSymbolsCli.test.ts)
- Fixtures: [`tests/integration/fixtures/slopcop-assets`](../../tests/integration/fixtures/slopcop-assets), [`tests/integration/fixtures/slopcop-symbols`](../../tests/integration/fixtures/slopcop-symbols)
- Automation hook: [`scripts/safe-to-commit.mjs`](../../scripts/safe-to-commit.mjs)
- Configuration: [`slopcop.config.json`](../../slopcop.config.json)
