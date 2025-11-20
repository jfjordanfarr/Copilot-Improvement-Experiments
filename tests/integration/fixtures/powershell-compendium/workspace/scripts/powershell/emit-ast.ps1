param(
    [Parameter(Mandatory = $true)]
    [string]$Path
)

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..\..\..\..\..\..')
$emitter = Join-Path $repoRoot 'scripts/powershell/emit-ast.ps1'

& $emitter @PSBoundParameters
