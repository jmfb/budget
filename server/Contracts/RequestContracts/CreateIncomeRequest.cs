namespace Budget.Server.Contracts.RequestContracts;

public class CreateIncomeRequest
{
	public int Year { get; set; }
	public string Name { get; set; }
	public decimal Amount { get; set; }
	public int WeeksInterval { get; set; }
}
