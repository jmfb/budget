using Amazon.DynamoDBv2.DataModel;

namespace Budget.Server.Models {
	[DynamoDBTable("budget-expenses")]
	public class Expense {
		[DynamoDBHashKey]
		public string Name { get; set; }

		[DynamoDBProperty]
		public decimal Amount { get; set; }

		[DynamoDBProperty]
		public string Category { get; set; }

		[DynamoDBProperty]
		public int MonthsInterval { get; set; }
	}
}
