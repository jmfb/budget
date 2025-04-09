namespace Budget.Server.Contracts.RequestContracts;

public class RetireCategoryRequest
{
	public int RetireId { get; set; }
	public int ReplacementId { get; set; }
}
