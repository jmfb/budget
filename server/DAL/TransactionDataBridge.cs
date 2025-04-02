using System;
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

public interface ITransactionDataBridge
{
	Task<IReadOnlyCollection<Transaction>> GetAllAsync(
		DateOnly startDateInclusive,
		DateOnly endDateExclusive,
		int skip,
		int take,
		CancellationToken cancellationToken
	);

	Task<Transaction> GetAsync(int id, CancellationToken cancellationToken);

	Task<int> CreateAsync(
		DateOnly date,
		TransactionSource sourceId,
		string rawText,
		decimal amount,
		string originalCategory,
		int? categoryId,
		string note,
		int? expenseId,
		int? incomeId,
		CancellationToken cancellationToken
	);

	Task UpdateAsync(
		int id,
		DateOnly date,
		TransactionSource sourceId,
		string rawText,
		decimal amount,
		string originalCategory,
		int? categoryId,
		string note,
		int? expenseId,
		int? incomeId,
		CancellationToken cancellationToken
	);

	Task DeleteAsync(int id, CancellationToken cancellationToken);
}

public class TransactionDataBridge(
	IOptions<DatabaseOptions> options,
	IOptions<AppSettings> appSettings
) : BaseDataBridge(options.Value, appSettings.Value), ITransactionDataBridge
{
	public async Task<IReadOnlyCollection<Transaction>> GetAllAsync(
		DateOnly startDateInclusive,
		DateOnly endDateExclusive,
		int skip,
		int take,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		var result = await connection.QueryAsync<Transaction>(
			new CommandDefinition(
				"budget.transactions_s",
				new
				{
					p_start_date_inclusive = DateParameter.Create(
						startDateInclusive
					),
					p_end_date_exclusive = DateParameter.Create(
						endDateExclusive
					),
					p_skip = skip,
					p_take = take,
				},
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
		return result.AsList();
	}

	public async Task<Transaction> GetAsync(
		int id,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		return await connection.QuerySingleOrDefaultAsync<Transaction>(
			new CommandDefinition(
				"budget.transaction_s",
				new { p_id = id },
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
	}

	public async Task<int> CreateAsync(
		DateOnly date,
		TransactionSource sourceId,
		string rawText,
		decimal amount,
		string originalCategory,
		int? categoryId,
		string note,
		int? expenseId,
		int? incomeId,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		return await connection.QuerySingleAsync<int>(
			new CommandDefinition(
				"budget.transaction_i",
				new
				{
					p_date = DateParameter.Create(date),
					p_source_id = sourceId,
					p_raw_text = rawText,
					p_amount = MoneyParameter.Create(amount),
					p_original_category = originalCategory,
					p_category_id = categoryId,
					p_note = note,
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
		DateOnly date,
		TransactionSource sourceId,
		string rawText,
		decimal amount,
		string originalCategory,
		int? categoryId,
		string note,
		int? expenseId,
		int? incomeId,
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		await connection.ExecuteAsync(
			new CommandDefinition(
				"budget.transaction_u",
				new
				{
					p_id = id,
					p_date = DateParameter.Create(date),
					p_source_id = sourceId,
					p_raw_text = rawText,
					p_amount = MoneyParameter.Create(amount),
					p_original_category = originalCategory,
					p_category_id = categoryId,
					p_note = note,
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
		await using var connection = new NpgsqlConnection(ConnectionString);
		await connection.OpenAsync(cancellationToken);
		await connection.ExecuteAsync(
			new CommandDefinition(
				"budget.transaction_d",
				new { p_id = id },
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
	}
}
