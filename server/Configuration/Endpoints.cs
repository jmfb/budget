using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

namespace Budget.Server.Configuration;

public static class Endpoints
{
	public static void Configure(IEndpointRouteBuilder endpoints)
	{
		endpoints.MapControllers();
	}
}
