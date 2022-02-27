param(
	[Parameter(Mandatory=$false)]
	[Switch]
	$buildClient
)

$ErrorActionPreference = "Stop"

try {
	if ($buildClient) {
		. "$PSScriptRoot\BuildClient.ps1"
		if ($lastexitcode -ne 0) {
			exit $lastexitcode
		}
	}

	$repository = "862438233085.dkr.ecr.us-east-1.amazonaws.com"
	Write-Host "[$(Get-Date)] ECR repository: $repository"

	$version = (Get-Date).ToString("y.Mdd.Hmm.s")
	Write-Host "[$(Get-Date)] New version: $version"

	Write-Host "[$(Get-Date)] Getting ECR password from AWS..."
	$password = & aws ecr get-login-password --region us-east-1
	if ($lastexitcode -ne 0) {
		exit $lastexitcode
	}

	Write-Host "[$(Get-Date)] Logging docker in to ECR repository..."
	$password | & docker login --username AWS --password-stdin $repository
	if ($lastexitcode -ne 0) {
		exit $lastexitcode
	}

	Write-Host "[$(Get-Date)] Building docker image..."
	& docker build --build-arg version=$version -t budget .
	if ($lastexitcode -ne 0) {
		exit $lastexitcode
	}

	Write-Host "[$(Get-Date)] Tagging docker image with version $version..."
	& docker tag budget:latest $repository/budget:$version
	if ($lastexitcode -ne 0) {
		exit $lastexitcode
	}

	Write-Host "[$(Get-Date)] Tagging docker image with latest..."
	& docker tag budget:latest $repository/budget:latest
	if ($lastexitcode -ne 0) {
		exit $lastexitcode
	}

	Write-Host "[$(Get-Date)] Pushing version image..."
	& docker push $repository/budget:$version
	if ($lastexitcode -ne 0) {
		exit $lastexitcode
	}

	Write-Host "[$(Get-Date)] Pushing latest image..."
	& docker push $repository/budget:latest
	if ($lastexitcode -ne 0) {
		exit $lastexitcode
	}

	Write-Host "[$(Get-Date)] Deleting local latest image..."
	& docker rmi $repository/budget:latest
	if ($lastexitcode -ne 0) {
		exit $lastexitcode
	}

	Write-Host "[$(Get-Date)] Deleting local version image..."
	& docker rmi $repository/budget:$version
	if ($lastexitcode -ne 0) {
		exit $lastexitcode
	}

	Write-Host "[$(Get-Date)] Deleting local build image..."
	& docker rmi budget:latest
	if ($lastexitcode -ne 0) {
		exit $lastexitcode
	}

	Write-Host "[$(Get-Date)] Successfully published image."
	exit 0
} catch {
	Write-Host $_ -BackgroundColor Red
	exit -1
}
