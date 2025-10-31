# MDMD Layer Audit CLI

## Metadata
- Layer: 4
- Implementation ID: IMP-305
- Code Path: [`scripts/analysis/mdmd-layer-audit.ts`](../../../scripts/analysis/mdmd-layer-audit.ts)
- Exports: main, parseArgs, collectLayerReport, logLayerReport

## Purpose
Surface documentation drift by scanning MDMD layers to identify canonical sections and outliers.
- Detect common heading structures per layer so conventions can be codified in instructions.
- Highlight files missing high-signal sections or introducing unusual headings for targeted refactors.
- Provide a fast feedback loop while harmonising MDMD docs toward metadata-driven enforcement.

## Public Symbols

### main
Executes the CLI: parses options, runs layer reports, and streams each report through `logLayerReport` so harmonisation sessions get immediate feedback.

### parseArgs
Normalises CLI switches (`--layer`, `--threshold`, `--limit`, `--help`) and defaults to scanning all layers at a 60% coverage threshold to keep drift checks predictable.

### collectLayerReport
Discovers `.mdmd` files for a layer, tallies canonical headings that clear the threshold, and records per-file deviations so contributors know which docs to update.

### logLayerReport
Formats reports to stdout, including severity-ranked divergences and canonical section coverage, with optional limiting to prioritise the noisiest files.

## Collaborators
- [`glob`](https://www.npmjs.com/package/glob) handles recursive layer traversal with Windows-aware paths.
- Node.js filesystem and path modules read MDMD docs relative to the repository root.
- Layer harmonisation workstreams consume the reports to prioritise documentation cleanup.

## Linked Components
- [COMP-004 – SlopCop Tooling](../../layer-3/slopcop.mdmd.md#comp004-slopcop-tooling)
- [COMP-005 – Knowledge Graph Ingestion](../../layer-3/knowledge-graph-ingestion.mdmd.md#comp005-knowledge-graph-ingestion)

## Evidence
- Manual runs: `npx tsx --tsconfig ./tsconfig.base.json scripts/analysis/mdmd-layer-audit.ts --layer 4 --limit 10` (recently used on 2025-10-30 to locate missing metadata sections).
- Incorporated into documentation harmonisation sessions; outputs recorded in AI-Agent workspace chat transcripts for traceability.

## Operational Notes
- Default threshold 0.6 surfaces sections present in ≥60% of docs; adjust via `--threshold` when adopting new templates.
- Use `--limit` to focus on the highest-severity divergences before broad cleanups.
- Future integration: emit JSON for automated regressions once Symbol Correctness profiles land.
