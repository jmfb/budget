using System;
using System.Threading;
using System.Threading.Tasks;
using Budget.Server.Contracts.RequestContracts;
using Budget.Server.Contracts.ResponseContracts;
using Budget.Server.DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budget.Server.Controllers;

[Authorize]
[Route("transactions")]
public class TransactionsController(ITransactionDataBridge dataBridge)
	: Controller
{
	[HttpGet]
	public async Task<IActionResult> GetAllAsync(
		[FromQuery] DateOnly startDateInclusive,
		[FromQuery] DateOnly endDateExclusive,
		[FromQuery] int? pageSize,
		[FromQuery] string pageKey,
		CancellationToken cancellationToken
	)
	{
		if (endDateExclusive <= startDateInclusive)
			return BadRequest("End date must be after start date");
		var take = pageSize ?? 100;
		if (take < 1)
			return BadRequest("Page size must be positive");
		var skip = int.TryParse(pageKey, out var parsedPageKey)
			? parsedPageKey
			: 0;
		if (skip < 0)
			return BadRequest("Invalid page key");
		var transactions = await dataBridge.GetAllAsync(
			startDateInclusive,
			endDateExclusive,
			skip,
			take,
			cancellationToken
		);
		var response = new GetTransactionsResponse
		{
			Transactions = transactions,
			NextPageKey = transactions.Count == take ? $"{skip + take}" : null,
		};
		return Ok(response);
	}

	[HttpGet("{id:int}")]
	public async Task<IActionResult> GetAsync(
		[FromRoute] int id,
		CancellationToken cancellationToken
	)
	{
		var transaction = await dataBridge.GetAsync(id, cancellationToken);
		if (transaction == null)
			return NotFound();
		return Ok(transaction);
	}

	[HttpPost]
	public async Task<IActionResult> CreateAsync(
		[FromBody] CreateTransactionRequest request,
		CancellationToken cancellationToken
	)
	{
		if (request == null)
			return BadRequest("Body is required");
		var id = await dataBridge.CreateAsync(
			request.Date,
			request.SourceId,
			request.RawText,
			request.Amount,
			request.OriginalCategory,
			request.CategoryId,
			request.Note,
			request.ExpenseId,
			request.IncomeId,
			cancellationToken
		);
		return CreatedAtAction(nameof(GetAsync), new { id }, id);
	}

	[HttpPut("{id:int}")]
	public async Task<IActionResult> UpdateAsync(
		[FromRoute] int id,
		[FromBody] UpdateTransactionRequest request,
		CancellationToken cancellationToken
	)
	{
		if (request == null)
			return BadRequest("Body is required");
		var transaction = await dataBridge.GetAsync(id, cancellationToken);
		if (transaction == null)
			return NotFound();
		await dataBridge.UpdateAsync(
			id,
			request.Date,
			request.SourceId,
			request.RawText,
			request.Amount,
			request.OriginalCategory,
			request.CategoryId,
			request.Note,
			request.ExpenseId,
			request.IncomeId,
			cancellationToken
		);
		return NoContent();
	}

	[HttpDelete("{id:int}")]
	public async Task<IActionResult> DeleteAsync(
		[FromRoute] int id,
		CancellationToken cancellationToken
	)
	{
		var transaction = await dataBridge.GetAsync(id, cancellationToken);
		if (transaction == null)
			return NotFound();
		await dataBridge.DeleteAsync(id, cancellationToken);
		return NoContent();
	}
}
