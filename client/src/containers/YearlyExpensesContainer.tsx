import { useParams } from "react-router-dom";
import { useAsyncState } from "~/hooks";
import { IExpense } from "~/models";
import { YearlyExpenses } from "~/pages";
import { useAppSelector, expensesActions } from "~/redux";
import { dateService } from "~/services";

type YearlyExpensesParams = {
	expenseId: string;
};

export default function YearlyExpensesContainer() {
	const expenseId = +(useParams<YearlyExpensesParams>().expenseId ?? "");

	const categoryById = useAppSelector(
		(state) => state.categories.categoryById,
	);
	const expense = useAppSelector(
		(state) => state.expenses.expenseById[expenseId],
	);
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

	const handleSaveExpense = (newValue: IExpense) => {
		const { id: expenseId, year, ...request } = newValue;
		void year;
		saveExpense({ expenseId, request });
	};

	return (
		<YearlyExpenses
			expense={expense!}
			categoryName={categoryById[expense?.categoryId ?? 0]?.name}
			yearlyExpenses={yearlyExpenses}
			isSavingExpense={isSavingExpense}
			savingExpenseSuccess={savingExpenseSuccess}
			saveExpense={handleSaveExpense}
		/>
	);
}
