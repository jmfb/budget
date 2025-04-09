using System.Data;
using Dapper;

namespace Budget.Server.DAL.Bindings;

public class MoneyParameter(decimal value) : SqlMapper.ICustomQueryParameter
{
	public void AddParameter(IDbCommand command, string name)
	{
		var parameter = command.CreateParameter();
		parameter.ParameterName = name;
		parameter.Value = value;
		parameter.DbType = DbType.Currency;
		command.Parameters.Add(parameter);
	}

	public static MoneyParameter Create(decimal value) => new(value);
}
