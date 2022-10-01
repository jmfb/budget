using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Budget.Server.Models;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;

namespace Budget.Server.Services {
	public interface IPendingItemsService {
		Task<IReadOnlyCollection<PendingItem>> GetPendingItemsAsync(CancellationToken cancellationToken);
		Task<PendingItem> GetPendingItemAsync(int id, CancellationToken cancellationToken);
		Task SavePendingItemAsync(PendingItem pendingItem, CancellationToken cancellationToken);
		Task DeletePendingItemAsync(int id, CancellationToken cancellationToken);
	}

	public class PendingItemsService : IPendingItemsService {
		private DynamoDBContext Context { get; }

		public PendingItemsService(DynamoDBContext context) {
			Context = context;
		}

		public async Task<IReadOnlyCollection<PendingItem>> GetPendingItemsAsync(CancellationToken cancellationToken) =>
			await Context
				.ScanAsync<PendingItem>(Enumerable.Empty<ScanCondition>())
				.GetRemainingAsync(cancellationToken);

		public async Task<PendingItem> GetPendingItemAsync(int id, CancellationToken cancellationToken) =>
			await Context.LoadAsync(new PendingItem { Id = id }, cancellationToken);

		public async Task SavePendingItemAsync(PendingItem pendingItem, CancellationToken cancellationToken) =>
			await Context.SaveAsync(pendingItem, cancellationToken);

		public async Task DeletePendingItemAsync(int id, CancellationToken cancellationToken) =>
			await Context.DeleteAsync(new PendingItem { Id = id }, cancellationToken);
	}
}
