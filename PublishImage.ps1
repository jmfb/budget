param(
	[Parameter(Mandatory=$false)]
	[Switch]
	$buildClient
)

$ErrorActionPreference = "Stop"

try {
	. .\ExecFunction.ps1

	$repository = "862438233085.dkr.ecr.us-east-1.amazonaws.com"
	Write-Host "[$(Get-Date)] ECR repository: $repository"

	$version = (Get-Date).ToString("y.Mdd.Hmm.s")
	Write-Host "[$(Get-Date)] New version: $version"

	Write-Host "[$(Get-Date)] Getting ECR password from AWS..."
	exec { $Env:password = & aws ecr get-login-password --region us-east-1 }

	Write-Host "[$(Get-Date)] Logging docker in to ECR repository..."
	exec { & docker login $repository --username AWS --password $Env:password }

	$image = "budget2"
	Write-Host "[$(Get-Date)] Building docker image $image..."
	exec { & docker build --build-arg version=$version -t $image . }

	Write-Host "[$(Get-Date)] Tagging docker image with version $version..."
	exec { & docker tag ${image}:latest $repository/${image}:$version }

	Write-Host "[$(Get-Date)] Tagging docker image with latest..."
	exec { & docker tag ${image}:latest $repository/${image}:latest }

	Write-Host "[$(Get-Date)] Pushing version image..."
	exec { & docker push $repository/${image}:$version }

	Write-Host "[$(Get-Date)] Pushing latest image..."
	exec { & docker push $repository/${image}:latest }

	Write-Host "[$(Get-Date)] Deleting local latest image..."
	exec { & docker rmi $repository/${image}:latest }

	Write-Host "[$(Get-Date)] Deleting local version image..."
	exec { & docker rmi $repository/${image}:$version }

	Write-Host "[$(Get-Date)] Deleting local build image..."
	exec { & docker rmi ${image}:latest }

	Write-Host "[$(Get-Date)] Successfully published image."
	exit 0
} catch {
	Write-Host $_ -BackgroundColor Red
	exit -1
}
