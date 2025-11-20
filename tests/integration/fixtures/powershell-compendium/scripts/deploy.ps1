Using module Microsoft.PowerShell.Utility
#requires -Modules Microsoft.PowerShell.Management

[CmdletBinding()]
param(
    [string]$Region = "us-east"
)

. "../common/logging.ps1"
Import-Module MyCompany.Inventory

function Invoke-Deployment {
    param(
        [string]$Environment
    )

    Write-DeploymentLog "Deploying to $Environment"
    Get-InventorySnapshot -Region $Environment
}

Invoke-Deployment -Environment $Region
