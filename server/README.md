# Budget Web API Backend Server

This directory contains the project for running a Kestrel Web API server for
the budget project.

## Local Development

Add the following entry to your hosts file: `C:\Windows\System32\drivers\etc\hosts`
```
127.0.0.1 localbudget-api.buysse.link
```

Trust the self-signed developer certificate from dotnet:
```PowerShell
dotnet dev-certs https --trust
```

```PowerShell
$Env:BudgetTokenSecret = "" # TODO: Set this from BitWarden
$Env:BudgetDatabasePassword = "" # TODO: Set this from BitWarden
$Env:BudgetAuthClientSecret = "" # TODO: Set this from BitWarden
dotnet run
```

You can then access the server at https://localbudget-api.buysse.link
* [Diagnostic Ping](https://localbudget-api.buysse.link/api/diagnostics/ping)
