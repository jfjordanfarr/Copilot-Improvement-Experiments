# SlopCop Workspace Linting

## Metadata
- Layer: 3
- Component IDs: COMP-004

## Components

### COMP-004 SlopCop Tooling
Supports REQ-020, REQ-030, REQ-F4, and REQ-F5 by delivering repository-wide linting that blocks hallucinated documentation, stale assets, and missing symbol links before they merge.

## Responsibilities

### Markdown and MDMD Integrity
- Ensure every markdown/MDMD link resolves by running `slopcop:markdown` with GitHub-compatible slugging.
- Emit actionable diagnostics (line/column, relationship context) and JSON output for automation consumers.

### Asset Reference Integrity
- Validate HTML and CSS asset references (`src`, `href`, `url()`) against configured root directories, respecting ignore patterns for hashed filenames and fixtures.
- Fail `npm run safe:commit` when assets drift so static resources remain aligned with MDMD artefacts.

### Symbol Integrity Progression
- Stage S0: audit markdown headings for duplicates and missing anchors.
- Planned stages: correlate Layer 4 exports against knowledge graph symbols (S1), harvest language-level symbols without bespoke compilers (S2), and surface Problems view diagnostics plus auto-repair hints (S3).

### CLI Ergonomics and Adoption
- Maintain deterministic exit codes, Windows-friendly flag forwarding, and `--json` support across SlopCop commands.
- Integrate all passes into `npm run safe:commit` so lint compliance is mandatory before merge.

## Interfaces

### Inbound Interfaces
- Shared configuration via `slopcop.config.json` (include/ignore globs, asset roots, ignore targets).
- Workspace invocation through npm scripts (`slopcop:markdown`, `slopcop:assets`, `slopcop:symbols`).

### Outbound Interfaces
- Diagnostics surfaced to CLI stdout/JSON for humans and automation.
- Safe-to-commit pipeline integration ensuring lint failures halt commits.
- Future Problems view publishing once Symbol Correctness integrates SlopCop findings.

## Linked Implementations

### IMP-201 slopcopMarkdownLinks CLI
CLI entry that enforces markdown/MDMD link integrity. [SlopCop Markdown Audit](/.mdmd/layer-4/tooling/slopcopMarkdownLinks.mdmd.md)

### IMP-202 slopcopAssetPaths CLI
CLI entry that validates static asset references. [SlopCop Asset Audit](/.mdmd/layer-4/tooling/slopcopAssetPaths.mdmd.md)

### IMP-204 slopcopSymbols CLI
CLI entry for heading and symbol audits. [SlopCop Symbol References](/.mdmd/layer-4/tooling/slopcopSymbolReferences.mdmd.md)

### IMP-301 safeToCommit Orchestrator
Chains SlopCop passes alongside verify and graph tooling. [Safe to Commit Pipeline](/.mdmd/layer-4/tooling/safeToCommit.mdmd.md)

### IMP-302 graphCoverageAudit CLI
Audits documentation coverage to complement lint findings. [Graph Coverage Audit](/.mdmd/layer-4/tooling/graphCoverageAudit.mdmd.md)

### IMP-303 inspectSymbolNeighbors CLI
Provides headless dependency exploration referenced by lint diagnostics. [Inspect Symbol Neighbors CLI](/.mdmd/layer-4/tooling/inspectSymbolNeighborsCli.mdmd.md)

## Evidence
- Shared tooling unit tests (`markdownLinks.test.ts`, `assetPaths.test.ts`, `symbolReferences.test.ts`) validate parsing and diagnostics.
- CLI regression tests (`slopcopAssetCli.test.ts`, `slopcopSymbolsCli.test.ts`) and integration fixtures under `tests/integration/fixtures/slopcop-*` demonstrate fail/fix cycles.
- Safe-to-commit logs for 2025-10-29 show SlopCop gating commits before symbol lint passed.

## Operational Notes
- Lint logic lives in shared utilities so CLIs and future extension diagnostics reuse the same engine.
- Upcoming Symbol Correctness work will treat SlopCop symbol findings as guardrails for Layer 4 documentation, eventually feeding auto-repair suggestions.
