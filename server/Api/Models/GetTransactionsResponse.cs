using System.Collections.Generic;
using Budget.Server.Models;

namespace Budget.Server.Api.Models;

public class GetTransactionsResponse {
	public long Version { get; set; }
	public string WeekOf { get; set; }
	public IEnumerable<Transaction> Transactions { get; set; }
}
