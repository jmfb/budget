# Budget Web API Backend Server

This directory contains the project for running a Kestrel Web API server for
the budget project.

## Local Development

```PowerShell
$Env:BudgetTokenSecret = "" # TODO: Set this from BitWarden
$Env:BudgetDatabasePassword = "" # TODO: Set this from BitWarden
dotnet run
```

You can then access the server at http://localbudget.buysse.link
* [Diagnostic Ping](http://localbudget.buysse.link/api/diagnostics/ping)
