using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Budget.Server.Api.Models;
using Budget.Server.Models;
using Budget.Server.Services;

namespace Budget.Server.Api.Controllers;

[Route("api/expenses")]
public class ExpensesController : AuthorizedController {
	private IExpensesService ExpensesService { get; }
	private IDataVersionsService DataVersionsService { get; }

	public ExpensesController(
		IExpensesService expensesService,
		IDataVersionsService dataVersionsService
	) {
		ExpensesService = expensesService;
		DataVersionsService = dataVersionsService;
	}

	[HttpGet("version")]
	public async Task<long> GetVersionAsync(
		CancellationToken cancellationToken
	) {
		return await DataVersionsService.GetVersionAsync(
			DataVersionNames.Expenses,
			cancellationToken
		);
	}

	[HttpGet]
	public async Task<GetExpensesResponse> GetExpensesAsync(
		CancellationToken cancellationToken
	) {
		var versionTask = DataVersionsService.GetVersionAsync(
			DataVersionNames.Expenses,
			cancellationToken
		);
		var expensesTask = ExpensesService.GetExpensesAsync(cancellationToken);
		await Task.WhenAll(versionTask, expensesTask);
		return new() {
			Version = await versionTask,
			Expenses = await expensesTask
		};
	}

	[HttpGet("{name}")]
	public async Task<IActionResult> GetExpenseAsync(
		[FromRoute] string name,
		CancellationToken cancellationToken
	) {
		var expense = await ExpensesService.GetExpenseAsync(name, cancellationToken);
		if (expense == null) {
			return NotFound();
		}
		return Ok(expense);
	}

	[HttpPut]
	public async Task<long> PutExpenseAsync(
		[FromBody] Expense expense,
		CancellationToken cancellationToken
	) {
		var versionTask = DataVersionsService.GetNewVersionAsync(
			DataVersionNames.Expenses,
			cancellationToken
		);
		var saveTask = ExpensesService.SaveExpenseAsync(expense, cancellationToken);
		await Task.WhenAll(versionTask, saveTask);
		return await versionTask;
	}

	[HttpDelete("{name}")]
	public async Task<long> DeleteExpenseAsync(
		[FromRoute] string name,
		CancellationToken cancellationToken
	) {
		var versionTask = DataVersionsService.GetNewVersionAsync(
			DataVersionNames.Expenses,
			cancellationToken
		);
		var deleteTask = ExpensesService.DeleteExpenseAsync(name, cancellationToken);
		await Task.WhenAll(versionTask, deleteTask);
		return await versionTask;
	}

	[HttpGet("download")]
	public async Task<IActionResult> DownloadAsync(
		CancellationToken cancellationToken
	) {
		var expenses = await ExpensesService.ExportAsync(cancellationToken);
		return File(
			expenses,
			"text/csv",
			$"expenses_{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.csv"
		);
	}
}
