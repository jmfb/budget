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
