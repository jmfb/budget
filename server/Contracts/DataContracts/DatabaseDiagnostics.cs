using System;

namespace Budget.Server.Contracts.DataContracts;

public class DatabaseDiagnostics
{
	public DateTimeOffset StartTime { get; set; }
	public DateTimeOffset ServerTime { get; set; }
	public string Version { get; set; }
}
