using System.Threading;
using System.Threading.Tasks;
using Budget.Server.Contracts.RequestContracts;
using Budget.Server.DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budget.Server.Controllers;

[Authorize]
[Route("expenses")]
public class ExpensesController(IExpenseDataBridge dataBridge) : Controller
{
	[HttpGet]
	public async Task<IActionResult> GetAllAsync(
		[FromQuery] int year,
		CancellationToken cancellationToken
	)
	{
		var expenses = await dataBridge.GetAllAsync(year, cancellationToken);
		return Ok(expenses);
	}

	[HttpGet("{id:int}")]
	public async Task<IActionResult> GetAsync(
		[FromRoute] int id,
		CancellationToken cancellationToken
	)
	{
		var expense = await dataBridge.GetAsync(id, cancellationToken);
		if (expense == null)
			return NotFound();
		return Ok(expense);
	}

	[HttpPost]
	public async Task<IActionResult> CreateAsync(
		[FromBody] CreateExpenseRequest request,
		CancellationToken cancellationToken
	)
	{
		if (request == null)
			return BadRequest("Body is required");
		var id = await dataBridge.CreateAsync(
			request.Year,
			request.Name,
			request.Amount,
			request.CategoryId,
			request.MonthsInterval,
			request.IsDistributed,
			cancellationToken
		);
		return CreatedAtAction(nameof(GetAsync), new { id }, id);
	}

	[HttpPut("{id:int}")]
	public async Task<IActionResult> UpdateAsync(
		[FromRoute] int id,
		[FromBody] UpdateExpenseRequest request,
		CancellationToken cancellationToken
	)
	{
		if (request == null)
			return BadRequest("Body is required");
		var expense = await dataBridge.GetAsync(id, cancellationToken);
		if (expense == null)
			return NotFound();
		await dataBridge.UpdateAsync(
			id,
			request.Name,
			request.Amount,
			request.CategoryId,
			request.MonthsInterval,
			request.IsDistributed,
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
		var expense = await dataBridge.GetAsync(id, cancellationToken);
		if (expense == null)
			return NotFound();
		await dataBridge.DeleteAsync(id, cancellationToken);
		return NoContent();
	}
}
