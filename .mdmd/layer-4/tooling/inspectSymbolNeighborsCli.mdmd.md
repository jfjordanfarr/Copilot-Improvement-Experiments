# Symbol Neighbors CLI (Layer 4)

**Created:** 2025-10-24  
**Last Edited:** 2025-10-24

## Source Mapping
- Implementation: [`scripts/graph-tools/inspect-symbol.ts`](../../../scripts/graph-tools/inspect-symbol.ts)
- Parent designs: [Extension Surfaces Architecture](../../layer-3/extension-surfaces.mdmd.md), [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)
- Spec references: [T067](../../../specs/001-link-aware-diagnostics/tasks.md)

## Purpose
Provide a headless entry point for maintainers and Copilot agents to query symbol neighborhoods without launching the VS Code host. The CLI mirrors the quick pick command, making it possible to inspect graph quality inside CI logs, shell sessions, or scripted notebooks while reusing the existing traversal service and graph store.

## Responsibilities
1. Parse CLI flags for target selection (artifact id, file path, or URI), hop-depth controls, relationship filters, and output format.
2. Resolve the SQLite knowledge-store location using either an explicit `--db` path or the workspace-scoped `.link-aware-diagnostics/link-aware-diagnostics.db` default.
3. Instantiate a `GraphStore` against the resolved database and invoke the existing `inspectSymbolNeighbors` traversal, propagating hop-depth and link-kind filters.
4. Render results as either human-readable grouped output or JSON suitable for downstream tooling, including traversal paths and confidence scores.
5. Exit with non-zero codes when the target artifact cannot be resolved or when the graph database is missing, preventing silent failures in automation.

## Collaborators
- Uses the shared `GraphStore` implementation from [`packages/shared/src/db/graphStore.ts`](../../../packages/shared/src/db/graphStore.ts) for read-only graph access.
- Reuses the traversal logic from [`packages/server/src/features/dependencies/symbolNeighbors.ts`](../../../packages/server/src/features/dependencies/symbolNeighbors.ts) to guarantee CLI parity with the language-server command.
- Relies on workspace storage conventions defined in [`packages/server/src/runtime/environment.ts`](../../../packages/server/src/runtime/environment.ts) to locate the persisted database when `--db` is not specified.

## Testing
- **Integration Coverage (shared)**: [`tests/integration/us4/inspectSymbolNeighbors.test.ts`](../../../tests/integration/us4/inspectSymbolNeighbors.test.ts) exercises the same traversal pipeline through the extension command, ensuring the CLI surfaces identical graph semantics.
- **Manual/Ad-hoc**: The CLI is intended for developer instrumentation; its behavior is validated by smoke-running `npm run graph:inspect -- --file path/to/file.ts` against the sample fixture workspaces.

## Rationale
Dogfooding the symbol-neighbor traversal outside VS Code shortens the feedback loop when diagnosing graph drift or onboarding new maintainers. Baking the tool into the repository keeps auditors from relying on bespoke SQL queries, and the shared traversal guarantees parity between headless workflows and the extension UX. The CLI’s explicit exit codes make it safe to wire into scripts that gate releases or capture reproducible snapshots of dependency neighborhoods.
