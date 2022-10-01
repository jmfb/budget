using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Budget.Server.Api.Models;
using Budget.Server.Models;
using Budget.Server.Services;

namespace Budget.Server.Api.Controllers {
	[Route("api/incomes")]
	public class IncomesController : AuthorizedController {
		private IIncomesService IncomesService { get; }
		private IDataVersionsService DataVersionsService { get; }

		public IncomesController(
			IIncomesService incomesService,
			IDataVersionsService dataVersionsService
		) {
			IncomesService = incomesService;
			DataVersionsService = dataVersionsService;
		}

		[HttpGet("version")]
		public async Task<long> GetVersionAsync(
			CancellationToken cancellationToken
		) {
			return await DataVersionsService.GetVersionAsync(
				DataVersionNames.Incomes,
				cancellationToken
			);
		}

		[HttpGet]
		public async Task<GetIncomesResponse> GetIncomesAsync(
			CancellationToken cancellationToken
		) {
			var versionTask = DataVersionsService.GetVersionAsync(
				DataVersionNames.Incomes,
				cancellationToken
			);
			var incomesTask = IncomesService.GetIncomesAsync(cancellationToken);
			await Task.WhenAll(versionTask, incomesTask);
			return new() {
				Version = await versionTask,
				Incomes = await incomesTask
			};
		}

		[HttpGet("{name}")]
		public async Task<IActionResult> GetIncomeAsync(
			[FromRoute] string name,
			CancellationToken cancellationToken
		) {
			var income = await IncomesService.GetIncomeAsync(name, cancellationToken);
			if (income == null) {
				return NotFound();
			}
			return Ok(income);
		}

		[HttpPut]
		public async Task<long> PutIncomeAsync(
			[FromBody] Income income,
			CancellationToken cancellationToken
		) {
			var versionTask = DataVersionsService.GetNewVersionAsync(
				DataVersionNames.Incomes,
				cancellationToken
			);
			var saveTask = IncomesService.SaveIncomeAsync(income, cancellationToken);
			await Task.WhenAll(versionTask, saveTask);
			return await versionTask;
		}

		[HttpDelete("{name}")]
		public async Task<long> DeleteIncomeAsync(
			[FromRoute] string name,
			CancellationToken cancellationToken
		) {
			var versionTask = DataVersionsService.GetNewVersionAsync(
				DataVersionNames.Incomes,
				cancellationToken
			);
			var deleteTask = IncomesService.DeleteIncomeAsync(name, cancellationToken);
			await Task.WhenAll(versionTask, deleteTask);
			return await versionTask;
		}
	}
}
