using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;

namespace Budget.Server.Configuration;

public static class StaticFiles
{
	public static StaticFileOptions Configure() =>
		new StaticFileOptions
		{
			OnPrepareResponse = context =>
			{
				var headers = context.Context.Response.GetTypedHeaders();
				headers.CacheControl = new CacheControlHeaderValue
				{
					Public = true,
					MaxAge = TimeSpan.FromDays(30),
				};
				headers.Expires = DateTime.UtcNow.AddDays(30);
			},
		};
}
