import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { Statistics } from '~/pages';
import { dateService } from '~/services';
import { useAppSelector, budgetSlice } from '~/redux';

export default function StatisticsContainer() {
	const dispatch = useDispatch();
	const { getBudget, getWeeklyTransactions } = bindActionCreators(
		budgetSlice.actions,
		dispatch
	);
	const weeklyTransactions = useAppSelector(
		state => state.budget.weeklyTransactions
	);
	const incomes = useAppSelector(state => state.incomes.incomes);
	const expenses = useAppSelector(state => state.expenses.expenses);
	const pendingItems = useAppSelector(state => state.budget.pendingItems);
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
