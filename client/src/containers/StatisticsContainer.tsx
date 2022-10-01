import React, { useEffect } from 'react';
import { Statistics } from '~/pages';
import { dateService } from '~/services';
import { useActions, useAppSelector, budgetSlice } from '~/redux';

export default function StatisticsContainer() {
	const { getBudget, getWeeklyTransactions } = useActions(
		budgetSlice.actions
	);
	const weeklyTransactions = useAppSelector(
		state => state.budget.weeklyTransactions
	);
	const incomes = useAppSelector(state => state.incomes.incomes);
	const expenses = useAppSelector(state => state.expenses.expenses);
	const pendingItems = useAppSelector(
		state => state.pendingItems.pendingItems
	);
	const weeksOf = dateService.getStartOfLastXWeeks(12);
	const weeks = weeksOf.map(weekOf => weeklyTransactions[weekOf]);

	useEffect(() => {
		getBudget(weeksOf[0]);
		for (const weekOf of weeksOf) {
			if (weeklyTransactions[weekOf] === undefined) {
				getWeeklyTransactions(weekOf);
			}
		}
	}, []);

	return (
		<Statistics
			{...{
				incomes,
				expenses,
				pendingItems,
				weeks
			}}
		/>
	);
}
