# tests/integration/fixtures/powershell-compendium/workspace/scripts/deploy.ps1

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/fixtures/powershell-compendium/workspace/scripts/deploy.ps1
- Live Doc ID: LD-asset-tests-integration-fixtures-powershell-compendium-workspace-scripts-deploy-ps1
- Generated At: 2025-11-20T18:46:15.989Z

## Authored
### Purpose
Fixture entry point that simulates an ops deployment script for inspect CLI regression coverage.

### Notes
- Dot-sources the logging helper and imports the inventory module so graph pathfinding can prove PowerShell edges are materialised from Live Docs.
- Lives under the `powershell-compendium` fixture workspace and mirrors the patterns covered by the unit-level adapter tests.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-20T18:46:15.989Z","inputHash":"bcebee8d7a4b344f"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `Invoke-Deployment` {#symbol-invokedeployment}
- Type: function
- Source: [source](../../../../../../../../tests/integration/fixtures/powershell-compendium/workspace/scripts/deploy.ps1#L7)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `./modules/Inventory.psm1`
- `Microsoft.PowerShell.Management`
- [`logging`](./common/logging.ps1.mdmd.md)
<!-- LIVE-DOC:END Dependencies -->
