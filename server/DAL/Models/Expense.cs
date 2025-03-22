namespace Budget.Server.DAL.Models;

public class Expense
{
	public int Id { get; set; }
	public int Year { get; set; }
	public string Name { get; set; }
	public decimal Amount { get; set; }
	public int CategoryId { get; set; }
	public int MonthsInterval { get; set; }
	public bool IsDistributed { get; set; }
}
