namespace Budget.Server.Contracts.RequestContracts;

public class UpdatePendingItemRequest
{
	public string Name { get; set; }
	public decimal Amount { get; set; }
	public int? CategoryId { get; set; }
	public int? ExpenseId { get; set; }
	public int? IncomeId { get; set; }
}
