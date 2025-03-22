namespace Budget.Server.Models;

public static class DataVersionNames
{
	public const string Incomes = "incomes";
	public const string Expenses = "expenses";
	public const string PendingItems = "pending-items";

	public static string TransactionsByWeek(string weekOf) =>
		$"transactions-week-{weekOf}";
}
