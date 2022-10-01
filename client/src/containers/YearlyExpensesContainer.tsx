import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { YearlyExpenses } from '~/pages';
import {
	useActions,
	useAppSelector,
	budgetSlice,
	expensesSlice
} from '~/redux';
import { dateService } from '~/services';

type YearlyExpensesParams = {
	expense: string;
};

export default function YearlyExpensesContainer() {
	const { getYearlyExpenses, getBudget } = useActions(budgetSlice.actions);
	const { saveExpense } = useActions(expensesSlice.actions);
	const { expense: expenseName } = useParams<YearlyExpensesParams>();

	const expense = useAppSelector(state =>
		state.expenses.expenses.find(expense => expense.name === expenseName)
	);
	const isLoading = useAppSelector(
		state => state.budget.isLoadingYearlyExpenses
	);
	const yearlyExpenses = useAppSelector(state => state.budget.yearlyExpenses);
	const isSavingExpense = useAppSelector(state => state.expenses.isSaving);
	const savingExpenseSuccess = useAppSelector(
		state => state.expenses.wasSuccessful
	);

	useEffect(() => {
		getBudget(dateService.getStartOfCurrentWeek());
	}, []);

	useEffect(() => {
		const year = dateService.getCurrentYear();
		getYearlyExpenses({ expense: expenseName, year });
	}, [expenseName]);

	return (
		<YearlyExpenses
			{...{
				expense,
				isLoading,
				yearlyExpenses,
				isSavingExpense,
				savingExpenseSuccess,
				saveExpense
			}}
		/>
	);
}
