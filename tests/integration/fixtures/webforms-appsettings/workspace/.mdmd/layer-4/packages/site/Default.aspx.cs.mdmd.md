# packages/site/Default.aspx.cs

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/site/Default.aspx.cs
- Live Doc ID: LD-implementation-packages-site-default-aspx-cs

## Authored
### Purpose
Load the App Insights instrumentation key from configuration and push it into the hidden field consumed by client telemetry.

## Generated
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
- `Page_Load(object sender, EventArgs e): void` — populates the hidden field with the instrumentation key.
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [../../Web.config.mdmd.md](../../Web.config.mdmd.md) — reads `AppSettings["AppInsightsInstrumentationKey"]` to retrieve the instrumentation key value.
<!-- LIVE-DOC:END Dependencies -->
