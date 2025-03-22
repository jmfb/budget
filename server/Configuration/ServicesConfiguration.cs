using Budget.Server.DAL;
using Budget.Server.Models;
using Budget.Server.Options;
using Budget.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Budget.Server.Configuration;

public static class ServicesConfiguration
{
	public static WebApplicationBuilder Configure(
		this WebApplicationBuilder builder
	)
	{
		var services = builder.Services;
		var configuration = builder.Configuration;
		var key = AppSettings.CreateKey();
		services.Configure<AppSettings>(settings => settings.Configure(key));
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
			.AddJwtBearer(options => Authentication.Configure(options, key));
		services.AddCors();
		return builder;
	}
}
