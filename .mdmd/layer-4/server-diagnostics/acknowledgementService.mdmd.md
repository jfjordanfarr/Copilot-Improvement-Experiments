# Acknowledgement Service

## Metadata
- Layer: 4
- Implementation ID: IMP-105
- Code Path: [`packages/server/src/features/diagnostics/acknowledgementService.ts`](../../../packages/server/src/features/diagnostics/acknowledgementService.ts)
- Exports: AcknowledgementServiceOptions, AcknowledgeDiagnosticInput, ShouldEmitDiagnosticInput, RegisterDiagnosticEmissionInput, AcknowledgeOutcome, AcknowledgementService

## Purpose
Own acknowledgement state for ripple diagnostics so acknowledged alerts stay muted until new evidence arrives, while preserving audit trails and hysteresis alignment.

## Public Symbols

### AcknowledgementServiceOptions
Dependency bundle (graph store, hysteresis controller, runtime settings, drift history, logger) required to instantiate the service.

### AcknowledgeDiagnosticInput
Payload received from the extension when an operator acknowledges a diagnostic entry.

### ShouldEmitDiagnosticInput
Change-event metadata used to decide whether a ripple or doc diagnostic should surface again.

### RegisterDiagnosticEmissionInput
Extends the emission decision payload with message, severity, and link hints before persisting emission metadata.

### AcknowledgeOutcome
Discriminated union describing acknowledgement results (`acknowledged`, `already_acknowledged`, `not_found`).

### AcknowledgementService
Core class orchestrating emission gating, acknowledgement persistence, and hysteresis lifecycle updates.

## Responsibilities
- Inspect existing graph records to determine whether a diagnostic should emit or remain muted.
- Register emissions, including drift-history provenance, resetting stale LLM assessments while preserving diagnostic ids.
- Persist acknowledgements, release hysteresis locks, and record actor notes for downstream telemetry.
- React to runtime setting changes so suppression behaviour matches the latest noise policies.

## Collaborators
- [`packages/shared/src/db/graphStore.ts`](../../../packages/shared/src/db/graphStore.ts) stores diagnostics, acknowledgements, and drift history logs.
- [`packages/server/src/features/diagnostics/hysteresisController.ts`](../../../packages/server/src/features/diagnostics/hysteresisController.ts) governs suppression windows released after acknowledgement.
- [`packages/server/src/telemetry/driftHistoryStore.ts`](../../../packages/server/src/telemetry/driftHistoryStore.ts) captures acknowledgement provenance for dashboards.
- [`packages/server/src/features/settings/settingsBridge.ts`](../../../packages/server/src/features/settings/settingsBridge.ts) surfaces runtime knobs.

## Linked Components
- [COMP-001 – Diagnostics Pipeline](../../layer-3/diagnostics-pipeline.mdmd.md)
- [COMP-003 – Language Server Runtime](../../layer-3/language-server-architecture.mdmd.md)

## Evidence
- Unit tests: [`packages/server/src/features/diagnostics/acknowledgementService.test.ts`](../../../packages/server/src/features/diagnostics/acknowledgementService.test.ts) verify emission gating, acknowledgement persistence, and hysteresis release.
- Integration suites (US2, US3) exercise acknowledgement flows end-to-end via extension commands.

## Operational Notes
- Service runs synchronously so callers can assume persistence before returning to clients.
- Missing diagnostics during acknowledgement warn and return `not_found`, keeping CLI and UI flows idempotent.
- Roadmap: emit richer telemetry for dashboards once consent posture allows.
