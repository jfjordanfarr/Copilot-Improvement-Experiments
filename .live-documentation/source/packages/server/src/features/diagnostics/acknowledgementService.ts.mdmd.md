# packages/server/src/features/diagnostics/acknowledgementService.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/diagnostics/acknowledgementService.ts
- Live Doc ID: LD-implementation-packages-server-src-features-diagnostics-acknowledgementservice-ts
- Generated At: 2025-11-14T18:42:06.316Z

## Authored
### Purpose
Coordinates diagnostic acknowledgement workflows: determines whether new drift alerts should emit, records updates in the graph store, and logs acknowledgements so hysteresis and audit history remain consistent.

### Notes
- Wraps `GraphStore` persistence for both active diagnostics and acknowledgement history, ensuring repeated emissions refresh existing records instead of duplicating them.
- Relies on `HysteresisController` to clear suppression windows after acknowledgement, preventing redundant follow-up alerts until new evidence appears.
- Accepts an injected clock (`now`) to keep tests deterministic; production default uses the current time when issuing IDs and timestamps.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.316Z","inputHash":"2ad1f24e7f72e62c"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `AcknowledgementServiceOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/acknowledgementService.ts#L40)

#### `AcknowledgeDiagnosticInput`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/acknowledgementService.ts#L49)

#### `ShouldEmitDiagnosticInput`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/acknowledgementService.ts#L55)

#### `RegisterDiagnosticEmissionInput`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/acknowledgementService.ts#L61)

#### `AcknowledgeOutcome`
- Type: type
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/acknowledgementService.ts#L67)

#### `AcknowledgementService`
- Type: class
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/acknowledgementService.ts#L72)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `AcknowledgementAction`, `DiagnosticRecord`, `DiagnosticSeverity`, `GraphStore` (type-only)
- `node:crypto` - `randomUUID`
- [`hysteresisController.HysteresisController`](./hysteresisController.ts.mdmd.md#hysteresiscontroller) (type-only)
- [`settingsBridge.RuntimeSettings`](../settings/settingsBridge.ts.mdmd.md#runtimesettings) (type-only)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [acknowledgementService.test.ts](./acknowledgementService.test.ts.mdmd.md)
- [publishDocDiagnostics.test.ts](./publishDocDiagnostics.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
