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
		private IIncomesService IncomesService { get; }
		private IPendingItemsService PendingItemsService { get; }

		public HomeController(
			IOptions<AppSettings> appSettingsAccessor,
			IExpensesService expensesService,
			IIncomesService incomesService,
			IPendingItemsService pendingItemsService
		) {
			AppSettings = appSettingsAccessor.Value;
			ExpensesService = expensesService;
			IncomesService = incomesService;
			PendingItemsService = pendingItemsService;
		}

		[HttpGet]
		public async Task<IActionResult> Index(
			CancellationToken cancellationToken
		) {
			var expensesVersionTask = ExpensesService.GetVersionAsync(cancellationToken);
			var incomesVersionTask = IncomesService.GetVersionAsync(cancellationToken);
			var pendingItemsVersionTask = PendingItemsService.GetVersionAsync(cancellationToken);
			await Task.WhenAll(
				expensesVersionTask,
				incomesVersionTask,
				pendingItemsVersionTask
			);
			var model = new IndexModel {
				BundleVersion = AppSettings.BundleVersion,
				ExpensesVersion = await expensesVersionTask,
				IncomesVersion = await incomesVersionTask,
				PendingItemsVersion = await pendingItemsVersionTask,
				ScriptChunks = AppSettings.ScriptChunks,
				StyleChunks = AppSettings.StyleChunks
			};
			return View(model);
		}
	}
}
