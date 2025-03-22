using Budget.Server.Configuration;
using Budget.Server.DAL;
using Budget.Server.Models;
using Budget.Server.Options;
using Budget.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Budget.Server;

public class Startup
{
	public IConfiguration Configuration { get; }
	public IWebHostEnvironment HostEnvironment { get; }

	public Startup(
		IConfiguration configuration,
		IWebHostEnvironment hostEnvironment
	)
	{
		Configuration = configuration;
		HostEnvironment = hostEnvironment;
	}

	public void ConfigureServices(IServiceCollection services)
	{
		var key = AppSettings.CreateKey();
		services.Configure<AppSettings>(settings => settings.Configure(key));
		services.Configure<DatabaseOptions>(
			Configuration.GetSection("Database")
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
		services.AddMvc();
	}

	public void Configure(IApplicationBuilder app)
	{
		app.UseHsts();
		app.UseHttpsRedirection();
		app.UseRouting();
		app.UseAuthentication();
		app.UseAuthorization();
		app.UseEndpoints(Endpoints.Configure);
	}
}
