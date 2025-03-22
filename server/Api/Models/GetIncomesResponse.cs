using System.Collections.Generic;
using Budget.Server.Models;

namespace Budget.Server.Api.Models;

public class GetIncomesResponse
{
	public long Version { get; set; }
	public IEnumerable<Income> Incomes { get; set; }
}
