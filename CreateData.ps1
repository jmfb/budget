param(
	[Parameter(Mandatory=$true)]
	[string]
	$userId
)

$ErrorActionPreference = "Stop"

try {
	Write-Host "[$(Get-Date)] Done."
	exit 0
} catch {
	Write-Host $_ -BackgroundColor Red
	exit -1
}
