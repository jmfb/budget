using Amazon.Lambda.AspNetCoreServer;
using Budget.Server.Configuration;
using Microsoft.AspNetCore.Hosting;

namespace Budget.Server;

public class LambdaEntryPoint : APIGatewayProxyFunction
{
	protected override void Init(IWebHostBuilder builder) =>
		builder.UseStartup<LambdaStartup>().UseLambdaServer();
}
