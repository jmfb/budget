# Budget PostgreSQL DbUp Deployment

This directory contains the DbUp project for deploying schema changes and functions
to the PostgreSQL server.

## Deploying

```PowerShell
$Env:Database__ServerName = "psql.buysse.link"
$Env:Database__Port = 5432
$Env:Database__MasterDatabase = "postgres"
$Env:Database__ServiceDatabase = "budget"
$Env:Database__AdminUserName = "postgres"
$Env:Database__AdminPassword = "" # TODO: Set this from BitWarden
$Env:Database__ServiceUserName = "budget"
$Env:Database__ServicePassword = "" # TODO: Set this from BitWarden
dotnet run -- plan
dotnet run -- apply
```
