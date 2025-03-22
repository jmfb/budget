using System.Threading;
using System.Threading.Tasks;
using Budget.Server.Contracts.RequestContracts;
using Budget.Server.DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budget.Server.Controllers;

[Authorize]
[Route("categories")]
public class CategoriesController(ICategoryDataBridge dataBridge) : Controller
{
	[HttpGet]
	public async Task<IActionResult> GetAllAsync(
		CancellationToken cancellationToken
	)
	{
		var categories = await dataBridge.GetAllAsync(cancellationToken);
		return Ok(categories);
	}

	[HttpGet("{id:int}")]
	public async Task<IActionResult> GetAsync(
		[FromRoute] int id,
		CancellationToken cancellationToken
	)
	{
		var category = await dataBridge.GetAsync(id, cancellationToken);
		if (category == null)
			return NotFound();
		return Ok(category);
	}

	[HttpPost]
	public async Task<IActionResult> CreateAsync(
		[FromBody] CreateCategoryRequest request,
		CancellationToken cancellationToken
	)
	{
		if (request == null)
			return BadRequest("Body is required");
		var id = await dataBridge.CreateAsync(request.Name, cancellationToken);
		return CreatedAtAction(nameof(GetAsync), new { id }, id);
	}

	[HttpPut("{id:int}")]
	public async Task<IActionResult> UpdateAsync(
		[FromRoute] int id,
		[FromBody] UpdateCategoryRequest request,
		CancellationToken cancellationToken
	)
	{
		if (request == null)
			return BadRequest("Body is required");
		var category = await dataBridge.GetAsync(id, cancellationToken);
		if (category == null)
			return NotFound();
		await dataBridge.UpdateAsync(id, request.Name, cancellationToken);
		return NoContent();
	}

	[HttpDelete("{id:int}")]
	public async Task<IActionResult> DeleteAsync(
		[FromRoute] int id,
		CancellationToken cancellationToken
	)
	{
		var category = await dataBridge.GetAsync(id, cancellationToken);
		if (category == null)
			return NotFound();
		await dataBridge.DeleteAsync(id, cancellationToken);
		return NoContent();
	}

	[HttpPost("commands/retire")]
	public async Task<IActionResult> RetireAsync(
		[FromBody] RetireCategoryRequest request,
		CancellationToken cancellationToken
	)
	{
		if (request == null)
			return BadRequest("Body is required");
		var retireCategory = await dataBridge.GetAsync(
			request.RetireId,
			cancellationToken
		);
		if (retireCategory == null)
			return BadRequest("Category to retire does not exist");
		var replacementCategory = await dataBridge.GetAsync(
			request.ReplacementId,
			cancellationToken
		);
		if (replacementCategory == null)
			return BadRequest("Replacement category does not exist");
		await dataBridge.RetireAsync(
			request.RetireId,
			request.ReplacementId,
			cancellationToken
		);
		return NoContent();
	}
}
