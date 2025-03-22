using System;
using System.Threading;
using System.Threading.Tasks;
using Budget.Server.Api.Models;
using Budget.Server.Models;
using Budget.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace Budget.Server.Api.Controllers;

[Route("api/pending-items")]
public class PendingItemsController : AuthorizedController
{
	private IPendingItemsService PendingItemsService { get; }
	private IDataVersionsService DataVersionsService { get; }

	public PendingItemsController(
		IPendingItemsService pendingItemsService,
		IDataVersionsService dataVersionsService
	)
	{
		PendingItemsService = pendingItemsService;
		DataVersionsService = dataVersionsService;
	}

	[HttpGet("version")]
	public async Task<long> GetVersionAsync(CancellationToken cancellationToken)
	{
		return await DataVersionsService.GetVersionAsync(
			DataVersionNames.PendingItems,
			cancellationToken
		);
	}

	[HttpGet]
	public async Task<GetPendingItemsResponse> GetPendingItemsAsync(
		CancellationToken cancellationToken
	)
	{
		var versionTask = DataVersionsService.GetVersionAsync(
			DataVersionNames.PendingItems,
			cancellationToken
		);
		var pendingItemsTask = PendingItemsService.GetPendingItemsAsync(
			cancellationToken
		);
		await Task.WhenAll(versionTask, pendingItemsTask);
		return new()
		{
			Version = await versionTask,
			PendingItems = await pendingItemsTask,
		};
	}

	[HttpGet("{id}")]
	public async Task<IActionResult> GetPendingItemAsync(
		[FromRoute] int id,
		CancellationToken cancellationToken
	)
	{
		var pendingItem = await PendingItemsService.GetPendingItemAsync(
			id,
			cancellationToken
		);
		if (pendingItem == null)
		{
			return NotFound();
		}
		return Ok(pendingItem);
	}

	[HttpPut]
	public async Task<long> PutPendingItemAsync(
		[FromBody] PendingItem pendingItem,
		CancellationToken cancellationToken
	)
	{
		var versionTask = DataVersionsService.GetNewVersionAsync(
			DataVersionNames.PendingItems,
			cancellationToken
		);
		var saveTask = PendingItemsService.SavePendingItemAsync(
			pendingItem,
			cancellationToken
		);
		await Task.WhenAll(versionTask, saveTask);
		return await versionTask;
	}

	[HttpDelete("{id}")]
	public async Task<long> DeletePendingItemAsync(
		[FromRoute] int id,
		CancellationToken cancellationToken
	)
	{
		var versionTask = DataVersionsService.GetNewVersionAsync(
			DataVersionNames.PendingItems,
			cancellationToken
		);
		var deleteTask = PendingItemsService.DeletePendingItemAsync(
			id,
			cancellationToken
		);
		await Task.WhenAll(versionTask, deleteTask);
		return await versionTask;
	}

	[HttpGet("download")]
	public async Task<IActionResult> DownloadAsync(
		CancellationToken cancellationToken
	)
	{
		var pendingItems = await PendingItemsService.ExportAsync(
			cancellationToken
		);
		return File(
			pendingItems,
			"text/csv",
			$"pending_items_{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.csv"
		);
	}
}
