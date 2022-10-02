param(
	[Parameter(Mandatory=$false)]
	[Switch]
	$dryRun
)

$ErrorActionPreference = "Stop"

try {
	. .\ExecFunction.ps1

	Write-Host "[$(Get-Date)] Getting all images from repository..."
	exec { $imagesJson = & aws ecr list-images --repository-name budget }

	Write-Host "[$(Get-Date)] Finding latest version's imageDigest..."
	$images = $imagesJson | ConvertFrom-Json
	$latestDigest = ($images.imageIds | Where { $_.imageTag -eq "latest"}).imageDigest
	Write-Host "[$(Get-Date)] Latest digest: $latestDigest"
	if ([string]::IsNullOrEmpty($latestDigest)) {
		Write-Host "[$(Get-Date)] Could not parse latest digest from images:"
		Write-Host $imagesJson
		exit -1
	}

	Write-Host "[$(Get-Date)] Getting list of old image versions to delete..."
	$oldVersions = $images.imageIds | `
		Where { $_.imageDigest -ne $latestDigest } | `
		ForEach { "imageTag=$($_.imageTag)" }
	$oldVersions | Write-Host
	if ($oldVersions.Count -eq 0) {
		Write-Host "[$(Get-Date)] No old versions to delete."
		exit 0
	}

	if ($dryRun) {
		Write-Host "[$(Get-Date)] Dry run (nothing is being deleted)."
	} else {
		Write-Host "[$(Get-Date)] Deleting old versions from repository..."
		exec { & aws ecr batch-delete-image --repository-name budget --image-ids $oldVersions }
	}

	Write-Host "[$(Get-Date)] Done."
	exit 0
} catch {
	Write-Host $_ -BackgroundColor Red
	exit -1
}
