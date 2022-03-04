using Amazon.DynamoDBv2.DataModel;

namespace Budget.Server.Models {
	[DynamoDBTable("budget-transactions")]
	public class Transaction {
		[DynamoDBHashKey]
		public string Date { get; set; }

		[DynamoDBRangeKey]
		public int Id { get; set; }

		[DynamoDBProperty]
		public TransactionSource Source { get; set; }

		[DynamoDBProperty]
		public string RawText { get; set; }

		[DynamoDBProperty]
		public decimal Amount { get; set; }

		[DynamoDBProperty]
		public string OriginalCategory { get; set; }

		[DynamoDBProperty]
		public string Description { get; set; }

		[DynamoDBProperty]
		public string Category { get; set; }

		[DynamoDBProperty]
		public string Note { get; set; }

		[DynamoDBProperty]
		public string ExpenseName { get; set; }

		[DynamoDBProperty]
		public string IncomeName { get; set; }
	}
}
