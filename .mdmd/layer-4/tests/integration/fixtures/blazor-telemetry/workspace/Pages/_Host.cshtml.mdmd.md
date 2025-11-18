# tests/integration/fixtures/blazor-telemetry/workspace/Pages/_Host.cshtml

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/fixtures/blazor-telemetry/workspace/Pages/_Host.cshtml
- Live Doc ID: LD-asset-tests-integration-fixtures-blazor-telemetry-workspace-pages-host-cshtml
- Generated At: 2025-11-18T03:29:20.560Z

## Authored
### Purpose
Models the Blazor Server host page that renders hidden telemetry attributes consumed by the fixture’s JavaScript so we can validate markup-to-script pathfinding.

### Notes
- Keeps the markup minimal—layout, script include, and `data-` attributes—so changes in Roslyn-generated scaffolding do not mask the heuristics we are trying to test.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-18T03:29:20.560Z","inputHash":"f5029294f150f116"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`_Host.cshtml`](./_Host.cshtml.cs.mdmd.md)
<!-- LIVE-DOC:END Dependencies -->

## Appendix
### TelemetryEndpoint
`data-endpoint` attribute exposing the telemetry ingestion URL consumed by `blazor-telemetry.js`.

### TelemetryInstrumentation
`data-instrumentation` attribute mirroring the Application Insights key for client bootstrap logic.
