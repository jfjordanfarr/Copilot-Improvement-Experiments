# Live Documentation Server

## Metadata
- Layer: 3
- Archetype: component
- Live Doc ID: COMP-server-livedocs

## Authored
### Purpose
Capture how the server generates and stages Live Documentation—turning graph snapshots into deterministic markdown, coordinating evidence bridges, and hosting the headless harness used in CI.

### Notes
- The generator consumes graph snapshots plus Stage‑0 authored sections to rebuild mirrors while preserving human context; provenance markers track analyzer versions for auditability.
- Evidence Bridge and harness utilities ensure implementations collect Observed Evidence from integration suites before regeneration marks them as healthy.
- Stage‑0 loaders provide a deterministic cache for extension consumers while keeping regeneration idempotent across incremental runs.
- System layer materialisers stay out of the tracked tree; they publish insights to the tmp workspace so maintainers can review before promoting to Layer‑3 docs.

### Strategy
- Continue converging on a single pipeline that can regenerate both Stage‑0 mirrors and `.live-documentation/system` views, reducing drift between CLI and server outputs.
- Expand telemetry hooks around regeneration timing and evidence gaps so safe-commit can fail early when the pipeline slows down or drops coverage.

## System References
### Components
- [packages/server/src/features/live-docs/generator.ts](../layer-4/packages/server/src/features/live-docs/generator.ts.mdmd.md)
- [packages/server/src/features/live-docs/system/generator.ts](../layer-4/packages/server/src/features/live-docs/system/generator.ts.mdmd.md)
- [packages/server/src/features/live-docs/evidenceBridge.ts](../layer-4/packages/server/src/features/live-docs/evidenceBridge.ts.mdmd.md)
- [packages/server/src/features/live-docs/harness/headlessHarness.ts](../layer-4/packages/server/src/features/live-docs/harness/headlessHarness.ts.mdmd.md)
- [packages/server/src/features/live-docs/stage0/docLoader.ts](../layer-4/packages/server/src/features/live-docs/stage0/docLoader.ts.mdmd.md)

## Evidence
- Integration suite `tests/integration/live-docs/generation.test.ts` protects deterministic regeneration and authored-section preservation.
- Headless harness scenarios (Ruby/Python/TypeScript) run nightly via `npm run live-docs:system -- --target harness` to verify cross-language coverage.
