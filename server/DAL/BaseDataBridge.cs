using System.Collections.Generic;
using System.Linq;
using Budget.Server.Models;
using Budget.Server.Options;

namespace Budget.Server.DAL;

public class BaseDataBridge(DatabaseOptions options, AppSettings appSettings)
{
	protected string ConnectionString =>
		string.Join(
			"; ",
			new Dictionary<string, object>
			{
				["Server"] = options.ServerName,
				["Port"] = options.Port,
				["Database"] = "budget",
				["User Id"] = options.UserName,
				["Password"] = appSettings.DatabasePassword,
			}.Select(entry => $"{entry.Key}={entry.Value}")
		);
}
