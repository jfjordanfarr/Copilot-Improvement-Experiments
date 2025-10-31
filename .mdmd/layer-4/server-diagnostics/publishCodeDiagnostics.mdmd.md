# Publish Code Diagnostics

## Metadata
- Layer: 4
- Implementation ID: IMP-104
- Code Path: [`packages/server/src/features/diagnostics/publishCodeDiagnostics.ts`](../../../packages/server/src/features/diagnostics/publishCodeDiagnostics.ts)
- Exports: CodeChangeContext, PublishCodeDiagnosticsOptions, PublishCodeDiagnosticsResult, publishCodeDiagnostics

## Purpose
Publish ripple diagnostics for dependent code files while respecting suppression budgets, hysteresis windows, and acknowledgement state so Problems entries stay actionable.

## Public Symbols

### CodeChangeContext
Aggregates change-event metadata, ripple impacts, and the originating change id for each triggering artifact.

### PublishCodeDiagnosticsOptions
Invocation contract that supplies runtime settings, acknowledgement and hysteresis controllers, and the LSP diagnostic sender.

### PublishCodeDiagnosticsResult
Summary counters describing emitted diagnostics and suppression reasons (budget, hysteresis, acknowledgement, missing dependents, noise filter).

### publishCodeDiagnostics
Core workflow that trims ripple impacts, buckets diagnostics per target URI, enforces suppression layers, and dispatches results to the language client.

## Responsibilities
- Consume `CodeChangeContext` batches from the change processor and normalise URIs before publishing.
- Apply noise filtering, per-batch budgets, and hysteresis checks, logging suppression metrics for tuning.
- Emit diagnostics enriched with relationship metadata (`relationshipKind`, `confidence`, `depth`, `path`, `changeEventId`) consumed by the extension’s quick fixes and hovers.
- Persist acknowledgement metadata so subsequent runs respect operator decisions.

## Collaborators
- [`packages/server/src/features/diagnostics/acknowledgementService.ts`](../../../packages/server/src/features/diagnostics/acknowledgementService.ts) supplies acknowledgement gating.
- [`packages/server/src/features/diagnostics/hysteresisController.ts`](../../../packages/server/src/features/diagnostics/hysteresisController.ts) manages cooldown windows.
- [`packages/shared/src/db/graphStore.ts`](../../../packages/shared/src/db/graphStore.ts) persists diagnostic artefacts and acknowledgement logs.

## Linked Components
- [COMP-001 – Diagnostics Pipeline](../../layer-3/diagnostics-pipeline.mdmd.md)
- [COMP-003 – Language Server Runtime](../../layer-3/language-server-architecture.mdmd.md)

## Evidence
- Integration suites: `tests/integration/us1/codeImpact.test.ts` and `tests/integration/us5/transformRipple.test.ts` assert emitted diagnostics and metadata.
- Safe-to-commit runs capture `publishCodeDiagnostics` regressions via ripple pipeline checks (see AI-Agent Workspace logs for 2025-10-29).

## Operational Notes
- Diagnostics messages use `normaliseDisplayPath` so Windows environments avoid `file://` noise.
- Missing dependents increment `withoutDependents`, signalling upstream inference gaps for future bridge tooling.
- Planned unit coverage (T053) will lock suppression counters once harness scaffolding stabilises.
