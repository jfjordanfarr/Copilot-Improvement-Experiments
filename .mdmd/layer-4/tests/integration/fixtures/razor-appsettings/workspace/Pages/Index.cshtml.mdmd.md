# tests/integration/fixtures/razor-appsettings/workspace/Pages/Index.cshtml

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/fixtures/razor-appsettings/workspace/Pages/Index.cshtml
- Live Doc ID: LD-asset-tests-integration-fixtures-razor-appsettings-workspace-pages-index-cshtml
- Generated At: 2025-11-18T03:41:09.930Z

## Authored
### Purpose
Renders the Razor telemetry page that exposes the instrumentation key for client scripts to bootstrap Application Insights during the LD-402 scenario.

### Notes
- Keeps markup intentionally sparse—hidden field and script loader—to isolate DOM dependency detection in tests.

## Generated
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`Index.cshtml`](./Index.cshtml.cs.mdmd.md)
<!-- LIVE-DOC:END Dependencies -->

## Appendix
### AppInsightsKey
Hidden input storing the instrumentation key scraped by `telemetry.js` during the LD-402 pathfinder run.
