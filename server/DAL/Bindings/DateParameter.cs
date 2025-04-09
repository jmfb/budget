using System;
using System.Data;
using Dapper;

namespace Budget.Server.DAL.Bindings;

public class DateParameter(DateOnly value) : SqlMapper.ICustomQueryParameter
{
	public void AddParameter(IDbCommand command, string name)
	{
		var parameter = command.CreateParameter();
		parameter.ParameterName = name;
		parameter.Value = value;
		parameter.DbType = DbType.Date;
		command.Parameters.Add(parameter);
	}

	public static DateParameter Create(DateOnly value) => new(value);
}
