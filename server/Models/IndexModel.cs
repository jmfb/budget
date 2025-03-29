using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Budget.Server.Models;

public class IndexModel {
	public string BundleVersion { get; set; }
	public long ExpensesVersion { get; set; }
	public long IncomesVersion { get; set; }
	public long PendingItemsVersion { get; set; }
	public IReadOnlyDictionary<string, long> WeekVersions { get; set; }

	[JsonIgnore]
	public IEnumerable<string> ScriptChunks { get; set; }

	[JsonIgnore]
	public IEnumerable<string> StyleChunks { get; set; }

	public string ToJson() => JsonSerializer.Serialize(
		this,
		new JsonSerializerOptions {
			PropertyNamingPolicy = JsonNamingPolicy.CamelCase
		});
}
