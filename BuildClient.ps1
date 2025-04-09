param(
	[ValidateSet("build", "build-prod")]
	[string]$configuration = "build-prod"
)

$ErrorActionPreference = "Stop"

try {
	. .\ExecFunction.ps1

	Write-Host "[$(Get-Date)] Changing to client directory."
	Push-Location "$PSScriptRoot\client"

	Write-Host "[$(Get-Date)] Installing missing packages."
	exec { & yarn install }

	Write-Host "[$(Get-Date)] Building client configuration: $configuration"
	exec { & yarn run $configuration }

	Write-Host "[$(Get-Date)] Verifying prettier configuration."
	exec { & yarn run prettier-ci }

	Write-Host "[$(Get-Date)] Successfully built client."
	exit 0
} catch {
	Write-Host $_ -BackgroundColor Red
	exit -1
} finally {
	Write-Host "[$(Get-Date)] Reverting directory."
	Pop-Location
}
