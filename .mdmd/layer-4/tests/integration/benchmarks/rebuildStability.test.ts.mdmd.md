# tests/integration/benchmarks/rebuildStability.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: tests/integration/benchmarks/rebuildStability.test.ts
- Live Doc ID: LD-test-tests-integration-benchmarks-rebuildstability-test-ts
- Generated At: 2025-11-16T22:34:14.258Z

## Authored
### Purpose
Runs the graph snapshot CLI repeatedly to prove rebuilds stay byte-identical while logging benchmark metrics for the hosted stability report ([benchmark harness creation](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-28.md#L3096-L3120)).

### Notes
- Exercises the shared repo-path helper and Electron spawn flags added to keep benchmark processes stable inside the VS Code harness ([stability refactor](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-28.md#L4084-L4114)).
- Persists iteration timings and drift flags through `writeBenchmarkResult` so the reports surface average/max rebuild costs (`rebuild-stability` suite) during integration runs ([harness recap](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-29.md#L100-L170)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:14.258Z","inputHash":"381d87f77f5823ff"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:assert` - `strict`
- `node:child_process` - `spawn`
- `node:fs` - `promises`
- `node:os` - `os`
- `node:path` - `path`
- [`benchmarkRecorder.writeBenchmarkResult`](./utils/benchmarkRecorder.ts.mdmd.md#writebenchmarkresult)
- [`repoPaths.getRepoRoot`](./utils/repoPaths.ts.mdmd.md#getreporoot)
- [`repoPaths.resolveRepoPath`](./utils/repoPaths.ts.mdmd.md#resolverepopath)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
_No targets documented yet_
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
