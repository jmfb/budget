using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Budget.Server.Models;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;

namespace Budget.Server.Services {
	public interface IBudgetService {
		Task SaveTransactionAsync(Transaction transaction, CancellationToken cancellationToken);
		Task DeleteTransactionAsync(string date, int id, CancellationToken cancellationToken);
		Task<IReadOnlyCollection<Transaction>> LoadWeeklyTransactionsAsync(
			string weekOf,
			CancellationToken cancellationToken);
		Task<IReadOnlyDictionary<string, decimal>> GetYearlyExpenseTotals(
			string priorToWeekOf,
			CancellationToken cancellationToken);
		Task<IReadOnlyCollection<Transaction>> GetYearlyExpenses(
			string expense,
			int year,
			CancellationToken CancellationToken);
	}

	public class BudgetService : IBudgetService {
		private DynamoDBContext Context { get; }

		public BudgetService(DynamoDBContext context) {
			Context = context;
		}

		public async Task SaveTransactionAsync(Transaction transaction, CancellationToken cancellationToken) =>
			await Context.SaveAsync(transaction, cancellationToken);

		public async Task DeleteTransactionAsync(string date, int id, CancellationToken cancellationToken) =>
			await Context.DeleteAsync(new Transaction { Date = date, Id = id }, cancellationToken);

		public async Task<IReadOnlyCollection<Transaction>> LoadTransactionsAsync(
			string date,
			CancellationToken cancellationToken) =>
			await Context
				.QueryAsync<Transaction>(date)
				.GetRemainingAsync(cancellationToken);

		public async Task<IReadOnlyCollection<Transaction>> LoadWeeklyTransactionsAsync(
			string weekOf,
			CancellationToken cancellationToken) =>
				(await Task
					.WhenAll(Enumerable
						.Range(0, 7)
						.Select(index => DateTime.Parse(weekOf).AddDays(index).ToString("yyyy-MM-dd"))
						.Select(date => LoadTransactionsAsync(date, cancellationToken))))
					.SelectMany(transactions => transactions)
					.OrderBy(transaction => transaction.Date)
					.ThenBy(transaction => transaction.Id)
					.ToList();

		public async Task<IReadOnlyDictionary<string, decimal>> GetYearlyExpenseTotals(
			string priorToWeekOf,
			CancellationToken cancellationToken
		) {
			var date = DateTime.Parse(priorToWeekOf);
			if (date.Month == 1 && date.Day == 1) {
				return new Dictionary<string, decimal>();
			}

			var endOfPriorWeek = date.AddDays(-1).ToString("yyyy-MM-dd");
			var startOfYear = new DateTime(date.Year, 1, 1).ToString("yyyy-MM-dd");

			var transactions = await Context
				.ScanAsync<Transaction>(new[] {
					new ScanCondition("Date", ScanOperator.Between, startOfYear, endOfPriorWeek)
				})
				.GetRemainingAsync();
			return transactions
				.Where(transaction => !string.IsNullOrWhiteSpace(transaction.ExpenseName))
				.GroupBy(transaction => transaction.ExpenseName)
				.ToDictionary(
					grouping => grouping.Key,
					grouping => grouping.Select(transaction => transaction.Amount).Sum());
		}

		public async Task<IReadOnlyCollection<Transaction>> GetYearlyExpenses(
			string expense,
			int year,
			CancellationToken CancellationToken
		) {
			var startOfYear = new DateTime(year, 1, 1).ToString("yyyy-MM-dd");
			var endOfYear = new DateTime(year, 12, 31).ToString("yyyy-MM-dd");
			return await Context
				.ScanAsync<Transaction>(new[] {
					new ScanCondition("Date", ScanOperator.Between, startOfYear, endOfYear),
					new ScanCondition("ExpenseName", ScanOperator.Equal, expense)
				})
				.GetRemainingAsync();
		}
	}
}
