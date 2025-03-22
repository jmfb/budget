using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace Budget.Server;

public static class Program
{
	public static void Main(string[] args) =>
		CreateWebHostBuilder(args).Build().Run();

	public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
		WebHost.CreateDefaultBuilder(args).UseStartup<Startup>();
}
