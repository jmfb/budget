using System.Collections.Generic;
using Budget.Server.Models;

namespace Budget.Server.Api.Models {
	public class GetExpensesResponse {
		public long Version { get; set; }
		public IEnumerable<Expense> Expenses { get; set; }
	}
}
