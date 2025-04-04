using System;
using Amazon;
using Amazon.SecretsManager;
using Amazon.SecretsManager.Extensions.Caching;
using Budget.Server.DAL;
using Budget.Server.Options;
using Budget.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Budget.Server.Configuration;

public static class ServicesConfiguration
{
	public static WebApplicationBuilder Configure(
		this WebApplicationBuilder builder
	)
	{
		ConfigureServices(builder.Services, builder.Configuration);
		return builder;
	}

	public static void ConfigureServices(
		IServiceCollection services,
		IConfiguration configuration
	)
	{
		var secrets = ConfigureSecrets(services);
		services.Configure<DatabaseOptions>(
			configuration.GetSection("Database")
		);
		services.AddHttpClient<IAuthenticationService, AuthenticationService>();
		services.AddSingleton<IDiagnosticDataBridge, DiagnosticDataBridge>();
		services.AddSingleton<ICategoryDataBridge, CategoryDataBridge>();
		services.AddSingleton<IIncomeDataBridge, IncomeDataBridge>();
		services.AddSingleton<IExpenseDataBridge, ExpenseDataBridge>();
		services.AddSingleton<IPendingItemDataBridge, PendingItemDataBridge>();
		services.AddSingleton<ITransactionDataBridge, TransactionDataBridge>();
		services.AddControllers();
		services
			.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
			.AddJwtBearer(options =>
				Authentication.Configure(options, secrets.Key)
			);
		services.AddCors();
	}

	private static Secrets ConfigureSecrets(IServiceCollection services)
	{
		var region = RegionEndpoint.USEast1;
		var secretsConfig = new AmazonSecretsManagerConfig
		{
			RegionEndpoint = region,
			HttpClientCacheSize = Environment.ProcessorCount,
		};
		using var secretsClient = new AmazonSecretsManagerClient(secretsConfig);
		using var cache = new SecretsManagerCache(secretsClient);
		var secrets = new Secrets
		{
			DatabasePassword = GetSetting("BudgetDatabasePassword", cache),
			AuthClientSecret = GetSetting("BudgetAuthClientSecret", cache),
			TokenSecret = GetSetting("BudgetTokenSecret", cache),
		};
		services.AddSingleton(secrets);
		return secrets;
	}

	private static string GetSetting(string name, SecretsManagerCache cache)
	{
		var setting = Environment.GetEnvironmentVariable(name);
		return string.IsNullOrEmpty(setting)
			? cache.GetSecretString(name).Result
			: setting;
	}
}
