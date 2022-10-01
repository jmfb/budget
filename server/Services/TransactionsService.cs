using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Budget.Server.Models;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;

namespace Budget.Server.Services {
	public interface ITransactionsService {
		Task<IReadOnlyCollection<Transaction>> GetTransactionsByWeekAsync(string weekOf, CancellationToken cancellationToken);
		Task<Transaction> GetTransactionAsync(string date, int id, CancellationToken cancellationToken);
		Task SaveTransactionAsync(Transaction transaction, CancellationToken cancellationToken);
		Task DeleteTransactionAsync(string date, int id, CancellationToken cancellationToken);
	}

	public class TransactionsService : ITransactionsService {
		private DynamoDBContext Context { get; }

		public TransactionsService(DynamoDBContext context) {
			Context = context;
		}

		private async Task<IReadOnlyCollection<Transaction>> GetTransactionsByDateAsync(
			string date,
			CancellationToken cancellationToken) =>
			await Context
				.QueryAsync<Transaction>(date)
				.GetRemainingAsync(cancellationToken);

		public async Task<IReadOnlyCollection<Transaction>> GetTransactionsByWeekAsync(
			string weekOf,
			CancellationToken cancellationToken) =>
			(await Task
				.WhenAll(Enumerable
					.Range(0, 7)
					.Select(index => DateTime.Parse(weekOf).AddDays(index).ToString("yyyy-MM-dd"))
					.Select(date => GetTransactionsByDateAsync(date, cancellationToken))))
				.SelectMany(transactions => transactions)
				.OrderBy(transaction => transaction.Date)
				.ThenBy(transaction => transaction.Id)
				.ToList();

		public async Task<Transaction> GetTransactionAsync(string date, int id, CancellationToken cancellationToken) =>
			await Context.LoadAsync(new Transaction { Date = date, Id = id }, cancellationToken);

		public async Task SaveTransactionAsync(Transaction transaction, CancellationToken cancellationToken) =>
			await Context.SaveAsync(transaction, cancellationToken);

		public async Task DeleteTransactionAsync(string date, int id, CancellationToken cancellationToken) =>
			await Context.DeleteAsync(new Transaction { Date = date, Id = id }, cancellationToken);
	}
}