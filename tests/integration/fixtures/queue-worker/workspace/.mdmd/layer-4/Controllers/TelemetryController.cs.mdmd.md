# Controllers/TelemetryController.cs

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: Controllers/TelemetryController.cs
- Live Doc ID: LD-implementation-controllers-telemetrycontroller-cs
- Generated At: 2025-11-18T14:33:38.873Z

## Authored
### Purpose
Expose the telemetry ingestion endpoint that offloads incoming payloads onto the Hangfire background queue.

### Notes
Delegates all processing to `TelemetryWorker` so the inspect CLI can verify the queue hop instead of in-process work.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-18T14:33:38.873Z","inputHash":"19150f0bbae103b2"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `TelemetryController`
- Type: class
- Source: [source](../../../Controllers/TelemetryController.cs#L8)

#### `Record`
- Type: method
- Source: [source](../../../Controllers/TelemetryController.cs#L12)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `Hangfire`
- `Microsoft.AspNetCore.Mvc`
- `QueueWorker.Workers`
- [`TelemetryWorker.QueueWorker.Workers.TelemetryWorker`](../Workers/TelemetryWorker.cs.mdmd.md#queueworkerworkerstelemetryworker)
<!-- LIVE-DOC:END Dependencies -->
