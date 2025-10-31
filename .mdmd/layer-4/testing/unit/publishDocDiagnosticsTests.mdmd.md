# Publish Doc Diagnostics Tests

## Metadata
- Layer: 4
- Implementation ID: IMP-702
- Code Path: [`packages/server/src/features/diagnostics/publishDocDiagnostics.test.ts`](../../../../packages/server/src/features/diagnostics/publishDocDiagnostics.test.ts)
- Exports:

## Purpose
Validate the server-side diagnostics publisher to ensure documentation ripple alerts remain accurate, deduplicated, and acknowledgement-aware.
- Confirm diagnostics payloads include ripple metadata, acknowledgement tokens, and code/doc parity.
- Verify change batching and hysteresis logic do not regress when documentation churns rapidly.
- Guard formatting of Problems view message text so quick fixes remain actionable.

## Public Symbols
- Exercises `publishDocDiagnostics` end-to-end via mocked graph inputs to prove payload structure.
- Covers helper utilities such as acknowledgement token derivation and change filtering.

## Collaborators
- [`packages/server/src/features/diagnostics/publishDocDiagnostics.ts`](../../../../packages/server/src/features/diagnostics/publishDocDiagnostics.ts) – implementation under test.
- [`packages/server/src/features/diagnostics/diagnosticUtils.ts`](../../../../packages/server/src/features/diagnostics/diagnosticUtils.ts) – shared formatting helpers leveraged by the publisher.
- [`packages/server/src/features/diagnostics/hysteresisController.ts`](../../../../packages/server/src/features/diagnostics/hysteresisController.ts) – noise controls simulated within the test harness.

## Linked Components
- [COMP-001 – Diagnostics Pipeline](../../../layer-3/diagnostics-pipeline.mdmd.md#comp001-diagnostics-pipeline)
- [COMP-003 – Language Server Runtime](../../../layer-3/language-server-architecture.mdmd.md#comp003-language-server-runtime)

## Evidence
- Executes under `npm run test:unit`, providing deterministic Vitest coverage for documentation payloads.
- Integrated into the `safe:commit` pipeline to guard against ripple regression leaks.

## Operational Notes
- Harness mocks the graph store; refresh fixtures when new ripple facets are introduced.
- Extend the suite when telemetry fields change so downstream Problems surfaces retain parity.
