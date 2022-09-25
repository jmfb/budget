using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Budget.Server.Api.Models;
using Budget.Server.Models;
using Budget.Server.Services;

namespace Budget.Server.Api.Controllers {
	[Route("api/expenses")]
	public class ExpensesController : AuthorizedController {
		private IExpensesService ExpensesService { get; }

		public ExpensesController(IExpensesService expensesService) {
			ExpensesService = expensesService;
		}

		[HttpGet("version")]
		public async Task<long> GetVersionAsync(
			CancellationToken cancellationToken
		) {
			var version = await ExpensesService.GetVersionAsync(cancellationToken);
			return version?.Version ?? 0;
		}

		[HttpGet]
		public async Task<GetExpensesResult> GetExpensesAsync(
			CancellationToken cancellationToken
		) {
			var versionTask = ExpensesService.GetVersionAsync(cancellationToken);
			var expensesTask = ExpensesService.GetExpensesAsync(cancellationToken);
			await Task.WhenAll(versionTask, expensesTask);
			return new() {
				Version = (await versionTask)?.Version ?? 0,
				Expenses = await expensesTask
			};
		}

		[HttpGet("{name}")]
		public async Task<Expense> GetExpenseAsync(
			[FromRoute] string name,
			CancellationToken cancellationToken
		) {
			return await ExpensesService.GetExpenseAsync(name, cancellationToken);
		}

		[HttpPut]
		public async Task<long> PutExpenseAsync(
			[FromBody] Expense expense,
			CancellationToken cancellationToken
		) {
			var versionTask = ExpensesService.GetNewVersionAsync(cancellationToken);
			var saveTask = ExpensesService.SaveExpenseAsync(expense, cancellationToken);
			await Task.WhenAll(versionTask, saveTask);
			return (await versionTask).Version;
		}

		[HttpDelete("{name}")]
		public async Task<long> DeleteExpenseAsync(
			[FromRoute] string name,
			CancellationToken cancellationToken
		) {
			var versionTask = ExpensesService.GetNewVersionAsync(cancellationToken);
			var deleteTask = ExpensesService.DeleteExpenseAsync(name, cancellationToken);
			await Task.WhenAll(versionTask, deleteTask);
			return (await versionTask).Version;
		}
	}
}
