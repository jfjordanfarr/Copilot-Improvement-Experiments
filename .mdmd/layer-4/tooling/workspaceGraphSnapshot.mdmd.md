# Workspace Graph Snapshot

## Metadata
- Layer: 4
- Implementation ID: IMP-304
- Code Path: [`scripts/graph-tools/snapshot-workspace.ts`](../../../scripts/graph-tools/snapshot-workspace.ts)
- Exports: main, parseArgs, writeDatabaseWithRecovery, snapshotWorkspace, SnapshotWorkspaceOptions, SnapshotWorkspaceResult, DEFAULT_DB, DEFAULT_OUTPUT

## Purpose
Produce a deterministic knowledge-graph snapshot of the current workspace so agents and humans can diff cross-file relationships without launching VS Code. The CLI rebuilds the SQLite cache and companion JSON fixture that other tooling, tests, and audits rely on for reproducible graph state.

## Public Symbols

### main
Parses CLI flags, verifies the workspace root, orchestrates link inference, and writes both the SQLite cache and JSON snapshot so automation has a fresh graph baseline.

### parseArgs
Supports the CLI surface (`--workspace`, `--db`, `--output`, `--timestamp`, `--skip-db`, `--quiet`, `--help`) while validating required values to keep builds and pipelines deterministic.

### writeDatabaseWithRecovery
Persists the snapshot into a SQLite database, rebuilding `better-sqlite3` automatically when Node ABI mismatches surface so developers stay unblocked after upgrades.

### snapshotWorkspace
Reusable helper that performs the snapshot orchestration programmatically, enabling other CLIs (for example, `graph:audit`) to guarantee a fresh cache without shelling out through npm.

### SnapshotWorkspaceOptions / SnapshotWorkspaceResult
Describe the configuration surface and return payload for `snapshotWorkspace`, making it easy for internal tooling to integrate the snapshot process while reusing deterministic defaults.

### DEFAULT_DB / DEFAULT_OUTPUT
Expose the canonical relative paths for the SQLite cache and JSON fixture so downstream tooling (for example, `graph:audit`) can reuse deterministic locations without duplicating string literals.

## Collaborators
- [`createWorkspaceIndexProvider`](../../../packages/server/src/features/knowledge/workspaceIndexProvider.ts) supplies the same artifact discovery used by the language server.
- [`LinkInferenceOrchestrator`](../../../packages/shared/src/inference/linkInference.ts) generates artifacts and relationships with deterministic timestamps.
- [`KnowledgeGraphBridge`](../../../packages/shared/src/knowledge/knowledgeGraphBridge.ts) and [`GraphStore`](../../../packages/shared/src/db/graphStore.ts) ingest and persist the resulting snapshot.
- [`scripts/rebuild-better-sqlite3.mjs`](../../../scripts/rebuild-better-sqlite3.mjs) is invoked when native bindings need to be rebuilt.

## Linked Components
- [COMP-002 – Extension Surfaces](../../layer-3/extension-surfaces.mdmd.md#imp304-graphsnapshot-cli)

## Evidence
- `npm run graph:snapshot` rebuilds the snapshot and SQLite cache; `npm run graph:audit` now triggers the same helper internally, so audits always run against the latest cache even when invoked standalone.
- `npm run safe:commit` executes the snapshot before audits, ensuring graph fixtures match the current workspace prior to CI hand-off.
- `tests/integration/benchmarks/rebuildStability.test.ts` verifies repeated snapshots stay identical across runs.

## Operational Notes
- Default timestamp `2025-01-01T00:00:00.000Z` keeps IDs stable for fixture diffing; override with `--timestamp` for historical captures.
- `--skip-db` supports read-only scenarios where only the JSON fixture is necessary.
- CLI emits exit code 1 on invalid flags, propagates inference failures, and logs artifact/link counts when not in `--quiet` mode.
