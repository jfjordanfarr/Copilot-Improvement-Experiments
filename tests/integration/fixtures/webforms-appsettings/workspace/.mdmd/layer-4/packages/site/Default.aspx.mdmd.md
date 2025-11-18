# packages/site/Default.aspx

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/site/Default.aspx
- Live Doc ID: LD-implementation-packages-site-default-aspx
- Generated At: 2025-11-17T22:35:54.248Z

## Authored
### Purpose
Expose the App Insights instrumentation key to client scripts via a server-managed hidden field.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-17T22:35:54.248Z","inputHash":"da734f33e3cafa82"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`Default.aspx`](./Default.aspx.cs.mdmd.md)
- [`app-insights`](./Scripts/app-insights.js.mdmd.md)
<!-- LIVE-DOC:END Dependencies -->

## Appendix
### AppInsightsInstrumentationKey
Hidden form field rendered into the markup so client telemetry can capture the instrumentation key without exposing it in the HTML payload.
