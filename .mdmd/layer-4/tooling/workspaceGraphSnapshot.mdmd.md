# Workspace Graph Snapshot (Layer 4)

**Created:** 2025-10-24  
**Last Edited:** 2025-10-24

## Source Mapping
- Implementation: [`scripts/graph-tools/snapshot-workspace.ts`](../../../scripts/graph-tools/snapshot-workspace.ts)
- Related tooling: [Graph Coverage Audit](./graphCoverageAudit.mdmd.md), [Symbol Neighbors CLI](./inspectSymbolNeighborsCli.mdmd.md)
- Spec references: [T067](../../../specs/001-link-aware-diagnostics/tasks.md)

## Purpose
Produce a deterministic knowledge-graph snapshot of the current workspace so Copilot (and humans) can dogfood link inference without launching VS Code. The command recreates the SQLite cache and emits a JSON fixture that downstream tests or audits can diff, keeping the graph visible to automation.

## Responsibilities
1. Traverse repository code/document globs (`packages/`, `tests/`, `scripts/`, `.mdmd/`, `specs/`) using the same workspace indexer as the language server to seed artifacts and documentation hints.
2. Run the `LinkInferenceOrchestrator` with a fixed timestamp to generate deterministic artifact IDs, link relationships, and provenance traces.
3. Normalise and sort the resulting artifacts/links, then persist them both to `.link-aware-diagnostics/link-aware-diagnostics.db` and to `data/graph-snapshots/workspace.snapshot.json`.
4. Exit non-zero on failures (bad workspace path, unreadable files) so CI `safe:commit` hooks can detect when the snapshot drifts or cannot be generated.
5. Allow optional overrides (`--workspace`, `--db`, `--output`, `--timestamp`, `--skip-db`, `--quiet`) so other repositories can reuse the tooling without modification.
6. Detect `better-sqlite3` ABI mismatches, run the local rebuild script automatically, and retry the snapshot so Node upgrades do not strand the CLI.

## Collaborators
- Reuses [`createWorkspaceIndexProvider`](../../../packages/server/src/features/knowledge/workspaceIndexProvider.ts) to align seed/hint generation with the server runtime.
- Delegates inference to [`LinkInferenceOrchestrator`](../../../packages/shared/src/inference/linkInference.ts), ensuring parity with the headless CLI and LSP traversal.
- Persists results through [`KnowledgeGraphBridge`](../../../packages/shared/src/knowledge/knowledgeGraphBridge.ts) and [`GraphStore`](../../../packages/shared/src/db/graphStore.ts) to keep schema handling centralized.

## Testing
- **Manual/Ad-hoc:** Run `npm run graph:snapshot` after significant changes; follow with `npm run graph:audit` to validate coverage using the freshly generated cache. Expect the snapshot command to rebuild `better-sqlite3` automatically if an ABI mismatch is detected.
- **Planned automation:** Wire the snapshot command into `npm run safe:commit` so pre-flight checks always operate on the latest deterministic graph fixture.

## Rationale
By owning the graph snapshot generation in-repo, Copilot agents retain continuous visibility over cross-file relationships—even when autosummarisation trims historical context. The deterministic fixture makes graph regressions reviewable in PRs, unlocks fixture-based tests, and provides a trusted baseline for comparing live CLI output against the recorded workspace topology.
