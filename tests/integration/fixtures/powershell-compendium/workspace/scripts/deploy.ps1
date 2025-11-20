Using module Microsoft.PowerShell.Utility
#requires -Modules Microsoft.PowerShell.Management

. "./common/logging.ps1"
Import-Module "./modules/Inventory.psm1"

function Invoke-Deployment {
    param(
        [string]$Region = "us-east"
    )

    Write-DeploymentLog "Deploying to $Region"
    Get-InventorySnapshot -Region $Region
}

Invoke-Deployment
