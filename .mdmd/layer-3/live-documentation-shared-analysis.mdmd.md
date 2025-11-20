# Live Documentation Shared Analysis

## Metadata
- Layer: 3
- Archetype: component
- Live Doc ID: COMP-shared-livedocs-analysis

## Authored
### Purpose
Describe shared analytics that operate on Live Documentation data, including co-activation clustering that highlights correlated file edits and evidence hot-spots.

### Notes
- Co-activation pipelines crunch Stage‑0 mirrors and historical telemetry to suggest related artifacts, powering the “what else will this touch?” narrative.
- Analysis helpers emit summaries consumed by the extension status view and future dashboards, giving maintainers a ranked list of docs needing review.
- Because analytics depend on deterministic mirrors, they run after regeneration finishes and persist results to temp locations until explicitly published.

### Strategy
- Extend clustering to incorporate benchmark deltas and docstring drift signals so adoption dashboards can prioritise root causes.
- Explore streaming variants that update co-activation insights after each regeneration instead of batch refreshes.

## System References
### Components
- [packages/shared/src/live-docs/analysis/coActivation.ts](../layer-4/packages/shared/src/live-docs/analysis/coActivation.ts.mdmd.md)

## Evidence
- `npm run live-docs:system -- --target shared/live-docs/analysis --json` output drives manual audits of cluster accuracy; keep snapshots under `AI-Agent-Workspace/tmp/system-cli-output` for reference.
- Planned headless analytics tests will lock in clustering thresholds once datasets stabilise.
