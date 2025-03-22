namespace Budget.Server.DbUp;

public class DatabaseOptions
{
	public string ServerName { get; set; } = string.Empty;
	public int Port { get; set; }
	public string MasterDatabase { get; set; } = string.Empty;
	public string ServiceDatabase { get; set; } = string.Empty;
	public string AdminUserName { get; set; } = string.Empty;
	public string AdminPassword { get; set; } = string.Empty;
	public string ServiceUserName { get; set; } = string.Empty;
	public string ServicePassword { get; set; } = string.Empty;

	public bool IsValid =>
		!string.IsNullOrWhiteSpace(ServerName)
		&& Port != 0
		&& !string.IsNullOrWhiteSpace(MasterDatabase)
		&& !string.IsNullOrWhiteSpace(ServiceDatabase)
		&& !string.IsNullOrWhiteSpace(AdminUserName)
		&& !string.IsNullOrWhiteSpace(AdminPassword)
		&& !string.IsNullOrWhiteSpace(ServiceUserName)
		&& !string.IsNullOrWhiteSpace(ServicePassword);

	public string MasterConnectionString => GetConnectionString(MasterDatabase);
	public string ServiceConnectionString =>
		GetConnectionString(ServiceDatabase);

	private string GetConnectionString(string database) =>
		string.Join(
			"; ",
			new Dictionary<string, object>
			{
				["Server"] = ServerName,
				["Port"] = Port,
				["Database"] = database,
				["User Id"] = AdminUserName,
				["Password"] = AdminPassword,
			}.Select(entry => $"{entry.Key}={entry.Value}")
		);
}
