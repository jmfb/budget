using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Budget.Server.Models;
using Budget.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Budget.Server.Controllers;

public class HomeController : Controller
{
	private AppSettings AppSettings { get; }
	private IDataVersionsService DataVersionsService { get; }

	public HomeController(
		IOptions<AppSettings> appSettingsAccessor,
		IDataVersionsService dataVersionsService
	)
	{
		AppSettings = appSettingsAccessor.Value;
		DataVersionsService = dataVersionsService;
	}

	[HttpGet]
	public async Task<IActionResult> Index(CancellationToken cancellationToken)
	{
		var today = DateTime.Today;
		var startOfWeek = today.AddDays(-(int)today.DayOfWeek);
		const int weeksAgo = 53;
		var startOfXWeeksAgo = startOfWeek.AddDays(-7 * weeksAgo);
		var firstKey = DataVersionNames.TransactionsByWeek(
			startOfXWeeksAgo.ToString("yyyy-MM-dd")
		);
		var lastKey = DataVersionNames.TransactionsByWeek(
			startOfWeek.ToString("yyyy-MM-dd")
		);

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
		var weekVersionsTask = DataVersionsService.GetVersionsAsync(
			firstKey,
			lastKey,
			cancellationToken
		);

		await Task.WhenAll(
			expensesVersionTask,
			incomesVersionTask,
			pendingItemsVersionTask,
			weekVersionsTask
		);

		var weekDataVersions = (await weekVersionsTask).ToDictionary(
			version => version.Name,
			version => version.Version
		);
		var weekVersions = Enumerable
			.Range(0, weeksAgo + 1)
			.Select(index =>
				startOfXWeeksAgo.AddDays(7 * index).ToString("yyyy-MM-dd")
			)
			.ToDictionary(
				weekOf => weekOf,
				weekOf =>
					weekDataVersions.TryGetValue(
						DataVersionNames.TransactionsByWeek(weekOf),
						out var version
					)
						? version
						: 0
			);

		var model = new IndexModel
		{
			BundleVersion = AppSettings.BundleVersion,
			ExpensesVersion = await expensesVersionTask,
			IncomesVersion = await incomesVersionTask,
			PendingItemsVersion = await pendingItemsVersionTask,
			WeekVersions = weekVersions,
			ScriptChunks = AppSettings.ScriptChunks,
			StyleChunks = AppSettings.StyleChunks,
		};
		return View(model);
	}
}
