using System;
using System.IO;
using System.Text;
using Amazon.KeyManagementService;
using Amazon.KeyManagementService.Model;
using Microsoft.IdentityModel.Tokens;

namespace Budget.Server.Models;

public class AppSettings
{
	public SymmetricSecurityKey Key { get; set; }
	public string BudgetAuthClientSecret { get; set; }
	public string DatabasePassword { get; set; }

	public static SymmetricSecurityKey CreateKey() =>
		new SymmetricSecurityKey(
			Encoding.UTF8.GetBytes(GetEnvironmentVariable("BudgetTokenSecret"))
		);

	public void Configure(SymmetricSecurityKey key)
	{
		Key = key;
		BudgetAuthClientSecret = GetEnvironmentVariable(
			nameof(BudgetAuthClientSecret)
		);
		DatabasePassword = GetEnvironmentVariable(nameof(DatabasePassword));
	}

	private static string GetEnvironmentVariable(string name) =>
		GetAndDecryptEnvironmentVariable($"Encrypted{name}")
		?? Environment.GetEnvironmentVariable(name);

	private static string GetAndDecryptEnvironmentVariable(string name) =>
		DecryptEnvironmentVariable(Environment.GetEnvironmentVariable(name));

	private static AmazonKeyManagementServiceClient CreateKeyManagementServiceClient() =>
		new AmazonKeyManagementServiceClient(
			new AmazonKeyManagementServiceConfig
			{
				// Must specify the ClientConfig.HttpClientCacheSize to avoid "Not supported on this platform" error.
				HttpClientCacheSize = Environment.ProcessorCount,
			}
		);

	private static string DecryptEnvironmentVariable(string ciphertext)
	{
		if (string.IsNullOrEmpty(ciphertext))
			return null;
		using var client = CreateKeyManagementServiceClient();
		using var ciphertextBlob = new MemoryStream(
			Convert.FromBase64String(ciphertext)
		);
		var result = client
			.DecryptAsync(
				new DecryptRequest { CiphertextBlob = ciphertextBlob }
			)
			.Result;
		using var stringReader = new StreamReader(result.Plaintext);
		return stringReader.ReadToEnd();
	}
}
