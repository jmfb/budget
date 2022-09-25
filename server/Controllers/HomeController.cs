using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Budget.Server.Models;
using Budget.Server.Services;

namespace Budget.Server.Controllers {
	public class HomeController : Controller {
		private AppSettings AppSettings { get; }
		private IExpensesService ExpensesService { get; }

		public HomeController(
			IOptions<AppSettings> appSettingsAccessor,
			IExpensesService expensesService
		) {
			AppSettings = appSettingsAccessor.Value;
			ExpensesService = expensesService;
		}

		[HttpGet]
		public async Task<IActionResult> Index(
			CancellationToken cancellationToken
		) {
			var expensesVersionTask = ExpensesService.GetVersionAsync(cancellationToken);
			await Task.WhenAll(expensesVersionTask);
			var model = new IndexModel {
				BundleVersion = AppSettings.BundleVersion,
				ExpensesVersion = await expensesVersionTask,
				ScriptChunks = AppSettings.ScriptChunks,
				StyleChunks = AppSettings.StyleChunks
			};
			return View(model);
		}
	}
}
