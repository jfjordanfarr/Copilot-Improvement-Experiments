# tests/integration/fixtures/razor-appsettings/workspace/Pages/Index.cshtml.cs

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/fixtures/razor-appsettings/workspace/Pages/Index.cshtml.cs
- Live Doc ID: LD-asset-tests-integration-fixtures-razor-appsettings-workspace-pages-index-cshtml-cs
- Generated At: 2025-11-18T03:41:09.946Z

## Authored
### Purpose
Backs the Razor telemetry page by promoting `appsettings.json` values into view data so the LD-402 pathfinder can observe the script → markup → configuration dependency chain.

### Notes
- Mirrors the Blazor `_Host` model to keep parity across ASP.NET fixtures; future coverage comparing the two will rely on this doc’s dependency links.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-18T03:41:09.946Z","inputHash":"cf530d938b40fcb9"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `IndexModel`
- Type: class
- Source: [source](../../../../../../../../tests/integration/fixtures/razor-appsettings/workspace/Pages/Index.cshtml.cs#L2)

#### `IndexModel`
- Type: constructor
- Source: [source](../../../../../../../../tests/integration/fixtures/razor-appsettings/workspace/Pages/Index.cshtml.cs#L8)

#### `InstrumentationKey`
- Type: property
- Source: [source](../../../../../../../../tests/integration/fixtures/razor-appsettings/workspace/Pages/Index.cshtml.cs#L13)

#### `OnGet`
- Type: method
- Source: [source](../../../../../../../../tests/integration/fixtures/razor-appsettings/workspace/Pages/Index.cshtml.cs#L15)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `Microsoft.AspNetCore.Mvc.RazorPages`
- `Microsoft.Extensions.Configuration`
- [`appsettings.Telemetry:InstrumentationKey`](../appsettings.json.mdmd.md#telemetryinstrumentationkey)
<!-- LIVE-DOC:END Dependencies -->
