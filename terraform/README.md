# Terraform

This directory contains the desired state configuration for all infrastructure
artifacts in AWS. Note that the underlying postgres server is maintained in the
aws-vpc terraform project since it is shared.

## Deployment

### Building client

```PowerShell
cd client
nvs use
yarn install
yarn run build-prod
$Env:TF_VAR_release_version = (Get-Date).ToString()
```
### Publishing Server Image

The API is hosted in a Lambda but is using the "bring your own image" method
of deploying a docker image for the runtime.  Note that this is being used to
stay on the bleeding edge of .NET versions.

```PowerShell
. ./PublishImage.ps1
```

### Deployment

```PowerShell
cd terraform
terraform init
$Env:TF_VAR_token_secret = $Env:BudgetTokenSecret
$Env:TF_VAR_auth_client_secret = $Env:BudgetAuthClientSecret
$Env:TF_VAR_database_password = $Env:BudgetDatabasePassword
terraform plan
terraform apply
```

### Cleaning up old unused container images

To make sure you don't incur any additional charges for unused old container
images, run the following script to prune all but the latest image.  NOTE: Do
not run this immediately after publishing because the lambda wil fail to download
the image.  This is only safe to run after a successful terraform deployment.

```PowerShell
. ./DeleteOldImages.ps1
```
