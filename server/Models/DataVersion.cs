using Amazon.DynamoDBv2.DataModel;

namespace Budget.Server.Models;

[DynamoDBTable("budget-data-versions")]
public class DataVersion
{
	[DynamoDBHashKey]
	public string Name { get; set; }

	[DynamoDBProperty]
	public long Version { get; set; }
}
