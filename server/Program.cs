using Budget.Server.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

namespace Budget.Server;

public static class Program
{
	public static void Main(string[] args) =>
		WebApplication
			.CreateBuilder(args)
			.Configure()
			.Build()
			.Configure()
			.Run();
}
