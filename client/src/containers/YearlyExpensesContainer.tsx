import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { bindActionCreators } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { YearlyExpenses } from '~/pages';
import { useAppSelector, budgetSlice } from '~/redux';
import { dateService } from '~/services';

type YearlyExpensesParams = {
	expense: string;
};

export default function YearlyExpensesContainer() {
	const dispatch = useDispatch();
	const { getYearlyExpenses, getBudget, saveExpense } = bindActionCreators(
		budgetSlice.actions,
		dispatch
	);
	const { expense: expenseName } = useParams<YearlyExpensesParams>();

	const expense = useAppSelector(state =>
		state.budget.expenses?.find(expense => expense.name === expenseName)
	);
	const isLoading = useAppSelector(
		state => state.budget.isLoadingYearlyExpenses
	);
	const yearlyExpenses = useAppSelector(state => state.budget.yearlyExpenses);
	const isSavingExpense = useAppSelector(
		state => state.budget.isSavingExpense
	);
	const savingExpenseSuccess = useAppSelector(
		state => state.budget.savingExpenseSuccess
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
