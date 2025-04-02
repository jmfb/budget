using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Budget.Server.Contracts.DataContracts;
using Budget.Server.Options;
using Dapper;
using Microsoft.Extensions.Options;
using Npgsql;

namespace Budget.Server.DAL;

public interface IDiagnosticDataBridge
{
	Task<DatabaseDiagnostics> GetAsync(CancellationToken cancellationToken);
}

public class DiagnosticDataBridge(IOptions<DatabaseOptions> options)
	: IDiagnosticDataBridge
{
	public async Task<DatabaseDiagnostics> GetAsync(
		CancellationToken cancellationToken
	)
	{
		await using var connection = new NpgsqlConnection(
			options.Value.ConnectionString
		);
		await connection.OpenAsync(cancellationToken);
		return await connection.QuerySingleAsync<DatabaseDiagnostics>(
			new CommandDefinition(
				"budget.diagnostics_s",
				commandType: CommandType.StoredProcedure,
				cancellationToken: cancellationToken
			)
		);
	}
}
