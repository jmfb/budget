using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Budget.Server.Contracts.DataContracts;
using Budget.Server.DAL.Bindings;
using Budget.Server.Options;
using Dapper;
using Microsoft.Extensions.Options;
using Npgsql;

namespace Budget.Server.DAL;

public interface IPendingItemDataBridge
{
	Task<IReadOnlyCollection<PendingItem>> GetAllAsync(
		CancellationToken cancellationToken
	);

	Task<PendingItem> GetAsync(int id, CancellationToken cancellationToken);

	Task<int> CreateAsync(
		string name,
		decimal amount,
		int? categoryId,
		int? expenseId,
		int? incomeId,
		CancellationToken cancellationToken
	);

	Task UpdateAsync(
		int id,
		string name,
		decimal amount,
		int? categoryId,
		int? expenseId,
		int? incomeId,
		CancellationToken cancellationToken
	);

	Task DeleteAsync(int id, CancellationToken cancellationToken);
}

public class PendingItemDataBridge(IOptions<DatabaseOptions> options)
	: IPendingItemDataBridge
{
	public async Task<IReadOnlyCollection<PendingItem>> GetAllAsync(
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(
			options.Value.ConnectionString
		);
		await connection.OpenAsync(cancellationToken);
		var result = await connection.QueryAsync<PendingItem>(
			new CommandDefinition(
				"budget.pending_items_s",
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
		return result.AsList();
	}

	public async Task<PendingItem> GetAsync(
		int id,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(
			options.Value.ConnectionString
		);
		await connection.OpenAsync(cancellationToken);
		return await connection.QuerySingleOrDefaultAsync<PendingItem>(
			new CommandDefinition(
				"budget.pending_item_s",
				new { p_id = id },
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
	}

	public async Task<int> CreateAsync(
		string name,
		decimal amount,
		int? categoryId,
		int? expenseId,
		int? incomeId,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(
			options.Value.ConnectionString
		);
		await connection.OpenAsync(cancellationToken);
		return await connection.QuerySingleAsync<int>(
			new CommandDefinition(
				"budget.pending_item_i",
				new
				{
					p_name = name,
					p_amount = MoneyParameter.Create(amount),
					p_category_id = categoryId,
					p_expense_id = expenseId,
					p_income_id = incomeId,
				},
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
	}

	public async Task UpdateAsync(
		int id,
		string name,
		decimal amount,
		int? categoryId,
		int? expenseId,
		int? incomeId,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(
			options.Value.ConnectionString
		);
		await connection.OpenAsync(cancellationToken);
		await connection.ExecuteAsync(
			new CommandDefinition(
				"budget.pending_item_u",
				new
				{
					p_id = id,
					p_name = name,
					p_amount = MoneyParameter.Create(amount),
					p_category_id = categoryId,
					p_expense_id = expenseId,
					p_income_id = incomeId,
				},
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
	}

	public async Task DeleteAsync(int id, CancellationToken cancellationToken)
	{
		await using var connection = new NpgsqlConnection(
			options.Value.ConnectionString
		);
		await connection.OpenAsync(cancellationToken);
		await connection.ExecuteAsync(
			new CommandDefinition(
				"budget.pending_item_d",
				new { p_id = id },
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
	}
}
