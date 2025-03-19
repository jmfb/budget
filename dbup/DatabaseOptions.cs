namespace Budget.Server.DbUp;

public class DatabaseOptions {
	public string ServerName { get; set; } = string.Empty;
	public int Port { get; set; }
	public string Database { get; set; } = string.Empty;
	public string AdminUserName { get; set; } = string.Empty;
	public string AdminPassword { get; set; } = string.Empty;
	public string ServiceUserName { get; set; } = string.Empty;
	public string ServicePassword { get; set; } = string.Empty;

	public bool IsValid =>
		!string.IsNullOrWhiteSpace(ServerName) &&
		Port != 0 &&
		!string.IsNullOrWhiteSpace(Database) &&
		!string.IsNullOrWhiteSpace(AdminUserName) &&
		!string.IsNullOrWhiteSpace(AdminPassword) &&
		!string.IsNullOrWhiteSpace(ServiceUserName) &&
		!string.IsNullOrWhiteSpace(ServicePassword);

	public string ConnectionString =>
		string.Join("; ", new Dictionary<string, object> {
			["Server"] = ServerName,
			["Port"] = Port,
			["Database"] = Database,
			["User Id"] = AdminUserName,
			["Password"] = AdminPassword
		}.Select(entry => $"{entry.Key}={entry.Value}"));
}
