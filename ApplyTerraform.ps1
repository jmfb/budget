$ErrorActionPreference = "Stop"

try {
	Write-Host "[$(Get-Date)] Changing to terraform directory..."
	Push-Location "$PSScriptRoot\terraform"

	Write-Host "[$(Get-Date)] Applying terraform plan..."
	& terraform_0.15.1 apply tfplan
	if ($lastexitcode -ne 0) {
		exit $lastexitcode
	}

	Write-Host "[$(Get-Date)] Successfully applied terraform."
	exit 0
} catch {
	Write-Host $_ -BackgroundColor Red
	exit -1
} finally {
	Pop-Location
}
