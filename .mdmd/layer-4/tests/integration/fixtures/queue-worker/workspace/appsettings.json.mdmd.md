# tests/integration/fixtures/queue-worker/workspace/appsettings.json

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/fixtures/queue-worker/workspace/appsettings.json
- Live Doc ID: LD-asset-tests-integration-fixtures-queue-worker-workspace-appsettings-json
- Generated At: 2025-11-18T14:57:09.930Z

## Authored
### Purpose
Record the Hangfire queue configuration consumed by the queue-worker telemetry pipeline.

### Notes
Single-setting payload keeps inspect-cli assertions stable while we expand to multi-queue scenarios.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-18T14:57:09.930Z","inputHash":"626b82ebb8d14f0a"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_No dependencies documented yet_
<!-- LIVE-DOC:END Dependencies -->

## Appendix
### HangfireQueue
Defines the queue name processed by `TelemetryWorker`, keeping the Hangfire configuration graph edge explicit.
