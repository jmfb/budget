using System.Threading;
using System.Threading.Tasks;
using Budget.Server.Contracts.RequestContracts;
using Budget.Server.DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budget.Server.Controllers;

[Authorize]
[Route("incomes")]
public class IncomesController(IIncomeDataBridge dataBridge) : Controller
{
	[HttpGet]
	public async Task<IActionResult> GetAll(
		[FromQuery] int year,
		CancellationToken cancellationToken
	)
	{
		var incomes = await dataBridge.GetAllAsync(year, cancellationToken);
		return Ok(incomes);
	}

	[HttpGet("{id:int}")]
	public async Task<IActionResult> Get(
		[FromRoute] int id,
		CancellationToken cancellationToken
	)
	{
		var income = await dataBridge.GetAsync(id, cancellationToken);
		if (income == null)
			return NotFound();
		return Ok(income);
	}

	[HttpPost]
	public async Task<IActionResult> Create(
		[FromBody] CreateIncomeRequest request,
		CancellationToken cancellationToken
	)
	{
		if (request == null)
			return BadRequest("Body is required");
		var id = await dataBridge.CreateAsync(
			request.Year,
			request.Name,
			request.Amount,
			request.WeeksInterval,
			cancellationToken
		);
		return CreatedAtAction(nameof(Get), new { id }, id);
	}

	[HttpPut("{id:int}")]
	public async Task<IActionResult> Update(
		[FromRoute] int id,
		[FromBody] UpdateIncomeRequest request,
		CancellationToken cancellationToken
	)
	{
		if (request == null)
			return BadRequest("Body is required");
		var income = await dataBridge.GetAsync(id, cancellationToken);
		if (income == null)
			return NotFound();
		await dataBridge.UpdateAsync(
			id,
			request.Name,
			request.Amount,
			request.WeeksInterval,
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
		var income = await dataBridge.GetAsync(id, cancellationToken);
		if (income == null)
			return NotFound();
		await dataBridge.DeleteAsync(id, cancellationToken);
		return NoContent();
	}
}
