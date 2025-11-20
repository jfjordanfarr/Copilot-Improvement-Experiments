# Live Documentation Server Core

## Metadata
- Layer: 3
- Archetype: component
- Live Doc ID: COMP-server-core

## Authored
### Purpose
Document the core runtime of the Live Documentation server—dependency harvesting, change processing, configuration bridges, and telemetry infrastructure that keep the graph up to date.

### Notes
- `changeProcessor` orchestrates workspace scans, regeneration scheduling, and feed refreshes whenever file events, CLI calls, or extension commands arrive.
- Runtime settings translate user configuration (feature flags, relationship profile modes) into typed contracts consumed by diagnostics, ingestion, and regeneration subsystems.
- Artifact/watch pipelines ensure the server only regenerates affected mirrors, protecting performance on large workspaces while still emitting precise change telemetry.
- Dependency builders funnel analyzer outputs into `GraphStore`, which Stage‑0 generation and diagnostics rely on for consistent relationships.

### Strategy
- Harden incremental snapshotting so repeated change bursts reuse cached analyzer artifacts without sacrificing determinism.
- Continue expanding telemetry coverage—particularly around queue depth and regeneration latency—to feed the benchmark dashboards.

## System References
### Components
- [packages/server/src/main.ts](../layer-4/packages/server/src/main.ts.mdmd.md)
- [packages/server/src/runtime/changeProcessor.ts](../layer-4/packages/server/src/runtime/changeProcessor.ts.mdmd.md)
- [packages/server/src/runtime/settings.ts](../layer-4/packages/server/src/runtime/settings.ts.mdmd.md)
- [packages/server/src/features/watchers/artifactWatcher.ts](../layer-4/packages/server/src/features/watchers/artifactWatcher.ts.mdmd.md)
- [packages/server/src/features/dependencies/buildCodeGraph.ts](../layer-4/packages/server/src/features/dependencies/buildCodeGraph.ts.mdmd.md)

## Evidence
- Server unit suites for `changeProcessor` and `artifactWatcher` validate incremental rebuilds and queue coordination.
- Benchmark pipeline (`reports/benchmarks/self-similarity/rebuild-stability.json`) captures runtime stability metrics whenever safe-commit executes.
