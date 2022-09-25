import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { bindActionCreators } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { YearlyExpenses } from '~/pages';
import { useAppSelector, budgetSlice, expensesSlice } from '~/redux';
import { dateService } from '~/services';

type YearlyExpensesParams = {
	expense: string;
};

export default function YearlyExpensesContainer() {
	const dispatch = useDispatch();
	const { getYearlyExpenses, getBudget } = bindActionCreators(
		budgetSlice.actions,
		dispatch
	);
	const { saveExpense } = bindActionCreators(expensesSlice.actions, dispatch);
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
