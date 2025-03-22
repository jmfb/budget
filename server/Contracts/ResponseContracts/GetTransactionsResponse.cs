using System.Collections.Generic;
using Budget.Server.Contracts.DataContracts;

namespace Budget.Server.Contracts.ResponseContracts;

public class GetTransactionsResponse
{
	public IEnumerable<Transaction> Transactions { get; set; }
	public string NextPageKey { get; set; }
}
