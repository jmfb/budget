namespace Budget.Server.DAL.Models;

public class PendingItem
{
	public int Id { get; set; }
	public string Name { get; set; }
	public decimal Amount { get; set; }
	public int? CategoryId { get; set; }
	public int? ExpenseId { get; set; }
	public int? IncomeId { get; set; }
}
