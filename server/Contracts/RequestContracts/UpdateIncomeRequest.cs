namespace Budget.Server.Contracts.RequestContracts;

public class UpdateIncomeRequest
{
	public string Name { get; set; }
	public decimal Amount { get; set; }
	public int WeeksInterval { get; set; }
}
