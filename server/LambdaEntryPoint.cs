using System;
using System.Collections.Generic;
using System.IO;
using Amazon.Lambda.AspNetCoreServer;
using Amazon.Lambda.Core;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;

namespace Budget.Server {
	public class LambdaEntryPoint : APIGatewayProxyFunction {
		protected override void Init(IWebHostBuilder builder) {
			RegisterBinaryContentTypes();
			builder
				.UseContentRoot(Directory.GetCurrentDirectory())
				.UseStartup<Startup>()
				.UseLambdaServer();
		}

		private readonly IEnumerable<string> binaryContentTypes = new[] {
			"image/x-icon",
			"image/png"
		};

		private void RegisterBinaryContentTypes() {
			foreach (var contentType in binaryContentTypes)
				RegisterResponseContentEncodingForContentType(contentType, ResponseContentEncoding.Base64);
		}
	}
}
