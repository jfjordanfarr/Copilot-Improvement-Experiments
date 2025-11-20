function Get-InventorySnapshot {
    param(
        [string]$Region
    )

    @{
        Region = $Region
        Servers = @("srv-01", "srv-02")
    }
}

Export-ModuleMember -Function Get-InventorySnapshot
