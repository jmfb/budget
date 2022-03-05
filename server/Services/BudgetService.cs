using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Budget.Server.Models;
using Amazon.DynamoDBv2.DataModel;

namespace Budget.Server.Services {
	public interface IBudgetService {
		Task SaveIncomeAsync(Income income, CancellationToken cancellationToken);
		Task DeleteIncomeAsync(string name, CancellationToken cancellationToken);
		Task SaveExpenseAsync(Expense expense, CancellationToken cancellationToken);
		Task DeleteExpenseAsync(string name, CancellationToken cancellationToken);
		Task SaveTransactionAsync(Transaction transaction, CancellationToken cancellationToken);
		Task DeleteTransactionAsync(string date, int id, CancellationToken cancellationToken);
		Task<IReadOnlyCollection<Income>> LoadAllIncomesAsync(CancellationToken cancellationToken);
		Task<IReadOnlyCollection<Expense>> LoadAllExpensesAsync(CancellationToken cancellationToken);
		Task<IReadOnlyCollection<Transaction>> LoadWeeklyTransactionsAsync(
			string weekOf,
			CancellationToken cancellationToken);
	}

	public class BudgetService : IBudgetService {
		private DynamoDBContext Context { get; }

		public BudgetService(DynamoDBContext context) {
			Context = context;
		}

		public async Task SaveIncomeAsync(Income income, CancellationToken cancellationToken) =>
			await Context.SaveAsync(income, cancellationToken);

		public async Task DeleteIncomeAsync(string name, CancellationToken cancellationToken) =>
			await Context.DeleteAsync(new Income { Name = name }, cancellationToken);

		public async Task SaveExpenseAsync(Expense expense, CancellationToken cancellationToken) =>
			await Context.SaveAsync(expense, cancellationToken);

		public async Task DeleteExpenseAsync(string name, CancellationToken cancellationToken) =>
			await Context.DeleteAsync(new Expense { Name = name }, cancellationToken);

		public async Task SaveTransactionAsync(Transaction transaction, CancellationToken cancellationToken) =>
			await Context.SaveAsync(transaction, cancellationToken);

		public async Task DeleteTransactionAsync(string date, int id, CancellationToken cancellationToken) =>
			await Context.DeleteAsync(new Transaction { Date = date, Id = id }, cancellationToken);

		public async Task<IReadOnlyCollection<Income>> LoadAllIncomesAsync(CancellationToken cancellationToken) =>
			await Context
				.ScanAsync<Income>(Enumerable.Empty<ScanCondition>())
				.GetRemainingAsync(cancellationToken);

		public async Task<IReadOnlyCollection<Expense>> LoadAllExpensesAsync(CancellationToken cancellationToken) =>
			await Context
				.ScanAsync<Expense>(Enumerable.Empty<ScanCondition>())
				.GetRemainingAsync(cancellationToken);

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
	}
}
