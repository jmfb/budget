param(
	[Parameter(Mandatory=$false)]
	[Switch]
	$pull
)

$ErrorActionPreference = "Stop"

try {
	. .\ExecFunction.ps1

	if ($pull) {
		Write-Host "[$(Get-Date)] Pulling latest dynamo db image..."
		exec { & docker pull amazon/dynamodb-local:latest }
	}

	Write-host "[$(Get-Date)] Starting dynamo db container.  Press Ctrl+C to stop."
	exec { & docker run -it --rm -p 8000:8000 amazon/dynamodb-local }

	exit 0
} catch {
	Write-Host $_ -BackgroundColor Red
	exit -1
}
