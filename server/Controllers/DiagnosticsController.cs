using System.Threading;
using System.Threading.Tasks;
using Budget.Server.DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budget.Server.Controllers;

[Route("diagnostics")]
public class DiagnosticsController(IDiagnosticDataBridge dataBridge)
	: Controller
{
	[HttpGet("ping")]
	public IActionResult Ping() => Ok("pong");

	[Authorize]
	[HttpGet("database")]
	public async Task<IActionResult> GetDatabaseDiagnosticsAsync(
		CancellationToken cancellationToken
	)
	{
		var diagnostics = await dataBridge.GetAsync(cancellationToken);
		return Ok(diagnostics);
	}
}
