using System;
using Budget.Server.Contracts.DataContracts;

namespace Budget.Server.Contracts.RequestContracts;

public class CreateTransactionRequest
{
	public DateOnly Date { get; set; }
	public TransactionSource SourceId { get; set; }
	public string RawText { get; set; }
	public decimal Amount { get; set; }
	public string OriginalCategory { get; set; }
	public int? CategoryId { get; set; }
	public string Note { get; set; }
	public int? ExpenseId { get; set; }
	public int? IncomeId { get; set; }
}
