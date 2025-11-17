# packages/site/Default.aspx

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/site/Default.aspx
- Live Doc ID: LD-implementation-packages-site-default-aspx

## Authored
### Purpose
Expose the App Insights instrumentation key to client scripts via a server-managed hidden field.

## Generated
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
- `AppInsightsInstrumentationKey` — hidden field rendered for telemetry scripts.
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [Default.aspx.cs.mdmd.md](Default.aspx.cs.mdmd.md) — relies on the code-behind to populate the hidden field during `Page_Load`.
- [Scripts/app-insights.js.mdmd.md](Scripts/app-insights.js.mdmd.md) — embeds and executes the telemetry bootstrapper alongside the page markup.
<!-- LIVE-DOC:END Dependencies -->
