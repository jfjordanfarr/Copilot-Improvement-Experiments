# Doc Diagnostic Provider Tests

## Metadata
- Layer: 4
- Implementation ID: IMP-701
- Code Path: [`packages/extension/src/diagnostics/docDiagnosticProvider.test.ts`](../../../../packages/extension/src/diagnostics/docDiagnosticProvider.test.ts)
- Exports:

## Purpose
Exercise the extension-side diagnostics provider to guarantee quick-fix commands, ripple summaries, and confidence labelling stay stable as the underlying surface evolves.
- Guard the command registration path so markdown diagnostics emit actionable quick fixes.
- Assert ripple summary formatting for depth and confidence labels mirrors the Problems view.
- Prove helper-formatters remain tolerant of partial server payloads.

## Public Symbols
- Verifies `registerDocDiagnosticProvider` wires Problems quick fixes for markdown and code documents.
- Confirms `buildOpenActionTitle` and `buildRippleSummary` reflect relationship metadata provided by the server.
- Exercises `formatConfidenceLabel` to keep human-readable percentages aligned with telemetry expectations.

## Collaborators
- [`packages/extension/src/diagnostics/docDiagnosticProvider.ts`](../../../../packages/extension/src/diagnostics/docDiagnosticProvider.ts) – implementation under test.
- [`packages/server/src/features/diagnostics/publishDocDiagnostics.ts`](../../../../packages/server/src/features/diagnostics/publishDocDiagnostics.ts) – upstream diagnostics payload source.
- [`packages/extension/src/testing/testHooks.ts`](../../../../packages/extension/src/testing/testHooks.ts) – window API seam used to stub quick-pick interactions.

## Linked Components
- [COMP-001 – Diagnostics Pipeline](../../../layer-3/diagnostics-pipeline.mdmd.md#comp001-diagnostics-pipeline)
- [COMP-002 – Extension Surfaces](../../../layer-3/extension-surfaces.mdmd.md#comp002-extension-surfaces)

## Evidence
- Runs under `npm run test:unit`, producing deterministic Vitest snapshots for quick-fix payloads.
- Featured in `npm run safe:commit`, blocking regressions in Problems command registration.

## Operational Notes
- Test harness relies on extension test hooks; update `resolveWindowApis` when new VS Code interactions are added.
- Prefer fixture builders for ripple metadata to keep assertions resilient to payload shape tweaks.
