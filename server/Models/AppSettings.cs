using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using System.Text.Json;
using Microsoft.IdentityModel.Tokens;
using Amazon.KeyManagementService;
using Amazon.KeyManagementService.Model;

namespace Budget.Server.Models {
	public class AppSettings {
		public string BundleVersion { get; set; }
		public SymmetricSecurityKey Key { get; set; }
		public string BudgetAuthClientSecret { get; set; }
		public IEnumerable<string> ScriptChunks { get; set; }
		public IEnumerable<string> StyleChunks { get; set; }

		public static SymmetricSecurityKey CreateKey() =>
			new SymmetricSecurityKey(Encoding.UTF8.GetBytes(GetEnvironmentVariable("BudgetTokenSecret")));

		public void Configure(SymmetricSecurityKey key, string webRootPath) {
			BundleVersion = Assembly
				.GetExecutingAssembly()
				.GetName()
				.Version
				.ToString();
			Key = key;
			BudgetAuthClientSecret = GetEnvironmentVariable(nameof(BudgetAuthClientSecret));
			(ScriptChunks, StyleChunks) = GetChunks(webRootPath);
		}

		private static (IEnumerable<string>, IEnumerable<string>) GetChunks(string webRootPath) {
			var assetsFileName = Path.Combine(webRootPath, "dist", "webpack-assets.json");
			var assetsJson = File.ReadAllText(assetsFileName);
			var document = JsonDocument.Parse(assetsJson);
			var root = document.RootElement;
			return (GetChunkFiles(root, "js"), GetChunkFiles(root, "css"));
		}

		private static IEnumerable<string> GetChunkFiles(JsonElement root, string fileType) {
			var chunkNames = new[] { "bundle", "" };
			foreach (var chunkName in chunkNames)
				foreach (var file in GetChunkFiles(root, chunkName, fileType))
					yield return file;
		}

		private static IEnumerable<string> GetChunkFiles(JsonElement root, string chunkName, string fileType) {
			if (root.TryGetProperty(chunkName, out var chunk) &&
				chunk.TryGetProperty(fileType, out var files)) {
				if (files.ValueKind == JsonValueKind.String) {
					yield return files.GetString();
				} else if (files.ValueKind == JsonValueKind.Array) {
					foreach (var script in files.EnumerateArray())
						yield return script.GetString();
				}
			}
		}

		private static string GetEnvironmentVariable(string name) =>
			GetAndDecryptEnvironmentVariable($"Encrypted{name}") ??
			Environment.GetEnvironmentVariable(name);

		private static string GetAndDecryptEnvironmentVariable(string name) =>
			DecryptEnvironmentVariable(Environment.GetEnvironmentVariable(name));

		private static AmazonKeyManagementServiceClient CreateKeyManagementServiceClient() =>
			new AmazonKeyManagementServiceClient(new AmazonKeyManagementServiceConfig {
				// Must specify the ClientConfig.HttpClientCacheSize to avoid "Not supported on this platform" error.
				HttpClientCacheSize = Environment.ProcessorCount
			});

		private static string DecryptEnvironmentVariable(string ciphertext) {
			if (string.IsNullOrEmpty(ciphertext))
				return null;
			using var client = CreateKeyManagementServiceClient();
			using var ciphertextBlob = new MemoryStream(Convert.FromBase64String(ciphertext));
			var result = client.DecryptAsync(new DecryptRequest {
				CiphertextBlob = ciphertextBlob
			}).Result;
			using var stringReader = new StreamReader(result.Plaintext);
			return stringReader.ReadToEnd();
		}
	}
}
