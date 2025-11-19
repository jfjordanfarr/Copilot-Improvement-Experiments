# Services/TelemetryScheduler.cs

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: Services/TelemetryScheduler.cs
- Live Doc ID: LD-implementation-services-telemetryscheduler-cs
- Generated At: 2025-11-18T20:45:14.088Z

## Authored
### Purpose
Explain how the queue-worker fixture registers recurring Hangfire jobs so LD-402 can validate inbound graph hops even when the caller is a scheduler instead of an HTTP controller.

### Notes
The scheduler stocks the `IRecurringJobManager` with a daily job that reuses `TelemetryWorker`. Keeping this doc alongside the controller and worker makes it easy to trace why the inspect CLI surfaces terminal frontiers when no artefact links back to the scheduler.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-18T20:45:14.088Z","inputHash":"99847ca94990a267"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `TelemetryScheduler (class)`
- Type: class
- Source: [source](../../../Services/TelemetryScheduler.cs#L4)

#### `TelemetryScheduler (constructor)`
- Type: constructor
- Source: [source](../../../Services/TelemetryScheduler.cs#L10)

#### `Configure`
- Type: method
- Source: [source](../../../Services/TelemetryScheduler.cs#L15)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `Hangfire`
- `QueueWorker.Workers`
- [`TelemetryWorker.TelemetryWorker`](../Workers/TelemetryWorker.cs.mdmd.md#telemetryworker-class)
<!-- LIVE-DOC:END Dependencies -->
