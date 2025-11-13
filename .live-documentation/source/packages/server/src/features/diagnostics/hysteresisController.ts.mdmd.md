# packages/server/src/features/diagnostics/hysteresisController.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/diagnostics/hysteresisController.ts
- Live Doc ID: LD-implementation-packages-server-src-features-diagnostics-hysteresiscontroller-ts
- Generated At: 2025-11-13T13:25:19.642Z

## Authored
### Purpose
Tracks short-lived suppression windows between trigger/target artifact pairs so reciprocal diagnostics don’t bounce back and forth while earlier alerts remain active.

### Notes
- `recordEmission` stores an entry keyed by trigger→target; acknowledgements clear both directions to reset the window once the team handles the alert.
- `shouldSuppress` consults the reverse direction and prunes stale entries based on configurable windows, keeping the in-memory map bounded even under heavy churn.
- Exposes `reset` and `getActiveCount` for integration tests and observability hooks without leaking internal map structure.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-13T13:25:19.642Z","inputHash":"6124ffae3d61535d"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `HysteresisControllerOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/hysteresisController.ts#L1)

#### `HysteresisController`
- Type: class
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/hysteresisController.ts#L26)

##### `HysteresisController` — Summary
Maintains short-lived suppression windows that prevent reciprocal diagnostics from ricocheting
between linked artifacts while an earlier alert is still active. The controller is intentionally
lightweight and in-memory; acknowledgement workflows will clear entries explicitly once they
land, and periodic pruning keeps the working set bounded.
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_No dependencies documented yet_
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [acknowledgementService.test.ts](./acknowledgementService.test.ts.mdmd.md)
- [hysteresisController.test.ts](./hysteresisController.test.ts.mdmd.md)
- [publishDocDiagnostics.test.ts](./publishDocDiagnostics.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
