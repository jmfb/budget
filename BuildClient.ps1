param(
	[ValidateSet("build", "build-prod")]
	[string]$configuration = "build-prod"
)

$ErrorActionPreference = "Stop"

try {
	Write-Host "[$(Get-Date)] Changing to client directory."
	Push-Location "$PSScriptRoot\client"

	Write-Host "[$(Get-Date)] Installing missing packages."
	& yarn install
	if ($lastexitcode -ne 0) {
		exit $lastexitcode
	}

	Write-Host "[$(Get-Date)] Building client configuration: $configuration"
	& yarn run $configuration
	if ($lastexitcode -ne 0) {
		exit $lastexitcode
	}

	Write-Host "[$(Get-Date)] Successfully built client."
	exit 0
} catch {
	Write-Host $_ -BackgroundColor Red
	exit -1
} finally {
	Write-Host "[$(Get-Date)] Reverting directory."
	Pop-Location
}
