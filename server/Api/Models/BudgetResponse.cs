using System.Collections.Generic;
using Budget.Server.Models;

namespace Budget.Server.Api.Models {
	public class BudgetResponse {
		public IEnumerable<Transaction> WeeklyTransactions { get; set; }
		public IReadOnlyDictionary<string, decimal> YearlyExpenseTotals { get; set; }
		public IEnumerable<PendingItem> PendingItems { get; set; }
	}
}
