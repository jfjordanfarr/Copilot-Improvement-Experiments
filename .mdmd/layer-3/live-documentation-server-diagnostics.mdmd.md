# Live Documentation Server Diagnostics

## Metadata
- Layer: 3
- Archetype: component
- Live Doc ID: COMP-server-diagnostics

## Authored
### Purpose
Explain how the server detects, prioritises, and publishes Live Documentation diagnostics—building queues, applying hysteresis, and coordinating acknowledgement records with the extension.

### Notes
- Change events join a shared queue where diagnostics batches inherit the same provenance metadata used by Stage‑0 regeneration; this keeps Problems-panel messages traceable back to analyzer runs.
- Hysteresis controllers dampen noise by tracking repeated failures, ensuring flaky evidence or transient drift does not overwhelm authors.
- Acknowledgement flows persist user intent so resolved issues stay silent until new evidence reopens them, mirroring the doc lint gates enforced during safe-commit.
- Symbol correctness validation runs in monitor mode by default, warning when rule profiles lack required relationships without blocking rapid iteration.

### Strategy
- Promote symbol correctness profiles into enforce mode once Layer‑3 coverage settles, turning today’s warnings into hard failures for missing chains.
- Continue pairing acknowledgement telemetry with extension UX to surface remediation guidance where authors spend their time.

## System References
### Components
- [packages/server/src/features/changeEvents/changeQueue.ts](../layer-4/packages/server/src/features/changeEvents/changeQueue.ts.mdmd.md)
- [packages/server/src/features/diagnostics/diagnosticPublisher.ts](../layer-4/packages/server/src/features/diagnostics/diagnosticPublisher.ts.mdmd.md)
- [packages/server/src/features/diagnostics/hysteresisController.ts](../layer-4/packages/server/src/features/diagnostics/hysteresisController.ts.mdmd.md)
- [packages/server/src/features/diagnostics/acknowledgementService.ts](../layer-4/packages/server/src/features/diagnostics/acknowledgementService.ts.mdmd.md)
- [packages/server/src/features/diagnostics/symbolCorrectnessValidator.ts](../layer-4/packages/server/src/features/diagnostics/symbolCorrectnessValidator.ts.mdmd.md)

## Evidence
- US1–US4 integration suites assert diagnostic delivery, acknowledgement persistence, and hysteresis boundaries across doc drift scenarios.
- `npm run graph:audit -- --json` exercises the validator in monitor mode, producing the JSON feed consumed by Problems-panel surfaces and CI output.
