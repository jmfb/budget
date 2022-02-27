param(
	[Parameter(Mandatory=$false)]
	[Switch]
	$pull
)

$ErrorActionPreference = "Stop"

try {
	if ($pull) {
		Write-Host "[$(Get-Date)] Pulling latest dynamo db image..."
		& docker pull amazon/dynamodb-local:latest
		if ($lastexitcode -ne 0) {
			exit $lastexitcode
		}
	}

	Write-host "[$(Get-Date)] Starting dynamo db container.  Press Ctrl+C to stop."
	& docker run -it --rm -p 8000:8000 amazon/dynamodb-local
	if ($lastexitcode -ne -0) {
		exit $lastexitcode
	}

	exit 0
} catch {
	Write-Host $_ -BackgroundColor Red
	exit -1
}
