function Get-InventorySnapshot {
    param(
        [string]$Region
    )

    @{
        Region = $Region
        Servers = @("srv-01", "srv-02")
    }
}

function Get-InventorySecret {
    "vault:inventory"
}

Export-ModuleMember -Function Get-InventorySnapshot
