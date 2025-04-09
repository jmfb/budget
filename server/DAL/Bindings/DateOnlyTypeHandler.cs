using System;
using System.Data;
using Dapper;

namespace Budget.Server.DAL.Bindings;

public class DateOnlyTypeHandler : SqlMapper.TypeHandler<DateOnly>
{
	public override void SetValue(IDbDataParameter parameter, DateOnly value) =>
		parameter.Value = value.ToDateTime(new TimeOnly(0, 0));

	public override DateOnly Parse(object value) =>
		DateOnly.FromDateTime((DateTime)value);
}
