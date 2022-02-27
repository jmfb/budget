$ErrorActionPreference = "Stop"

try {
	exit 0
} catch {
	Write-Host $_ -BackgroundColor Red
	exit -1
}
