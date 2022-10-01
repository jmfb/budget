using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Budget.Server.Models;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;

namespace Budget.Server.Services {
	public interface IIncomesService {
		Task<long> GetVersionAsync(CancellationToken cancellationToken);
		Task<long> GetNewVersionAsync(CancellationToken cancellationToken);
		Task<IReadOnlyCollection<Income>> GetIncomesAsync(CancellationToken cancellationToken);
		Task<Income> GetIncomeAsync(string name, CancellationToken cancellationToken);
		Task SaveIncomeAsync(Income income, CancellationToken cancellationToken);
		Task DeleteIncomeAsync(string name, CancellationToken cancellationToken);
	}

	public class IncomesService : IIncomesService {
		private DynamoDBContext Context { get; }

		public IncomesService(DynamoDBContext context) {
			Context = context;
		}

		private const string versionName = "incomes";

		public async Task<long> GetVersionAsync(CancellationToken cancellationToken) {
			var dataVersion = await Context.LoadAsync(new DataVersion { Name = versionName }, cancellationToken);
			return dataVersion?.Version ?? 0;
		}

		public async Task<long> GetNewVersionAsync(CancellationToken cancellationToken) {
			var newVersion = new DataVersion {
				Name = versionName,
				Version = DateTimeOffset.Now.ToUnixTimeMilliseconds()
			};
			await Context.SaveAsync(newVersion, cancellationToken);
			return newVersion.Version;
		}

		public async Task<IReadOnlyCollection<Income>> GetIncomesAsync(CancellationToken cancellationToken) =>
			await Context
				.ScanAsync<Income>(Enumerable.Empty<ScanCondition>())
				.GetRemainingAsync(cancellationToken);

		public async Task<Income> GetIncomeAsync(string name, CancellationToken cancellationToken) =>
			await Context.LoadAsync(new Income { Name = name }, cancellationToken);

		public async Task SaveIncomeAsync(Income income, CancellationToken cancellationToken) =>
			await Context.SaveAsync(income, cancellationToken);

		public async Task DeleteIncomeAsync(string name, CancellationToken cancellationToken) =>
			await Context.DeleteAsync(new Income { Name = name }, cancellationToken);
	}
}
