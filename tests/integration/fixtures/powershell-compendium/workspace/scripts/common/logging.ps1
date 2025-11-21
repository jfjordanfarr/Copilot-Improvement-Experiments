<#
.SYNOPSIS
Writes a deployment log entry to standard output.

.PARAMETER Message
The content to emit in the log entry.
#>
function Write-DeploymentLog {
    param(
        [string]$Message
    )

    "[LOG] $Message"
}
