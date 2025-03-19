using Microsoft.Extensions.Configuration;

namespace Budget.Server.DbUp;

public static class Program {
	public static async Task<int> Main(string[] args) {
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

		var executor = new Executor(options);
		return mode == Mode.Plan ?
			await executor.PlanAsync() :
			await executor.ApplyAsync();
	}
}
