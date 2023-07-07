using Amazon.DynamoDBv2.DataModel;

namespace Budget.Server.Models;

[DynamoDBTable("budget-pending-items")]
public class PendingItem {
	[DynamoDBHashKey]
	public int Id { get; set; }

	[DynamoDBProperty]
	public string Name { get; set; }

	[DynamoDBProperty]
	public decimal Amount { get; set; }

	[DynamoDBProperty]
	public string Category { get; set; }

	[DynamoDBProperty]
	public string ExpenseName { get; set; }

	[DynamoDBProperty]
	public string IncomeName { get; set; }
}
