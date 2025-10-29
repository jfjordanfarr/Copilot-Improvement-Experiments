# Benchmark Repo Paths Helper (Layer 4)

## Source Mapping
- Implementation: [`tests/integration/benchmarks/utils/repoPaths.ts`](../../../../tests/integration/benchmarks/utils/repoPaths.ts)
- Recorder integration: [`tests/integration/benchmarks/utils/benchmarkRecorder.ts`](../../../../tests/integration/benchmarks/utils/benchmarkRecorder.ts)
- Harness consumers: [`tests/integration/benchmarks/rebuildStability.test.ts`](../../../../tests/integration/benchmarks/rebuildStability.test.ts)
- Architecture context: [Benchmark & Telemetry Reporting](../../../layer-3/benchmark-telemetry-pipeline.mdmd.md)

## Purpose
Provide deterministic access to the monorepo root when integration benchmarks execute inside VS Code's `.vscode-test` scratch directories so snapshot output, fixture discovery, and auxiliary scripts resolve to stable locations.

## Behaviour
- Walks parent directories from the caller's location until it discovers the workspace `package.json` with the expected workspaces layout, caching the result for repeat lookups.
- Validates candidate roots by checking for the top-level manifest and the extension workspace to avoid matching nested `node_modules` manifests.
- Exposes `resolveRepoPath` to build absolute paths into the repository for fixtures, temp outputs, and CLI scripts.

## Interactions
- [`benchmarkRecorder.ts`](../../../../tests/integration/benchmarks/utils/benchmarkRecorder.ts) calls `resolveRepoPath` to locate the default JSON output directory under `AI-Agent-Workspace/tmp/benchmarks`.
- Benchmark suites ([`rebuildStability.test.ts`](../../../../tests/integration/benchmarks/rebuildStability.test.ts), [`astAccuracy.test.ts`](../../../../tests/integration/benchmarks/astAccuracy.test.ts)) use `getRepoRoot` to seed spawn working directories and fixture lookups during integration runs.

## Evidence
- Integration benchmark run: [`tests/integration/benchmarks/rebuildStability.test.ts`](../../../../tests/integration/benchmarks/rebuildStability.test.ts)
- Deterministic snapshot generation captured by `npm run test:integration` relies on the cached root to compare successive graph builds.

## Exported Symbols

#### getRepoRoot
Discovers and memoises the repository root regardless of the child process working directory established by VS Code's integration harness.

#### resolveRepoPath
Combines the cached repository root with additional path segments so benchmark utilities can reference fixtures and output directories with absolute paths.
