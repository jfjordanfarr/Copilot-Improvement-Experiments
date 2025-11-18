# wwwroot/js/telemetry.js

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: wwwroot/js/telemetry.js
- Live Doc ID: LD-implementation-wwwroot-js-telemetry-js
- Generated At: 2025-11-17T23:22:59.038Z

## Authored
### Purpose
Bootstrap client telemetry by reading the instrumentation key emitted by the Razor page.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-17T23:22:59.038Z","inputHash":"d2265d9f93c995a0"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `initializeTelemetry`
- Type: function
- Source: [source](../../../../wwwroot/js/telemetry.js#L1)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`Index.app-insights-key`](../../Pages/Index.cshtml.mdmd.md#appinsightskey)
<!-- LIVE-DOC:END Dependencies -->

## Appendix
### AppInsightsKey
Alias used when binding the instrumentation key hidden field so SPA bootstrapping code can locate it quickly.
