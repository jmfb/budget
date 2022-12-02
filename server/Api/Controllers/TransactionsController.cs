using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Budget.Server.Api.Models;
using Budget.Server.Models;
using Budget.Server.Services;

namespace Budget.Server.Api.Controllers {
	[Route("api/transactions")]
	public class TransactionsController : AuthorizedController {
		private ITransactionsService TransactionsService { get; }
		private IDataVersionsService DataVersionsService { get; }

		public TransactionsController(
			ITransactionsService transactionsService,
			IDataVersionsService dataVersionsService
		) {
			TransactionsService = transactionsService;
			DataVersionsService = dataVersionsService;
		}

		[HttpGet("week-of/{weekOf}/version")]
		public async Task<long> GetVersionByWeekAsync(
			[FromRoute] string weekOf,
			CancellationToken cancellationToken
		) {
			return await DataVersionsService.GetVersionAsync(
				DataVersionNames.TransactionsByWeek(weekOf),
				cancellationToken
			);
		}

		[HttpGet("week-of/{weekOf}")]
		public async Task<GetTransactionsResponse> GetTransactionsByWeekAsync(
			[FromRoute] string weekOf,
			CancellationToken cancellationToken
		) {
			var versionTask = DataVersionsService.GetVersionAsync(
				DataVersionNames.TransactionsByWeek(weekOf),
				cancellationToken
			);
			var transactionsTask = TransactionsService.GetTransactionsByWeekAsync(
				weekOf,
				cancellationToken
			);
			await Task.WhenAll(versionTask, transactionsTask);
			return new() {
				Version = await versionTask,
				WeekOf = weekOf,
				Transactions = await transactionsTask
			};
		}

		[HttpPut]
		public async Task<long> PutTransactionAsync(
			[FromBody] Transaction transaction,
			CancellationToken cancellationToken
		) {
			var weekOf = TransactionsService.GetStartOfWeek(transaction.Date);
			var versionTask = DataVersionsService.GetNewVersionAsync(
				DataVersionNames.TransactionsByWeek(weekOf),
				cancellationToken
			);
			var saveTask = TransactionsService.SaveTransactionAsync(transaction, cancellationToken);
			await Task.WhenAll(versionTask, saveTask);
			return await versionTask;
		}

		[HttpDelete("{date}/{id}")]
		public async Task<long> DeleteTransactionAsync(
			[FromRoute] string date,
			[FromRoute] int id,
			CancellationToken cancellationToken
		) {
			var weekOf = TransactionsService.GetStartOfWeek(date);
			var versionTask = DataVersionsService.GetNewVersionAsync(
				DataVersionNames.TransactionsByWeek(weekOf),
				cancellationToken
			);
			var deleteTask = TransactionsService.DeleteTransactionAsync(date, id, cancellationToken);
			await Task.WhenAll(versionTask, deleteTask);
			return await versionTask;
		}

		[HttpGet("download")]
		public async Task<IActionResult> DownloadAsync(
			CancellationToken cancellationToken
		) {
			var transactions = await TransactionsService.ExportAsync(cancellationToken);
			return File(
				transactions,
				"text/csv",
				$"trasnactions_{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.csv"
			);
		}
	}
}
