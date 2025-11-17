# packages/server/src/features/diagnostics/hysteresisController.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/diagnostics/hysteresisController.ts
- Live Doc ID: LD-implementation-packages-server-src-features-diagnostics-hysteresiscontroller-ts
- Generated At: 2025-11-16T20:43:30.234Z

## Authored
### Purpose
Suppresses reciprocal diagnostics for a short window so change ripples do not bounce endlessly between linked files, fulfilling the hysteresis requirement shipped in [2025-10-19 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-19.SUMMARIZED.md).

### Notes
- Keeps state in-memory with explicit acknowledgement hooks, ensuring the controller complements (rather than duplicates) acknowledgement persistence.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T20:43:30.234Z","inputHash":"81c1ce74e67e42ce"}]} -->
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
