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

		[HttpGet("week-of/{weekOf}")]
		public async Task<BudgetResponse> GetBudgetAsync(
			[FromRoute] string weekOf,
			CancellationToken cancellationToken
		) {
			var incomesTask = BudgetService.LoadAllIncomesAsync(cancellationToken);
			var expensesTask = BudgetService.LoadAllExpensesAsync(cancellationToken);
			var weeklyTransactionsTask = BudgetService.LoadWeeklyTransactionsAsync(weekOf, cancellationToken);
			var pendingItemsTask = BudgetService.LoadAllPendingItemsAsync(cancellationToken);
			return new BudgetResponse {
				Incomes = await incomesTask,
				Expenses = await expensesTask,
				WeeklyTransactions = await weeklyTransactionsTask,
				PendingItems = await pendingItemsTask
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

		[HttpDelete("incomes/{name}")]
		public async Task<IActionResult> DeleteIncomeAsync(
			[FromRoute] string name,
			CancellationToken cancellationToken
		) {
			await BudgetService.DeleteIncomeAsync(name, cancellationToken);
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

		[HttpDelete("expenses/{name}")]
		public async Task<IActionResult> DeleteExpenseAsync(
			[FromRoute] string name,
			CancellationToken cancellationToken
		) {
			await BudgetService.DeleteExpenseAsync(name, cancellationToken);
			return Ok();
		}

		[HttpPut("pending-items")]
		public async Task<IActionResult> SavePendingItemAsync(
			[FromBody] PendingItem pendingItem,
			CancellationToken cancellationToken
		) {
			await BudgetService.SavePendingItemAsync(pendingItem, cancellationToken);
			return Ok();
		}

		[HttpDelete("pending-items/{id}")]
		public async Task<IActionResult> DeletePendingItemAsync(
			[FromRoute] int id,
			CancellationToken cancellationToken
		) {
			await BudgetService.DeletePendingItemAsync(id, cancellationToken);
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

		[HttpDelete("transactions/{date}/{id}")]
		public async Task<IActionResult> DeleteIncomeAsync(
			[FromRoute] string date,
			[FromRoute] int id,
			CancellationToken cancellationToken
		) {
			await BudgetService.DeleteTransactionAsync(date, id, cancellationToken);
			return Ok();
		}
	}
}
