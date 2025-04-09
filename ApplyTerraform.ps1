$ErrorActionPreference = "Stop"

try {
	. .\ExecFunction.ps1

	Write-Host "[$(Get-Date)] Changing to terraform directory..."
	Push-Location "$PSScriptRoot\terraform"

	Write-Host "[$(Get-Date)] Applying terraform plan..."
	exec { & terraform_1.3.1 apply tfplan }

	Write-Host "[$(Get-Date)] Successfully applied terraform."
	exit 0
} catch {
	Write-Host $_ -BackgroundColor Red
	exit -1
} finally {
	Pop-Location
}
