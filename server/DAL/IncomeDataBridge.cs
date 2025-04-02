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

public interface IIncomeDataBridge
{
	Task<IReadOnlyCollection<Income>> GetAllAsync(
		int year,
		CancellationToken cancellationToken
	);

	Task<Income> GetAsync(int id, CancellationToken cancellationToken);

	Task<int> CreateAsync(
		int year,
		string name,
		decimal amount,
		int weeksInterval,
		CancellationToken cancellationToken
	);

	Task UpdateAsync(
		int id,
		string name,
		decimal amount,
		int weeksInterval,
		CancellationToken cancellationToken
	);

	Task DeleteAsync(int id, CancellationToken cancelloken);
}

public class IncomeDataBridge(
	IOptions<DatabaseOptions> options,
	IOptions<AppSettings> appSettings
) : BaseDataBridge(options.Value, appSettings.Value), IIncomeDataBridge
{
	public async Task<IReadOnlyCollection<Income>> GetAllAsync(
		int year,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		var result = await connection.QueryAsync<Income>(
			new CommandDefinition(
				"budget.incomes_s",
				new { p_year = year },
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
		return result.AsList();
	}

	public async Task<Income> GetAsync(
		int id,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		return await connection.QuerySingleOrDefaultAsync<Income>(
			new CommandDefinition(
				"budget.income_s",
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
		int weeksInterval,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		return await connection.QuerySingleAsync<int>(
			new CommandDefinition(
				"budget.income_i",
				new
				{
					p_year = year,
					p_name = name,
					p_amount = MoneyParameter.Create(amount),
					p_weeks_interval = weeksInterval,
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
		int weeksInterval,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		await connection.ExecuteAsync(
			new CommandDefinition(
				"budget.income_u",
				new
				{
					p_id = id,
					p_name = name,
					p_amount = MoneyParameter.Create(amount),
					p_weeks_interval = weeksInterval,
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
				"budget.income_d",
				new { p_id = id },
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
	}
}
