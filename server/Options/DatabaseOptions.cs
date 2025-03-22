using System.Collections.Generic;
using System.Linq;

namespace Budget.Server.Options;

public class DatabaseOptions
{
	public string ServerName { get; set; }
	public int Port { get; set; }
	public string UserName { get; set; }
	public string Password { get; set; }

	public string ConnectionString =>
		string.Join(
			"; ",
			new Dictionary<string, object>
			{
				["Server"] = ServerName,
				["Port"] = Port,
				["Database"] = "budget",
				["User Id"] = UserName,
				["Password"] = Password,
			}.Select(entry => $"{entry.Key}={entry.Value}")
		);
}
