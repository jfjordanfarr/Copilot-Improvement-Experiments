# scripts/deploy.ps1

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/deploy.ps1
- Live Doc ID: LD-implementation-scripts-deploy-ps1
- Generated At: 2025-11-20T18:45:17.693Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-20T18:45:17.693Z","inputHash":"e8ebfcb300932130"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `Invoke-Deployment` {#symbol-invokedeployment}
- Type: function
- Source: [source](../../../scripts/deploy.ps1#L17)

##### `Invoke-Deployment` — Summary
Deploys compiled artifacts to the requested region.

##### `Invoke-Deployment` — Remarks
Wraps shared logging and inventory refresh helpers so deployments stay observable.

##### `Invoke-Deployment` — Parameters
- `Region`: The geographic region to target during deployment operations.
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `./modules/Inventory.psm1`
- `Microsoft.PowerShell.Management`
- [`logging`](./common/logging.ps1.mdmd.md)
<!-- LIVE-DOC:END Dependencies -->
