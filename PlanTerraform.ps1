param(
	[Parameter(Mandatory=$false)]
	[Switch]
	$clean,

	[Parameter(Mandatory=$false)]
	[Switch]
	$init
)

$ErrorActionPreference = "Stop"

try {
	. .\ExecFunction.ps1

	Write-Host "[$(Get-Date)] Changing to terraform directory..."
	Push-Location "$PSScriptRoot\terraform"

	Write-Host "[$(Get-Date)] Configuring terraform environment variables..."
	if ([string]::IsNullOrEmpty($Env:BudgetAuthClientSecret)) {
		Write-Host "[$(Get-Date)] Missing BudgetAuthClientSecret environment variable."
		exit -1
	}

	if ([string]::IsNullOrEmpty($Env:BudgetTokenSecret)) {
		Write-Host "[$(Get-Date)] Missing BudgetTokenSecret environment variable."
		exit -1
	}

	$Env:TF_VAR_auth_client_secret = $Env:BudgetAuthClientSecret
	$Env:TF_VAR_token_secret = $Env:BudgetTokenSecret

	if ($clean) {
		Write-Host "[$(Get-Date)] Checking for old plan..."
		if (Test-Path tfplan) {
			Write-Host "[$(Get-Date)] Deleting old plan..."
			Remove-Item tfplan
		}

		Write-Host "[$(Get-Date)] Cleaning up old terraform output..."
		if (Test-Path .terraform*) {
			Write-host "[$(Get-Date)] Deleting old terraform output..."
			Get-Item .terraform* | Remove-Item -Force -Recurse -Confirm:$false
		}
	}

	if ($init) {
		Write-Host "[$(Get-Date)] Initializing terraform..."
		exec { & terraform_1.3.1 init }
	}

	Write-Host "[$(Get-Date)] Planning terraform with tfplan output..."
	exec { & terraform_1.3.1 plan -out tfplan }

	Write-Host "[$(Get-Date)] Successfully planned terraform."
	exit 0
} catch {
	Write-Host $_ -BackgroundColor Red
	exit -1
} finally {
	Pop-Location
}
