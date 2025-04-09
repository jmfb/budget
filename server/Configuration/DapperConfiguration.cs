using System;
using Budget.Server.DAL.Bindings;
using Dapper;

namespace Budget.Server.Configuration;

public static class DapperConfiguration
{
	public static void Configure()
	{
		AppContext.SetSwitch("Npgsql.EnableStoredProcedureCompatMode", true);
		DefaultTypeMap.MatchNamesWithUnderscores = true;
		SqlMapper.AddTypeHandler(new DateOnlyTypeHandler());
	}
}
