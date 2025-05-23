using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Budget.Server.Contracts.DataContracts;
using Budget.Server.DAL.Bindings;
using Budget.Server.Models;
using Budget.Server.Options;
using Dapper;
using Microsoft.Extensions.Options;
using Npgsql;

namespace Budget.Server.DAL;

public interface IExpenseDataBridge
{
	Task<IReadOnlyCollection<Expense>> GetAllAsync(
		int year,
		CancellationToken cancellationToken
	);

	Task<Expense> GetAsync(int id, CancellationToken cancellationToken);

	Task<int> CreateAsync(
		int year,
		string name,
		decimal amount,
		int categoryId,
		int monthsInterval,
		bool isDistributed,
		CancellationToken cancellationToken
	);

	Task UpdateAsync(
		int id,
		string name,
		decimal amount,
		int categoryId,
		int monthsInterval,
		bool isDistributed,
		CancellationToken cancellationToken
	);

	Task DeleteAsync(int id, CancellationToken cancellationToken);
}

public class ExpenseDataBridge(
	IOptions<DatabaseOptions> options,
	Secrets secrets
) : BaseDataBridge(options.Value, secrets), IExpenseDataBridge
{
	public async Task<IReadOnlyCollection<Expense>> GetAllAsync(
		int year,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		var result = await connection.QueryAsync<Expense>(
			new CommandDefinition(
				"budget.expenses_s",
				new { p_year = year },
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
		return result.AsList();
	}

	public async Task<Expense> GetAsync(
		int id,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		return await connection.QuerySingleOrDefaultAsync<Expense>(
			new CommandDefinition(
				"budget.expense_s",
				new { p_id = id },
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
	}

	public async Task<int> CreateAsync(
		int year,
		string name,
		decimal amount,
		int categoryId,
		int monthsInterval,
		bool isDistributed,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		return await connection.QuerySingleAsync<int>(
			new CommandDefinition(
				"budget.expense_i",
				new
				{
					p_year = year,
					p_name = name,
					p_amount = MoneyParameter.Create(amount),
					p_category_id = categoryId,
					p_months_interval = monthsInterval,
					p_is_distributed = isDistributed,
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
		int categoryId,
		int monthsInterval,
		bool isDistributed,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		await connection.ExecuteAsync(
			new CommandDefinition(
				"budget.expense_u",
				new
				{
					p_id = id,
					p_name = name,
					p_amount = MoneyParameter.Create(amount),
					p_category_id = categoryId,
					p_months_interval = monthsInterval,
					p_is_distributed = isDistributed,
				},
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
				"budget.expense_d",
				new { p_id = id },
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
	}
}
