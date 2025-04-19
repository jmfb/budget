import { useParams } from "react-router-dom";
import { useAsyncState } from "~/hooks";
import { IUpdateExpenseRequest } from "~/models";
import { YearlyExpenses } from "./YearlyExpenses";
import { useAppSelector, expensesActions } from "~/redux";
import { dateService } from "~/services";

type YearlyExpensesParams = {
	expenseId: string;
};

export function YearlyExpensesContainer() {
	const expenseId = +(useParams<YearlyExpensesParams>().expenseId ?? "");

	const expense =
		useAppSelector((state) => state.expenses.expenseById[expenseId]) ??
		null;
	const categoryId = expense?.categoryId ?? 0;
	const category = useAppSelector(
		(state) => state.categories.categoryById[categoryId],
	);
	const categoryName = category?.name ?? "";

	const transactions = useAppSelector(
		(state) => state.transactions.transactions,
	);

	const {
		isLoading: isSavingExpense,
		wasSuccessful: savingExpenseSuccess,
		invoke: saveExpense,
	} = useAsyncState(expensesActions.updateExpense);

	const year = dateService.getCurrentYear();
	const startOfYear = `${year}-01-01`;
	const yearlyExpenses = transactions.filter(
		(transaction) =>
			transaction.expenseId === expenseId &&
			transaction.date >= startOfYear,
	);

	const handleSave = (request: IUpdateExpenseRequest) => {
		saveExpense({ expenseId, request });
	};

	return (
		<YearlyExpenses
			expense={expense}
			categoryName={categoryName}
			yearlyExpenses={yearlyExpenses}
			isSavingExpense={isSavingExpense}
			savingExpenseSuccess={savingExpenseSuccess}
			onSave={handleSave}
		/>
	);
}
