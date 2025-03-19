using System;
using System.Reflection;
using DbUp;
using DbUp.Engine;
using DbUp.Helpers;
using Npgsql;
using Dapper;
using System.Data;

namespace Budget.Server.DbUp;

public class Executor(DatabaseOptions options) {
	public async Task<int> PlanAsync() {
		if (!await RunMasterDeploymentAsync()) {
			return 1;
		}

		Console.WriteLine("The following scripts will be run in apply mode:");
		var scripts = SchemaDeployment.GetScriptsToExecute();
		foreach (var script in scripts) {
			Console.WriteLine(script.Name);
		}

		return 0;
	}

	public async Task<int> ApplyAsync() => await RunAllDeploymentsAsync() ? 0 : 1;

	private async Task<bool> ServiceDatabaseExistsAsync() {
		var connection = new NpgsqlConnection(options.MasterConnectionString);
		await connection.OpenAsync();
		var command = new CommandDefinition(
			"SELECT 1 FROM pg_database WHERE datname = @serviceDatabase",
			new { serviceDatabase = options.ServiceDatabase },
			commandType: CommandType.Text
		);
		var result = await connection.QuerySingleOrDefaultAsync<int>(command);
		return result == 1;
	}

	private async Task<bool> RunAllDeploymentsAsync() =>
		await RunMasterDeploymentAsync() &&
		RunPreDeployment() &&
		RunSchemaDeployment() &&
		RunStoredProcedureDeployment();

	private async Task<bool> RunMasterDeploymentAsync() {
		if (await ServiceDatabaseExistsAsync()) {
			Console.WriteLine("Service database already exists.");
			return true;
		}
		return RunDeployment(MasterDeployment, "Running pre-deployment script against master database");
	}
	private bool RunPreDeployment() =>
		RunDeployment(PreDeployment, "Running pre-deployment script against service database");
	private bool RunSchemaDeployment() =>
		RunDeployment(SchemaDeployment, "Running schema deployment");
	private bool RunStoredProcedureDeployment() =>
		RunDeployment(StoredProcedureDeployment, "Running stored procedure deployment");

	private static bool RunDeployment(UpgradeEngine deployment, string message) {
		Console.WriteLine(message);
		var result = deployment.PerformUpgrade();
		if (result.Successful) {
			Console.WriteLine("Success");
			return true;
		}
		Console.WriteLine(result.Error);
		return false;
	}

	private UpgradeEngine MasterDeployment => DeployChanges
		.To.PostgresqlDatabase(options.MasterConnectionString)
		.WithVariables(new Dictionary<string, string> {
			["ServiceDatabase"] = options.ServiceDatabase
		})
		.JournalTo(new NullJournal())
		.WithScriptsEmbeddedInAssembly(
			Assembly.GetExecutingAssembly(),
			scriptName => scriptName.Contains("DbUp.Scripts.PreDeployment.Master")
		)
		.LogToConsole()
		.Build();

	private UpgradeEngine PreDeployment => DeployChanges
		.To.PostgresqlDatabase(options.ServiceConnectionString)
		.JournalTo(new NullJournal())
		.WithScriptsEmbeddedInAssembly(
			Assembly.GetExecutingAssembly(),
			scriptName => scriptName.Contains("DbUp.Scripts.PreDeployment.Service")
		)
		.LogToConsole()
		.Build();

	private UpgradeEngine SchemaDeployment => DeployChanges
		.To.PostgresqlDatabase(options.ServiceConnectionString)
		.WithVariables(new Dictionary<string, string> {
			["ServiceUserName"] = options.ServiceUserName,
			["ServicePassword"] = options.ServicePassword
		})
		.JournalToPostgresqlTable("dbup", "schema_versions")
		.WithScriptsEmbeddedInAssembly(
			Assembly.GetExecutingAssembly(),
			scriptName => scriptName.Contains("DbUp.Scripts.Schema")
		)
		.LogToConsole()
		.Build();

	private UpgradeEngine StoredProcedureDeployment => DeployChanges
		.To.PostgresqlDatabase(options.ServiceConnectionString)
		.JournalTo(new NullJournal())
		.WithScriptsEmbeddedInAssembly(
			Assembly.GetExecutingAssembly(),
			scriptName => scriptName.Contains("DbUp.Scripts.StoredProcedures")
		)
		.LogToConsole()
		.Build();
}
