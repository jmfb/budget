using System.Threading;
using System.Threading.Tasks;
using Budget.Server.Contracts.RequestContracts;
using Budget.Server.DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budget.Server.Controllers;

[Authorize]
[Route("pending-items")]
public class PendingItemsController(IPendingItemDataBridge dataBridge)
	: Controller
{
	[HttpGet]
	public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
	{
		var pendingItems = await dataBridge.GetAllAsync(cancellationToken);
		return Ok(pendingItems);
	}

	[HttpGet("{id:int}")]
	public async Task<IActionResult> Get(
		[FromRoute] int id,
		CancellationToken cancellationToken
	)
	{
		var pendingItem = await dataBridge.GetAsync(id, cancellationToken);
		if (pendingItem == null)
			return NotFound();
		return Ok(pendingItem);
	}

	[HttpPost]
	public async Task<IActionResult> Create(
		[FromBody] CreatePendingItemRequest request,
		CancellationToken cancellationToken
	)
	{
		if (request == null)
			return BadRequest("Body is required");
		var id = await dataBridge.CreateAsync(
			request.Name,
			request.Amount,
			request.CategoryId,
			request.ExpenseId,
			request.IncomeId,
			cancellationToken
		);
		return CreatedAtAction(nameof(Get), new { id }, id);
	}

	[HttpPut("{id:int}")]
	public async Task<IActionResult> Update(
		[FromRoute] int id,
		[FromBody] UpdatePendingItemRequest request,
		CancellationToken cancellationToken
	)
	{
		if (request == null)
			return BadRequest("Body is required");
		var pendingItem = await dataBridge.GetAsync(id, cancellationToken);
		if (pendingItem == null)
			return NotFound();
		await dataBridge.UpdateAsync(
			id,
			request.Name,
			request.Amount,
			request.CategoryId,
			request.ExpenseId,
			request.IncomeId,
			cancellationToken
		);
		return NoContent();
	}

	[HttpDelete("{id:int}")]
	public async Task<IActionResult> Delete(
		[FromRoute] int id,
		CancellationToken cancellationToken
	)
	{
		var pendingItem = await dataBridge.GetAsync(id, cancellationToken);
		if (pendingItem == null)
			return NotFound();
		await dataBridge.DeleteAsync(id, cancellationToken);
		return NoContent();
	}
}
