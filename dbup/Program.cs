using System;
using System.Reflection;
using DbUp;
using DbUp.Engine;
using DbUp.Helpers;
using Microsoft.Extensions.Configuration;

namespace Budget.Server.DbUp;

public static class Program {
	public static int Main(string[] args) {
		var builder = new ConfigurationBuilder().AddEnvironmentVariables();
		var configuration = builder.Build();
		var options = configuration.GetSection("Database").Get<DatabaseOptions>();
		if (options == null || !options.IsValid) {
			Console.WriteLine("Missing database environment variables.");
			return 1;
		}

		if (args.Length != 1 || !Enum.TryParse<Mode>(args[0], ignoreCase: true, out var mode)) {
			Console.WriteLine("Command line must be 'plan' or 'apply'.");
			return 1;
		}

		var preDeployment = DeployChanges
			.To.PostgresqlDatabase(options.ConnectionString)
			.JournalTo(new NullJournal())
			.WithScriptsEmbeddedInAssembly(
				Assembly.GetExecutingAssembly(),
				scriptName => scriptName.StartsWith("Budget.Server.DbUp.Scripts.PreDeployment")
			)
			.LogToConsole()
			.Build();

		var trackedChanges = DeployChanges
			.To.PostgresqlDatabase(options.ConnectionString)
			.WithVariables(new Dictionary<string, string> {
				["ServiceUserName"] = options.ServiceUserName,
				["ServicePassword"] = options.ServicePassword
			})
			.JournalToPostgresqlTable("dbup", "schema_versions")
			.WithScriptsEmbeddedInAssembly(
				Assembly.GetExecutingAssembly(),
				scriptName => scriptName.StartsWith("Budget.Server.DbUp.Scripts.Schema")
			)
			.LogToConsole()
			.Build();

		var untrackedChanges = DeployChanges
			.To.PostgresqlDatabase(options.ConnectionString)
			.JournalTo(new NullJournal())
			.WithScriptsEmbeddedInAssembly(
				Assembly.GetExecutingAssembly(),
				scriptName => scriptName.StartsWith("Budget.Server.DbUp.Scripts.StoredProcedures")
			)
			.LogToConsole()
			.Build();

		if (mode == Mode.Plan) {
			var scripts = trackedChanges.GetScriptsToExecute();
			Console.WriteLine("The following scripts will be run in apply mode:");
			foreach (var script in scripts) {
				Console.WriteLine(script.Name);
			}
			return 0;
		}

		Console.WriteLine("Running pre-deployment script.");
		var preDeploymentResult = preDeployment.PerformUpgrade();
		if (!preDeploymentResult.Successful) {
			Console.WriteLine(preDeploymentResult.Error);
			return 1;
		}
		Console.WriteLine("Success");

		Console.WriteLine("Running schema scripts.");
		var trackedResult = trackedChanges.PerformUpgrade();
		if (!trackedResult.Successful) {
			Console.WriteLine(trackedResult.Error);
			return 1;
		}
		Console.WriteLine("Success");

		Console.WriteLine("Running stored procedure scripts.");
		var untrackedResult = untrackedChanges.PerformUpgrade();
		if (!untrackedResult.Successful) {
			Console.WriteLine(untrackedResult.Error);
			return 1;
		}
		Console.WriteLine("Success");
		return 0;
	}
}
