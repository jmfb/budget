param (
	[switch] $autoApprove
)

$ErrorActionPreference = "Stop"

try {
	. .\ExecFunction.ps1

	Write-Host "[$(Get-Date)] Releasing new version."

	Write-Host "[$(Get-Date)] Publishing new image with full client build."
	exec { . .\PublishImage.ps1 -buildClient }

	Write-Host "[$(Get-Date)] Planning terraform changes."
	exec { . .\PlanTerraform.ps1 -clean -init }

	if (-not $autoApprove) {
		Write-Host
		$apply = Read-Host "Type 'apply' to continue"
		if ($apply -ne "apply") {
			exit -1
		}
	} else {
		Write-Host
		Write-Host "[$(Get-Date)] Auto approved. (Good Luck)"
	}

	Write-Host "[$(Get-Date)] Applying terraform changes."
	exec { . .\ApplyTerraform.ps1 }

	if (-not $autoApprove) {
		Write-Host "[$(Get-Date)] Previewing which old images will be deleted."
		exec { . .\DeleteOldImages.ps1 -dryRun }

		Write-Host
		$delete = Read-Host "Type 'delete to continue"
		if ($delete -ne "delete") {
			exit -1
		}
	} else {
		Write-Host
		Write-Host "[$(Get-Date)] Auto approved. (Good Luck)"
	}

	Write-Host "[$(Get-Date)] Deleting old images."
	exec { . .\DeleteOldImages.ps1 }

	Write-Host "[$(Get-Date)] Successfully released new version."
	exit 0
} catch {
	Write-Host $_ -BackgroundColor Red
	exit -1
}
