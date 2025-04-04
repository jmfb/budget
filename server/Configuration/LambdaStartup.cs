using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Budget.Server.Configuration;

public class LambdaStartup(IConfiguration configuration)
{
	public void ConfigureServices(IServiceCollection services) =>
		ServicesConfiguration.ConfigureServices(services, configuration);

	public void Configure(IApplicationBuilder app) =>
		ApplicationConfiguration.ConfigureApplication(app);
}
