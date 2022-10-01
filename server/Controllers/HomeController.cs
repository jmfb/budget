using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Budget.Server.Models;
using Budget.Server.Services;

namespace Budget.Server.Controllers {
	public class HomeController : Controller {
		private AppSettings AppSettings { get; }
		private IDataVersionsService DataVersionsService { get; }

		public HomeController(
			IOptions<AppSettings> appSettingsAccessor,
			IDataVersionsService dataVersionsService
		) {
			AppSettings = appSettingsAccessor.Value;
			DataVersionsService = dataVersionsService;
		}

		[HttpGet]
		public async Task<IActionResult> Index(
			CancellationToken cancellationToken
		) {
			var expensesVersionTask = DataVersionsService.GetVersionAsync(
				DataVersionNames.Expenses,
				cancellationToken
			);
			var incomesVersionTask = DataVersionsService.GetVersionAsync(
				DataVersionNames.Incomes,
				cancellationToken
			);
			var pendingItemsVersionTask = DataVersionsService.GetVersionAsync(
				DataVersionNames.PendingItems,
				cancellationToken
			);
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
