# Workers/TelemetryWorker.cs

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: Workers/TelemetryWorker.cs
- Live Doc ID: LD-implementation-workers-telemetryworker-cs
- Generated At: 2025-11-18T14:33:38.881Z

## Authored
### Purpose
Process queued telemetry jobs by resolving the configured Hangfire queue name and executing ingestion logic.

### Notes
Reads configuration on construction so the dependency edge to `appsettings.json` is explicit for LD-402 coverage.

#### QueueWorker.Workers.TelemetryWorker
Provides the class-level anchor required for controller dependency links.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-18T14:33:38.881Z","inputHash":"f3a9aeff4b12421a"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `TelemetryWorker (class)`
- Type: class
- Source: [source](../../../Workers/TelemetryWorker.cs#L4)

#### `TelemetryWorker (constructor)`
- Type: constructor
- Source: [source](../../../Workers/TelemetryWorker.cs#L10)

#### `Process`
- Type: method
- Source: [source](../../../Workers/TelemetryWorker.cs#L15)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `Microsoft.Extensions.Configuration`
- [`appsettings.Hangfire:Queue`](../appsettings.json.mdmd.md#hangfirequeue)
<!-- LIVE-DOC:END Dependencies -->
