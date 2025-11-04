# Graph Coverage Audit

## Metadata
- Layer: 4
- Implementation ID: IMP-302
- Code Path: [`scripts/graph-tools/audit-doc-coverage.ts`](../../../scripts/graph-tools/audit-doc-coverage.ts)
- Exports: main, parseArgs, auditCoverage, printReport

## Purpose
Offer a headless CLI that highlights knowledge-graph coverage gaps—code artifacts without documentation links, MDMD documents without code relationships, and exported symbols lacking references—so ripple traceability stays verifiable.

## Public Symbols

### main
Parses CLI flags, resolves the SQLite cache, orchestrates the audit, and sets process exit codes so automation can gate on failures.

### parseArgs
Validates CLI options (`--workspace`, `--db`, `--json`, `--strict-symbols`) and enforces friendly error messages for missing values or unknown flags.

### auditCoverage
Interrogates the graph store, compiles missing documentation, orphan documents, symbol coverage gaps, and document symbol orphans into a structured report.

### printReport
Formats audit results to stdout as either human-readable tables or JSON depending on CLI flags, returning exit codes consistent with detected gaps.

## Responsibilities
- Discover the workspace graph cache (or custom `--db`) and load symbol-ignore configuration from `symbol-coverage.ignore.json`.
- Rebuild the workspace snapshot ahead of auditing so coverage checks never operate on stale caches.
- Enumerate artifacts via `GraphStore`, separating code vs. documentation layers and tracking exported symbol coverage.
- Emit missing documentation lists, orphan documents, and symbol gaps, promoting them to fatal errors when `--strict-symbols` is set.
- Support JSON output for downstream tooling so `safe:commit` and CI can diff or store regression fixtures.

## Collaborators
- [`@copilot-improvement/shared`](../../../packages/shared/src/db/graphStore.ts) supplies graph accessors, artifact layering, and relationship enums.
- Symbol ignore configuration (`symbol-coverage.ignore.json`) lets teams silence intentional gaps without editing code.
- Companion tooling: [Inspect Symbol Neighbors CLI](./inspectSymbolNeighborsCli.mdmd.md) offers drill-down once gaps are known.

## Linked Components
- [COMP-002 – Extension Surfaces](../../layer-3/extension-surfaces.mdmd.md)
- [COMP-007 – Diagnostics Benchmarking](../../layer-3/benchmark-telemetry-pipeline.mdmd.md)
- [COMP-004 – SlopCop Tooling](../../layer-3/slopcop.mdmd.md)

## Evidence
- Manual execution: `npm run graph:audit -- --workspace .` (exit 3 on gaps, 5 when symbol enforcement fails). The CLI now refreshes the snapshot automatically, eliminating stale-cache false positives.
- Integrated into `npm run safe:commit`, which halts on non-zero exit codes—see AI-Agent workspace logs (2025-10-30) for recent failures.
- Planned regression fixtures (`tests/integration/graph-tools`) will capture golden JSON outputs once the profile validator lands.

## Operational Notes
- Exit codes differentiate invalid args (1), missing DB (2), coverage gaps (3), uncaught errors (4), and symbol gaps (5) for precise automation handling.
- JSON output includes symbol orphan details so future Symbol Correctness profiles can assert per-heading coverage.
- Upcoming Symbol Correctness integration will reuse the same reporting pipeline, keeping audit and extension diagnostics aligned.
