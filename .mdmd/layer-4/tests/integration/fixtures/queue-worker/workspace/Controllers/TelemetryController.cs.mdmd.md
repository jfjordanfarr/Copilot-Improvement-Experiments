# tests/integration/fixtures/queue-worker/workspace/Controllers/TelemetryController.cs

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/fixtures/queue-worker/workspace/Controllers/TelemetryController.cs
- Live Doc ID: LD-asset-tests-integration-fixtures-queue-worker-workspace-controllers-telemetrycontroller-cs
- Generated At: 2025-11-18T16:40:14.786Z

## Authored
### Purpose
Capture the enqueue boundary for the Hangfire-style telemetry pipeline so LD-402 can trace controller calls into background work.

### Notes
Mirrors the fixture-local doc but keeps repository-relative links, making the inspect CLI and graph audit share a single authoritative description.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-18T16:40:14.786Z","inputHash":"e272a11c1402e37b"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `TelemetryController`
- Type: class
- Source: [source](../../../../../../../../tests/integration/fixtures/queue-worker/workspace/Controllers/TelemetryController.cs#L8)

#### `Record`
- Type: method
- Source: [source](../../../../../../../../tests/integration/fixtures/queue-worker/workspace/Controllers/TelemetryController.cs#L12)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `Hangfire`
- `Microsoft.AspNetCore.Mvc`
- `QueueWorker.Workers`
- [`TelemetryWorker.TelemetryWorker`](../Workers/TelemetryWorker.cs.mdmd.md#telemetryworker-class)
<!-- LIVE-DOC:END Dependencies -->
