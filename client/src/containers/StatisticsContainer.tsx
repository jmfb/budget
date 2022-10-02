import React from 'react';
import { Statistics } from '~/pages';
import { dateService } from '~/services';
import { useAppSelector, getExpenseTransactions } from '~/redux';

export default function StatisticsContainer() {
	const expenseTransactions = useAppSelector(getExpenseTransactions);
	const weeklyTransactions = useAppSelector(
		state => state.transactions.weeks
	);
	const incomes = useAppSelector(state => state.incomes.incomes);
	const expenses = useAppSelector(state => state.expenses.expenses);
	const pendingItems = useAppSelector(
		state => state.pendingItems.pendingItems
	);
	const weeksOf = dateService.getStartOfLastXWeeks(12);
	const weeks = weeksOf.map(weekOf => weeklyTransactions[weekOf]);

	return (
		<Statistics
			{...{
				incomes,
				expenses,
				pendingItems,
				weeks,
				expenseTransactions
			}}
		/>
	);
}
