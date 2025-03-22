namespace Budget.Server.Contracts.RequestContracts;

public class UpdateExpenseRequest
{
	public string Name { get; set; }
	public decimal Amount { get; set; }
	public int CategoryId { get; set; }
	public int MonthsInterval { get; set; }
	public bool IsDistributed { get; set; }
}
