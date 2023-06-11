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
}
