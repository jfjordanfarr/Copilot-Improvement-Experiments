[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)][string]$Path
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Resolve-CandidatePath {
    param(
        [Parameter(Mandatory = $true)][string]$BasePath,
        [Parameter(Mandatory = $true)][string]$Candidate
    )

    if ([string]::IsNullOrWhiteSpace($Candidate)) {
        return $null
    }

    try {
        $resolvedCandidate = if ([System.IO.Path]::IsPathRooted($Candidate)) {
            $Candidate
        }
        else {
            [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($BasePath, $Candidate))
        }

        if (Test-Path -LiteralPath $resolvedCandidate) {
            $item = Get-Item -LiteralPath $resolvedCandidate -ErrorAction SilentlyContinue
            return $item?.FullName
        }

        return $resolvedCandidate
    }
    catch {
        return $null
    }
}

function Extract-StringLiterals {
    param(
        [Parameter(Mandatory = $true)][System.Object]$Elements
    )

    $results = New-Object System.Collections.Generic.List[string]

    $queue = @()
    if ($Elements -is [System.Collections.IEnumerable] -and -not ($Elements -is [string])) {
        $queue += $Elements
    }
    else {
        $queue += ,$Elements
    }

    foreach ($element in $queue) {
        switch ($element) {
            { $_ -is [System.Management.Automation.Language.StringConstantExpressionAst] } {
                [void]$results.Add($element.Value)
            }
            { $_ -is [System.Management.Automation.Language.ExpandableStringExpressionAst] } {
                [void]$results.Add($element.Value)
            }
            { $_ -is [System.Management.Automation.Language.ArrayLiteralAst] } {
                foreach ($item in Extract-StringLiterals -Elements $element.Elements) {
                    [void]$results.Add($item)
                }
            }
        }
    }

    return ,$results.ToArray()
}

$resolvedPathInfo = Resolve-Path -LiteralPath $Path -ErrorAction Stop
$resolvedPath = $resolvedPathInfo.ProviderPath
$scriptDirectory = Split-Path -Parent $resolvedPath

$tokens = $null
$parseErrors = $null
$ast = [System.Management.Automation.Language.Parser]::ParseFile($resolvedPath, [ref]$tokens, [ref]$parseErrors)

$functions = @()
$functionNodes = $ast.FindAll({ param($node) $node -is [System.Management.Automation.Language.FunctionDefinitionAst] }, $true)
foreach ($fn in $functionNodes) {
    $functions += [pscustomobject]@{
        Name = $fn.Name
        Line = $fn.Extent.StartLineNumber
        Column = $fn.Extent.StartColumnNumber
    }
}

$dotSources = @()
$importModules = New-Object System.Collections.Generic.HashSet[string]
$usingModules = New-Object System.Collections.Generic.HashSet[string]
$requiresModules = New-Object System.Collections.Generic.HashSet[string]
$exportedFunctions = New-Object System.Collections.Generic.HashSet[string]

$commandNodes = $ast.FindAll({ param($node) $node -is [System.Management.Automation.Language.CommandAst] }, $true)
foreach ($command in $commandNodes) {
    if ($command.InvocationOperator -eq [System.Management.Automation.Language.TokenKind]::Dot) {
        if ($command.CommandElements.Count -gt 0) {
            $targetAst = $command.CommandElements[0]
            if ($targetAst -is [System.Management.Automation.Language.StringConstantExpressionAst] -or
                $targetAst -is [System.Management.Automation.Language.ExpandableStringExpressionAst]) {
                $raw = $targetAst.Value
                $resolved = Resolve-CandidatePath -BasePath $scriptDirectory -Candidate $raw
                $dotSources += [pscustomobject]@{
                    Raw = $raw
                    Resolved = $resolved
                }
            }
        }
        continue
    }

    $name = $command.GetCommandName()
    if ([string]::IsNullOrWhiteSpace($name)) {
        continue
    }

    if ($name -ieq "Import-Module") {
        $arguments = $command.CommandElements | Select-Object -Skip 1
        foreach ($literal in Extract-StringLiterals -Elements $arguments) {
            [void]$importModules.Add($literal)
        }
    }
    elseif ($name -ieq "Export-ModuleMember") {
            $elements = $command.CommandElements | Select-Object -Skip 1
            foreach ($literal in Extract-StringLiterals -Elements $elements) {
            [void]$exportedFunctions.Add($literal)
        }
    }
}

$usingNodes = $ast.FindAll({ param($node) $node -is [System.Management.Automation.Language.UsingStatementAst] }, $true)
foreach ($using in $usingNodes) {
    if ($using.UsingStatementKind -eq [System.Management.Automation.Language.UsingStatementKind]::Module -and $using.ModuleSpecification) {
        $name = $using.ModuleSpecification.Name
        if ($name) {
            [void]$usingModules.Add($name)
        }
    }
}

if ($ast.ScriptRequirements -and $ast.ScriptRequirements.RequiredModules) {
    foreach ($module in $ast.ScriptRequirements.RequiredModules) {
        $name = $module.Name
        if ($name) {
            [void]$requiresModules.Add($name)
        }
    }
}

$explicitExports = @()
foreach ($value in $exportedFunctions) {
    $explicitExports += $value
}

if ($explicitExports.Count -gt 0 -and -not ($explicitExports -contains "*")) {
    $allowed = [System.Collections.Generic.HashSet[string]]::new([string[]]$explicitExports)
    $functions = @($functions | Where-Object { $allowed.Contains($_.Name) })
}

$result = [pscustomobject]@{
    Functions = @($functions)
    DotSources = $dotSources
    ImportModules = @($importModules)
    UsingModules = @($usingModules)
    RequiresModules = @($requiresModules)
    ExportedFunctions = @($explicitExports)
    Errors = if ($parseErrors) { @($parseErrors | ForEach-Object { $_.Message }) } else { @() }
}

$result | ConvertTo-Json -Depth 6 -Compress
