namespace Budget.Server.DAL.Models;

public class Income
{
	public int Id { get; set; }
	public int Year { get; set; }
	public string Name { get; set; }
	public decimal Amount { get; set; }
	public int WeeksInterval { get; set; }
}
