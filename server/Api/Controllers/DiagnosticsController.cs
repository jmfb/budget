using Budget.Server.Api.Models;
using Budget.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Budget.Server.Api.Controllers;

[Authorize]
[Route("api/diagnostics")]
public class DiagnosticsController : Controller
{
	private AppSettings AppSettings { get; }

	public DiagnosticsController(IOptions<AppSettings> appSettingsAccessor)
	{
		AppSettings = appSettingsAccessor.Value;
	}

	[HttpGet("heartbeat")]
	public HeartbeatModel Heartbeat() =>
		new HeartbeatModel { BundleVersion = AppSettings.BundleVersion };
}
