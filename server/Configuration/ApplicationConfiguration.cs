using Microsoft.AspNetCore.Builder;

namespace Budget.Server.Configuration;

public static class ApplicationConfiguration
{
	public static WebApplication Configure(this WebApplication app)
	{
		ConfigureApplication(app);
		return app;
	}

	public static void ConfigureApplication(IApplicationBuilder app)
	{
		DapperConfiguration.Configure();
		app.UsePathBase("/api");
		app.UseCors(policy =>
		{
			policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
		});
		app.UseRouting();
		app.UseAuthentication();
		app.UseAuthorization();
		app.UseEndpoints(endpoints => endpoints.MapControllers());
	}
}
