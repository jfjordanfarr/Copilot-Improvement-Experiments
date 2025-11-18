# tests/integration/fixtures/queue-worker/workspace/Workers/TelemetryWorker.cs

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/fixtures/queue-worker/workspace/Workers/TelemetryWorker.cs
- Live Doc ID: LD-asset-tests-integration-fixtures-queue-worker-workspace-workers-telemetryworker-cs
- Generated At: 2025-11-18T16:35:59.186Z

## Authored
### Purpose
Document the background worker that dequeues telemetry jobs and touches configuration, giving the pathfinder a deterministic hop target.

### Notes
Resolves the queue name during construction so the dependency edge to `appsettings.json` remains explicit in graph audits.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-18T16:35:59.186Z","inputHash":"1439cab68bca3db8"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `TelemetryWorker (class)`
- Type: class
- Source: [source](../../../../../../../../tests/integration/fixtures/queue-worker/workspace/Workers/TelemetryWorker.cs#L4)

#### `TelemetryWorker (constructor)`
- Type: constructor
- Source: [source](../../../../../../../../tests/integration/fixtures/queue-worker/workspace/Workers/TelemetryWorker.cs#L10)

#### `Process`
- Type: method
- Source: [source](../../../../../../../../tests/integration/fixtures/queue-worker/workspace/Workers/TelemetryWorker.cs#L15)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `Microsoft.Extensions.Configuration`
- [`appsettings.Hangfire:Queue`](../appsettings.json.mdmd.md#hangfirequeue)
<!-- LIVE-DOC:END Dependencies -->
