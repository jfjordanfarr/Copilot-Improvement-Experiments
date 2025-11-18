# tests/integration/fixtures/queue-worker/workspace/Services/TelemetryScheduler.cs

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/fixtures/queue-worker/workspace/Services/TelemetryScheduler.cs
- Live Doc ID: LD-asset-tests-integration-fixtures-queue-worker-workspace-services-telemetryscheduler-cs
- Generated At: 2025-11-18T16:45:00.000Z

## Authored
### Purpose
Document the recurring Hangfire registration so LD-402 captures scheduled telemetry jobs that point back to the worker implementation.

### Notes
Calls the Hangfire recurring manager directly to keep the pathfinder's inbound edges honest when configuration feeds the worker and controller through scheduled hops.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-18T16:45:00.000Z","inputHash":"manual-telemetry-scheduler"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `TelemetryScheduler (class)`
- Type: class
- Source: [source](../../../../../../../../tests/integration/fixtures/queue-worker/workspace/Services/TelemetryScheduler.cs#L5)

#### `TelemetryScheduler (constructor)`
- Type: constructor
- Source: [source](../../../../../../../../tests/integration/fixtures/queue-worker/workspace/Services/TelemetryScheduler.cs#L9)

#### `Configure`
- Type: method
- Source: [source](../../../../../../../../tests/integration/fixtures/queue-worker/workspace/Services/TelemetryScheduler.cs#L14)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `Hangfire`
- `QueueWorker.Workers`
- [`TelemetryWorker.TelemetryWorker`](../Workers/TelemetryWorker.cs.mdmd.md#telemetryworker-class)
<!-- LIVE-DOC:END Dependencies -->
