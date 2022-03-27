using System.Collections.Generic;
using Budget.Server.Models;

namespace Budget.Server.Api.Models {
	public class BudgetResponse {
		public IEnumerable<Income> Incomes { get; set; }
		public IEnumerable<Expense> Expenses { get; set; }
		public IEnumerable<Transaction> WeeklyTransactions { get; set; }
		public IEnumerable<PendingItem> PendingItems { get; set; }
	}
}
