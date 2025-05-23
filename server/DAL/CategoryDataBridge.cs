using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Budget.Server.Contracts.DataContracts;
using Budget.Server.Models;
using Budget.Server.Options;
using Dapper;
using Microsoft.Extensions.Options;
using Npgsql;

namespace Budget.Server.DAL;

public interface ICategoryDataBridge
{
	Task<IReadOnlyCollection<Category>> GetAllAsync(
		CancellationToken cancellationToken
	);

	Task<Category> GetAsync(int id, CancellationToken cancellationToken);

	Task<int> CreateAsync(string name, CancellationToken cancellationToken);

	Task UpdateAsync(int id, string name, CancellationToken cancellationToken);

	Task DeleteAsync(int id, CancellationToken cancellationToken);

	Task RetireAsync(
		int retireId,
		int replacementId,
		CancellationToken cancellationToken
	);
}

public class CategoryDataBridge(
	IOptions<DatabaseOptions> options,
	Secrets secrets
) : BaseDataBridge(options.Value, secrets), ICategoryDataBridge
{
	public async Task<IReadOnlyCollection<Category>> GetAllAsync(
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		var result = await connection.QueryAsync<Category>(
			new CommandDefinition(
				"budget.categories_s",
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
		return result.AsList();
	}

	public async Task<Category> GetAsync(
		int id,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		return await connection.QuerySingleOrDefaultAsync<Category>(
			new CommandDefinition(
				"budget.category_s",
				new { p_id = id },
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
	}

	public async Task<int> CreateAsync(
		string name,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		return await connection.QuerySingleAsync<int>(
			new CommandDefinition(
				"budget.category_i",
				new { p_name = name },
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
	}

	public async Task UpdateAsync(
		int id,
		string name,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		await connection.ExecuteAsync(
			new CommandDefinition(
				"budget.category_u",
				new { p_id = id, p_name = name },
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
	}

	public async Task DeleteAsync(int id, CancellationToken cancellationToken)
	{
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		await connection.ExecuteAsync(
			new CommandDefinition(
				"budget.category_d",
				new { p_id = id },
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
	}

	public async Task RetireAsync(
		int retireId,
		int replacementId,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		await connection.ExecuteAsync(
			new CommandDefinition(
				"budget.category_retire",
				new
				{
					p_retire_id = retireId,
					p_replacement_id = replacementId,
				},
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
	}
}
