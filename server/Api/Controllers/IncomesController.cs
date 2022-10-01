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

		public IncomesController(IIncomesService incomesService) {
			IncomesService = incomesService;
		}

		[HttpGet("version")]
		public async Task<long> GetVersionAsync(
			CancellationToken cancellationToken
		) {
			return await IncomesService.GetVersionAsync(cancellationToken);
		}

		[HttpGet]
		public async Task<GetIncomesResponse> GetIncomesAsync(
			CancellationToken cancellationToken
		) {
			var versionTask = IncomesService.GetVersionAsync(cancellationToken);
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
			var versionTask = IncomesService.GetNewVersionAsync(cancellationToken);
			var saveTask = IncomesService.SaveIncomeAsync(income, cancellationToken);
			await Task.WhenAll(versionTask, saveTask);
			return await versionTask;
		}

		[HttpDelete("{name}")]
		public async Task<long> DeleteIncomeAsync(
			[FromRoute] string name,
			CancellationToken cancellationToken
		) {
			var versionTask = IncomesService.GetNewVersionAsync(cancellationToken);
			var deleteTask = IncomesService.DeleteIncomeAsync(name, cancellationToken);
			await Task.WhenAll(versionTask, deleteTask);
			return await versionTask;
		}
	}
}
