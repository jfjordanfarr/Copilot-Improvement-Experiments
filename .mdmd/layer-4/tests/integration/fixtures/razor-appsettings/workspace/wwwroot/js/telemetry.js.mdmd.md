# tests/integration/fixtures/razor-appsettings/workspace/wwwroot/js/telemetry.js

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/fixtures/razor-appsettings/workspace/wwwroot/js/telemetry.js
- Live Doc ID: LD-asset-tests-integration-fixtures-razor-appsettings-workspace-wwwroot-js-telemetry-js
- Generated At: 2025-11-18T00:11:29.005Z

## Authored
### Purpose
Simulates a Razor-backed telemetry bootstrapper that scrapes hidden fields from `Index.cshtml` so we can prove DOM heuristics recover the configuration hop.

### Notes
- Shares structure with the Blazor telemetry script; together they exercise the selector heuristics across both Razor pages and the Blazor host shell.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-18T00:11:29.005Z","inputHash":"b1fb52dfdf177ca3"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `initializeTelemetry`
- Type: function
- Source: [source](../../../../../../../../../tests/integration/fixtures/razor-appsettings/workspace/wwwroot/js/telemetry.js#L1)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`Index.app-insights-key`](../../Pages/Index.cshtml.mdmd.md#appinsightskey)
<!-- LIVE-DOC:END Dependencies -->

## Appendix
### AppInsightsKey
Alias used when binding the instrumentation key hidden field so SPA bootstrapping code can locate it quickly.
