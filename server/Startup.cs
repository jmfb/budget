using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Budget.Server.Configuration;
using Budget.Server.Models;
using Budget.Server.Services;
using Amazon;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;

namespace Budget.Server;

public class Startup {
	public IConfiguration Configuration { get; }
	public IWebHostEnvironment HostEnvironment { get; }

	public Startup(IConfiguration configuration, IWebHostEnvironment hostEnvironment) {
		Configuration = configuration;
		HostEnvironment = hostEnvironment;
	}

	public void ConfigureServices(IServiceCollection services) {
		var key = AppSettings.CreateKey();
		services.Configure<AppSettings>(settings => settings.Configure(key, HostEnvironment.WebRootPath));
		services.AddHttpClient<IAuthenticationService, AuthenticationService>();
		services.AddSingleton<AmazonDynamoDBClient>(provider => HostEnvironment.IsDevelopment() ?
			new AmazonDynamoDBClient(new AmazonDynamoDBConfig { ServiceURL = "http://localhost:8000" }) :
			new AmazonDynamoDBClient(new AmazonDynamoDBConfig { RegionEndpoint = RegionEndpoint.USEast1 }));
		services.AddSingleton<DynamoDBContext>(provider =>
			new DynamoDBContext(provider.GetRequiredService<AmazonDynamoDBClient>()));
		services.AddSingleton<IExpensesService, ExpensesService>();
		services.AddSingleton<IIncomesService, IncomesService>();
		services.AddSingleton<IPendingItemsService, PendingItemsService>();
		services.AddSingleton<ITransactionsService, TransactionsService>();
		services.AddSingleton<IDataVersionsService, DataVersionsService>();
		services.AddControllers();
		services
			.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
			.AddJwtBearer(options => Authentication.Configure(options, key));
		services.AddMvc();
	}

	public void Configure(IApplicationBuilder app) {
		app.UseHsts();
		app.UseHttpsRedirection();
		app.UseStaticFiles(StaticFiles.Configure());
		app.UseRouting();
		app.UseAuthentication();
		app.UseAuthorization();
		app.UseEndpoints(Endpoints.Configure);
	}
}
