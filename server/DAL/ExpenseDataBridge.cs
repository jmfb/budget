using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Budget.Server.DAL.Bindings;
using Budget.Server.DAL.Models;
using Budget.Server.Options;
using Dapper;
using Microsoft.Extensions.Options;
using Npgsql;

namespace Budget.Server.DAL;

public interface IExpenseDataBridge
{
	Task<IReadOnlyCollection<Expense>> GetExpensesAsync(
		int year,
		CancellationToken cancellationToken
	);

	Task<Expense> GetExpenseAsync(int id, CancellationToken cancellationToken);

	Task<int> CreateExpenseAsync(
		int year,
		string name,
		decimal amount,
		int categoryId,
		int monthsInterval,
		bool isDistributed,
		CancellationToken cancellationToken
	);

	Task UpdateExpenseAsync(
		int id,
		string name,
		decimal amount,
		int categoryId,
		int monthsInterval,
		bool isDistributed,
		CancellationToken cancellationToken
	);

	Task DeleteExpenseAsync(int id, CancellationToken cancellationToken);
}

public class ExpenseDataBridge(IOptions<DatabaseOptions> options)
	: IExpenseDataBridge
{
	public async Task<IReadOnlyCollection<Expense>> GetExpensesAsync(
		int year,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(
			options.Value.ConnectionString
		);
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

	public async Task<Expense> GetExpenseAsync(
		int id,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(
			options.Value.ConnectionString
		);
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

	public async Task<int> CreateExpenseAsync(
		int year,
		string name,
		decimal amount,
		int categoryId,
		int monthsInterval,
		bool isDistributed,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(
			options.Value.ConnectionString
		);
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

	public async Task UpdateExpenseAsync(
		int id,
		string name,
		decimal amount,
		int categoryId,
		int monthsInterval,
		bool isDistributed,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(
			options.Value.ConnectionString
		);
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

	public async Task DeleteExpenseAsync(
		int id,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(
			options.Value.ConnectionString
		);
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
