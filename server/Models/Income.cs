using Amazon.DynamoDBv2.DataModel;

namespace Budget.Server.Models;

[DynamoDBTable("budget-incomes")]
public class Income
{
	[DynamoDBHashKey]
	public string Name { get; set; }

	[DynamoDBProperty]
	public decimal Amount { get; set; }

	[DynamoDBProperty]
	public int WeeksInterval { get; set; }
}
