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
			var weeklyTransactionsTask = BudgetService.LoadWeeklyTransactionsAsync(weekOf, cancellationToken);
			var yearlyExpenseTotalsTask = BudgetService.GetYearlyExpenseTotals(weekOf, cancellationToken);
			return new BudgetResponse {
				WeeklyTransactions = await weeklyTransactionsTask,
				YearlyExpenseTotals = await yearlyExpenseTotalsTask
			};
		}

		[HttpGet("yearly-expenses/{expense}/{year}")]
		public async Task<IEnumerable<Transaction>> GetYearlyExpenses(
			[FromRoute] string expense,
			[FromRoute] int year,
			CancellationToken cancellationToken
		) {
			return await BudgetService.GetYearlyExpenses(expense, year, cancellationToken);
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
		public async Task<WeeklyTransactionsResponse> GetWeeklyTransactionsAsync(
			[FromRoute] string weekOf,
			CancellationToken cancellationToken
		) {
			var transactionsTask = BudgetService.LoadWeeklyTransactionsAsync(weekOf, cancellationToken);
			var yearlyExpenseTotalsTask = BudgetService.GetYearlyExpenseTotals(weekOf, cancellationToken);
			return new WeeklyTransactionsResponse {
				WeeklyTransactions = await transactionsTask,
				YearlyExpenseTotals = await yearlyExpenseTotalsTask
			};
		}

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
