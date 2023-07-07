# Weekly Budget Tracker

Cooperative app for tracking weekly expenses against a budget.

## Prerequisites

* Download [terraform 1.3.1](https://releases.hashicorp.com/terraform/1.3.1/terraform_1.3.1_windows_amd64.zip) and alias to terraform_1.3.1
* `choco install awscli` (min version 2.1.29)
* `choco install dotnet` (min version 6.0.8)
* `choco install dotnet-sdk` (min version 6.0.400)
* `choco install nodejs` (min version 16.0.0)
* `npm install -g yarn` (using modern version)
* [Docker for Windows](https://docs.docker.com/docker-for-windows/install/)

## AWS Bootstrapping

* Create an AWS free tier account.
* Create an IAM User `deployment` with AdministratorAccess.
	* Store credentials in BitWarden.
	* Set up local AWS CLI configuration to use account.
* Create an S3 Bucket `jmfb-terraform` with versioning enabled.
* Create a DynamoDB table `tfstate-lock` with primary key `LockID` of type string.
* Register the `buysse.link` domain in Route 53.
* Create `budget` ECR repository

## Google OAuth Setup

Go to the [API Credentials Page](https://console.cloud.google.com/apis/credentials) and create an OAuth 2 Client ID
with the Name `Budget`.

**JavaScript Origins**
* https://budget.buysse.link
* https://localbudget.buysse.link:6001

**Authorized Redirect URIs**
* https://budget.buysse.link/authenticate
* https://localbudget.buysse.link:6001/authenticate

Store the Client Secret in BitWarden.

## Local Machine Setup

Add the following entry to your hosts file: `C:\Windows\System32\drivers\etc\hosts`
```
127.0.0.1 localbudget.buysse.link
```

Generate a TokenSecret and store it in BitWarden.

Get the following secrets from BitWarden and run in powershell to setup local environment variables.
```PowerShell
[Environment]::SetEnvironmentVariable("BudgetAuthClientSecret", "TODO", [EnvironmentVariableTarget]::Machine)
[Environment]::SetEnvironmentVariable("BudgetTokenSecret", "TODO", [EnvironmentVariableTarget]::Machine)
```

## Development

Start your client watcher:
```PowerShell
cd client
& yarn run start
```

Start your server watcher:
```PowerShell
cd server
& dotnet watch run
```

Start your local dynamo db:
```PowerShell
. .\StartDynamoDb.ps1 -pull
```

Deploy tables and data to dynamo:
```PowerShell
. .\CreateTables.ps1
. .\CreateData.ps1 -userId "TODO: your Google id here"
```

Run your storybook watcher:
```PowerShell
cd client
& yarn run storybook
```

## Deployment

```PowerShell
. .\Release.ps1
... (review terraform plan) ...
> apply
... (review images to delete) ...
> delete
```

## Maintenance

### Server

You should run the following commands to ensure your pacakge references are up to date:

```PowerShell
dotnet list package --outdated
...
dotnet add package <PACKAGE-NAME>
dotnet add package <PACKAGE-NAME> --version <VERSION>
...
```

### Client

You should run the following commands to ensure your package references are up to date:

```PowerShell
yarn upgrade-interactive
```

You may occasionally need to delete caniuse-lite from the yarn lock file in order to pull in the latest version.
