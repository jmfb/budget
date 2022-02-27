using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Budget.Server.Models;
using Budget.Server.Api.Models;

namespace Budget.Server.Api.Controllers {
	[Route("api/diagnostics")]
	public class DiagnosticsController : AuthorizedController {
		private AppSettings AppSettings { get; }

		public DiagnosticsController(IOptions<AppSettings> appSettingsAccessor) {
			AppSettings = appSettingsAccessor.Value;
		}

		[HttpGet("heartbeat")]
		public HeartbeatModel Heartbeat() => new HeartbeatModel {
			BundleVersion = AppSettings.BundleVersion
		};
	}
}
