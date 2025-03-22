using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using Budget.Server.Models;

namespace Budget.Server.Services;

public interface IDataVersionsService
{
	Task<long> GetVersionAsync(
		string name,
		CancellationToken cancellationToken
	);
	Task<IReadOnlyCollection<DataVersion>> GetVersionsAsync(
		string firstName,
		string lastName,
		CancellationToken cancellationToken
	);
	Task<long> GetNewVersionAsync(
		string name,
		CancellationToken cancellationToken
	);
}

public class DataVersionsService : IDataVersionsService
{
	private DynamoDBContext Context { get; }

	public DataVersionsService(DynamoDBContext context)
	{
		Context = context;
	}

	public async Task<long> GetVersionAsync(
		string name,
		CancellationToken cancellationToken
	)
	{
		var dataVersion = await Context.LoadAsync(
			new DataVersion { Name = name },
			cancellationToken
		);
		return dataVersion?.Version ?? 0;
	}

	public async Task<IReadOnlyCollection<DataVersion>> GetVersionsAsync(
		string firstName,
		string lastName,
		CancellationToken cancellationToken
	)
	{
		return await Context
			.ScanAsync<DataVersion>(
				new[]
				{
					new ScanCondition(
						"Name",
						ScanOperator.Between,
						firstName,
						lastName
					),
				}
			)
			.GetRemainingAsync();
	}

	public async Task<long> GetNewVersionAsync(
		string name,
		CancellationToken cancellationToken
	)
	{
		var newVersion = new DataVersion
		{
			Name = name,
			Version = DateTimeOffset.Now.ToUnixTimeMilliseconds(),
		};
		await Context.SaveAsync(newVersion, cancellationToken);
		return newVersion.Version;
	}
}
