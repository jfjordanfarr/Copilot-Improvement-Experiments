# Inspect Symbol Neighbors CLI

## Metadata
- Layer: 4
- Implementation ID: IMP-303
- Code Path: [`scripts/graph-tools/inspect-symbol.ts`](../../../scripts/graph-tools/inspect-symbol.ts)
- Exports: main, parseArgs, printResult

## Purpose
Offer a deterministic CLI for exploring symbol neighborhoods without launching VS Code. The command mirrors the extension’s dependency explorer so maintainers, CI tasks, and Copilot agents can interrogate the knowledge graph, inspect relationship kinds, and capture reproducible traversal output when debugging ripple coverage.

## Public Symbols

### main
Entry point executed by `npm run graph:inspect`; validates CLI options, resolves the graph database, executes neighbor traversal, and handles exit codes so automation can gate on failures.

### parseArgs
Parses and validates command-line flags (`--id`, `--uri`, `--file`, `--max-depth`, `--kinds`, `--json`, etc.), ensuring callers can target artifacts consistently whether they identify them by path or stored ID.

### printResult
Renders traversal outcomes as JSON or grouped text, echoing hop depths and confidence scores to match the extension’s quick pick formatting while remaining script-friendly.

## Collaborators
- [`packages/shared/src/db/graphStore.ts`](../../../packages/shared/src/db/graphStore.ts) supplies read-only access to the persisted knowledge graph.
- [`packages/server/src/features/dependencies/symbolNeighbors.ts`](../../../packages/server/src/features/dependencies/symbolNeighbors.ts) performs the traversal shared with the extension command.
- [`packages/server/src/runtime/environment.ts`](../../../packages/server/src/runtime/environment.ts) centralises workspace storage conventions used when callers omit `--db`.

## Linked Components
- [COMP-002 – Extension Surfaces](../../layer-3/extension-surfaces.mdmd.md#imp303-inspectsymbolneighbors-cli)
- [COMP-004 – SlopCop Tooling](../../layer-3/slopcop.mdmd.md#imp303-inspectsymbolneighbors-cli)

## Evidence
- Integration test: [`tests/integration/us4/inspectSymbolNeighbors.test.ts`](../../../tests/integration/us4/inspectSymbolNeighbors.test.ts) exercises the same traversal via the extension entry point.
- Manual verification: `npm run graph:inspect -- --file packages/server/src/main.ts` confirms CLI parity across platforms.
- `npm run safe:commit` includes `graph:inspect -- --list-kinds` smoke checks when new relationship types land.

## Operational Notes
- Exit codes differentiate invalid args (1), missing DB (2), unresolved target (3), and unexpected errors (4) so scripts can react precisely.
- `--list-kinds` prints recognised relationship kinds, helping contributors discover new graph edges during development.
- When reading from `--file`, the CLI converts paths to `file://` URIs automatically; use `--uri` for remote artifacts emitted by future graph providers.
- Future improvement: add optional hop-grouped output or relationship-kind filters so large traversals surface the most relevant neighbours without manual post-processing.
