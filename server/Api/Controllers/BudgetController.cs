using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Budget.Server.Api.Models;
using Budget.Server.Models;
using Budget.Server.Services;

namespace Budget.Server.Api.Controllers {
	[Route("api/budget")]
	public class BudgetController : AuthorizedController {
		private IBudgetService BudgetService { get; }

		public BudgetController(IBudgetService budgetService) {
			BudgetService = budgetService;
		}

		[HttpGet]
		public async Task<BudgetResponse> GetBudgetAsync(
			string weekOf,
			CancellationToken cancellationToken
		) {
			var incomesTask = BudgetService.LoadAllIncomesAsync(cancellationToken);
			var expensesTask = BudgetService.LoadAllExpensesAsync(cancellationToken);
			var weeklyTransactionsTask = BudgetService.LoadWeeklyTransactionsAsync(weekOf, cancellationToken);
			return new BudgetResponse {
				Incomes = await incomesTask,
				Expenses = await expensesTask,
				WeeklyTransactions = await weeklyTransactionsTask
			};
		}

		[HttpPut("incomes")]
		public async Task<IActionResult> SaveIncomeAsync(
			[FromBody] Income income,
			CancellationToken cancellationToken
		) {
			await BudgetService.SaveIncomeAsync(income, cancellationToken);
			return Ok();
		}

		[HttpPut("expenses")]
		public async Task<IActionResult> SaveExpenseAsync(
			[FromBody] Expense expense,
			CancellationToken cancellationToken
		) {
			await BudgetService.SaveExpenseAsync(expense, cancellationToken);
			return Ok();
		}

		[HttpPut("transactions")]
		public async Task<IActionResult> SaveTransactionAsync(
			[FromBody] Transaction transaction,
			CancellationToken cancellationToken
		) {
			await BudgetService.SaveTransactionAsync(transaction, cancellationToken);
			return Ok();
		}

		[HttpGet("transactions/week-of/{weekOf}")]
		public async Task<IEnumerable<Transaction>> GetWeeklyTransactionsAsync(
			[FromRoute] string weekOf,
			CancellationToken cancellationToken) =>
			await BudgetService.LoadWeeklyTransactionsAsync(weekOf, cancellationToken);

		[HttpGet("transactions/{date}")]
		public async Task<IEnumerable<Transaction>> GetTransactionsAsync(
			[FromRoute] string date,
			CancellationToken cancellationToken) =>
			await BudgetService.LoadTransactionsAsync(date, cancellationToken);
	}
}
