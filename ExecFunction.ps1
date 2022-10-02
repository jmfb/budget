$ErrorActionPreference = "Stop"

try {
	function exec() {
		[CmdletBinding()]
		param([Parameter(Position=0,Mandatory=1)][scriptblock] $commandScript)

		Write-Host "[$(Get-Date)] $($commandScript.ToString().Trim())"
		& $commandScript
		$exitCode = $lastexitcode
		if ($exitCode -ne 0) {
			Write-Host "[$(Get-Date)] Error, exit code: $exitCode"
			exit $exitCode
		}
	}
} catch {
	Write-Host "[$(Get-Date)] Exception: $_"
	exit 1
}
