# tests/integration/fixtures/powershell-compendium/workspace/scripts/modules/Inventory.psm1

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/fixtures/powershell-compendium/workspace/scripts/modules/Inventory.psm1
- Live Doc ID: LD-asset-tests-integration-fixtures-powershell-compendium-workspace-scripts-modules-inventory-psm1
- Generated At: 2025-11-20T18:46:16.669Z

## Authored
### Purpose
Expose the exported inventory module that the deploy script loads during inspect CLI regression tests.

### Notes
- Only `Get-InventorySnapshot` is exported so the adapter and heuristic coverage can verify module filtering and inter-script edges.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-20T18:46:16.669Z","inputHash":"8f980d5582dcc3bf"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `Get-InventorySnapshot` {#symbol-getinventorysnapshot}
- Type: function
- Source: [source](../../../../../../../../../tests/integration/fixtures/powershell-compendium/workspace/scripts/modules/Inventory.psm1#L1)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_No dependencies documented yet_
<!-- LIVE-DOC:END Dependencies -->
