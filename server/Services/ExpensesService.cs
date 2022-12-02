using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Budget.Server.Models;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using CsvHelper;

namespace Budget.Server.Services {
	public interface IExpensesService {
		Task<IReadOnlyCollection<Expense>> GetExpensesAsync(CancellationToken cancellationToken);
		Task<Expense> GetExpenseAsync(string name, CancellationToken cancellationToken);
		Task SaveExpenseAsync(Expense expense, CancellationToken cancellationToken);
		Task DeleteExpenseAsync(string name, CancellationToken cancellationToken);
		Task<byte[]> ExportAsync(CancellationToken cancellationToken);
	}

	public class ExpensesService : IExpensesService {
		private DynamoDBContext Context { get; }

		public ExpensesService(DynamoDBContext context) {
			Context = context;
		}

		public async Task<IReadOnlyCollection<Expense>> GetExpensesAsync(CancellationToken cancellationToken) =>
			await Context
				.ScanAsync<Expense>(Enumerable.Empty<ScanCondition>())
				.GetRemainingAsync(cancellationToken);

		public async Task<Expense> GetExpenseAsync(string name, CancellationToken cancellationToken) =>
			await Context.LoadAsync(new Expense { Name = name }, cancellationToken);

		public async Task SaveExpenseAsync(Expense expense, CancellationToken cancellationToken) =>
			await Context.SaveAsync(expense, cancellationToken);

		public async Task DeleteExpenseAsync(string name, CancellationToken cancellationToken) =>
			await Context.DeleteAsync(new Expense { Name = name }, cancellationToken);

		public async Task<byte[]> ExportAsync(CancellationToken cancellationToken) {
			var pendingItems = await Context
				.ScanAsync<Expense>(new List<ScanCondition>())
				.GetRemainingAsync(cancellationToken);
			using var memoryStream = new MemoryStream();
			using var writer = new StreamWriter(memoryStream);
			using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
			csv.WriteRecords(pendingItems);
			writer.Flush();
			return memoryStream.ToArray();
		}
	}
}
