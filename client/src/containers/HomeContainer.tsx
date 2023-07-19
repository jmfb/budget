import React, { useState } from 'react';
import { Home } from '~/pages';
import {
	useActions,
	useAppSelector,
	budgetSlice,
	pendingItemsSlice,
	getExpenseTransactions
} from '~/redux';
import { dateService } from '~/services';

export default function HomeContainer() {
	const { setOnlyShowNewItems } = useActions(budgetSlice);
	const {
		savePendingItem,
		deletePendingItem,
		clearSave: clearPendingItemSave
	} = useActions(pendingItemsSlice);
	const onlyShowNewItems = useAppSelector(
		state => state.budget.onlyShowNewItems
	);
	const incomes = useAppSelector(state => state.incomes.incomes);
	const expenses = useAppSelector(state => state.expenses.expenses);
	const pendingItems = useAppSelector(
		state => state.pendingItems.pendingItems
	);
	const weeklyTransactions = useAppSelector(
		state => state.transactions.weeks
	);
	const expenseTransactions = useAppSelector(getExpenseTransactions);
	const isSavingPendingItem = useAppSelector(
		state => state.pendingItems.isSaving
	);
	const savingPendingItemSuccess = useAppSelector(
		state => state.pendingItems.wasSuccessful
	);
	const [weekOf, setWeekOf] = useState(dateService.getStartOfCurrentWeek());

	return (
		<Home
			{...{
				onlyShowNewItems,
				incomes,
				expenses,
				pendingItems,
				weeklyTransactions,
				expenseTransactions,
				isSavingPendingItem,
				savingPendingItemSuccess,
				weekOf,
				setWeekOf,
				setOnlyShowNewItems,
				savePendingItem,
				deletePendingItem,
				clearPendingItemSave
			}}
		/>
	);
}
