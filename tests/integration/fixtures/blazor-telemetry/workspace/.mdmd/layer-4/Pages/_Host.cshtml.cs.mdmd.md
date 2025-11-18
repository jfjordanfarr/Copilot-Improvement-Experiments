# Pages/_Host.cshtml.cs

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: Pages/_Host.cshtml.cs
- Live Doc ID: LD-implementation-pages-host-cshtml-cs
- Generated At: 2025-11-18T14:34:17.621Z

## Authored
### Purpose
Load the telemetry configuration and surface it to the host page so downstream scripts can publish metrics.

### Notes
Provides the bridge between configuration and DOM annotations required for the inspect CLI path assertion.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-18T14:34:17.621Z","inputHash":"ada3e93aee06a471"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `HostModel (class)`
- Type: class
- Source: [source](../../../Pages/_Host.cshtml.cs#L4)

#### `HostModel (constructor)`
- Type: constructor
- Source: [source](../../../Pages/_Host.cshtml.cs#L8)

#### `TelemetryEndpoint`
- Type: property
- Source: [source](../../../Pages/_Host.cshtml.cs#L15)

#### `InstrumentationKey`
- Type: property
- Source: [source](../../../Pages/_Host.cshtml.cs#L17)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `Microsoft.AspNetCore.Mvc.RazorPages`
- `Microsoft.Extensions.Configuration`
- [`appsettings.Telemetry:Endpoint`](../appsettings.json.mdmd.md#telemetryendpoint)
- [`appsettings.Telemetry:InstrumentationKey`](../appsettings.json.mdmd.md#telemetryinstrumentationkey)
<!-- LIVE-DOC:END Dependencies -->
