using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Budget.Server.Api.Models;
using Budget.Server.Models;
using Budget.Server.Services;

namespace Budget.Server.Api.Controllers {
	[Route("api/pending-items")]
	public class PendingItemsController : AuthorizedController {
		private IPendingItemsService PendingItemsService { get; }

		public PendingItemsController(IPendingItemsService pendingItemsService) {
			PendingItemsService = pendingItemsService;
		}

		[HttpGet("version")]
		public async Task<long> GetVersionAsync(
			CancellationToken cancellationToken
		) {
			return await PendingItemsService.GetVersionAsync(cancellationToken);
		}

		[HttpGet]
		public async Task<GetPendingItemsResponse> GetPendingItemsAsync(
			CancellationToken cancellationToken
		) {
			var versionTask = PendingItemsService.GetVersionAsync(cancellationToken);
			var pendingItemsTask = PendingItemsService.GetPendingItemsAsync(cancellationToken);
			await Task.WhenAll(versionTask, pendingItemsTask);
			return new() {
				Version = await versionTask,
				PendingItems = await pendingItemsTask
			};
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetPendingItemAsync(
			[FromRoute] int id,
			CancellationToken cancellationToken
		) {
			var pendingItem = await PendingItemsService.GetPendingItemAsync(id, cancellationToken);
			if (pendingItem == null) {
				return NotFound();
			}
			return Ok(pendingItem);
		}

		[HttpPut]
		public async Task<long> PutPendingItemAsync(
			[FromBody] PendingItem pendingItem,
			CancellationToken cancellationToken
		) {
			var versionTask = PendingItemsService.GetNewVersionAsync(cancellationToken);
			var saveTask = PendingItemsService.SavePendingItemAsync(pendingItem, cancellationToken);
			await Task.WhenAll(versionTask, saveTask);
			return await versionTask;
		}

		[HttpDelete("{id}")]
		public async Task<long> DeletePendingItemAsync(
			[FromRoute] int id,
			CancellationToken cancellationToken
		) {
			var versionTask = PendingItemsService.GetNewVersionAsync(cancellationToken);
			var deleteTask = PendingItemsService.DeletePendingItemAsync(id, cancellationToken);
			await Task.WhenAll(versionTask, deleteTask);
			return await versionTask;
		}
	}
}
