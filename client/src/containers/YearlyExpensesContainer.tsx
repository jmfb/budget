import { useParams } from 'react-router-dom';
import { YearlyExpenses } from '~/pages';
import { useActions, useAppSelector, expensesSlice } from '~/redux';
import { dateService } from '~/services';

type YearlyExpensesParams = {
	expense: string;
};

export default function YearlyExpensesContainer() {
	const { saveExpense } = useActions(expensesSlice);
	const { expense: expenseName } = useParams<YearlyExpensesParams>();

	const expense = useAppSelector(state =>
		state.expenses.expenses.find(expense => expense.name === expenseName)
	);
	const weeklyTransactions = useAppSelector(
		state => state.transactions.weeks
	);
	const isSavingExpense = useAppSelector(state => state.expenses.isSaving);
	const savingExpenseSuccess = useAppSelector(
		state => state.expenses.wasSuccessful
	);

	const year = dateService.getCurrentYear();
	const startOfYear = `${year}-01-01`;
	const yearlyExpenses = Object.entries(weeklyTransactions).flatMap(
		([weekOf, week]) =>
			week.transactions.filter(
				transaction =>
					transaction.expenseName === expenseName &&
					transaction.date >= startOfYear
			)
	);

	return (
		<YearlyExpenses
			expense={expense}
			yearlyExpenses={yearlyExpenses}
			isSavingExpense={isSavingExpense}
			savingExpenseSuccess={savingExpenseSuccess}
			saveExpense={saveExpense}
		/>
	);
}
