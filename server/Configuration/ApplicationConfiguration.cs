using System;
using Dapper;
using Microsoft.AspNetCore.Builder;

namespace Budget.Server.Configuration;

public static class ApplicationConfiguration
{
	public static WebApplication Configure(this WebApplication app)
	{
		AppContext.SetSwitch("Npgsql.EnableStoredProcedureCompatMode", true);
		DefaultTypeMap.MatchNamesWithUnderscores = true;

		app.UsePathBase("/api");
		app.UseCors(policy =>
		{
			policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
		});
		app.UseRouting();
		app.UseAuthentication();
		app.UseAuthorization();
		app.UseEndpoints(_ => { });
		app.MapControllers();
		return app;
	}
}
