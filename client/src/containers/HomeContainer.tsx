import React, { useState } from 'react';
import { Home } from '~/pages';
import {
	useActions,
	useAppSelector,
	budgetSlice,
	pendingItemsSlice,
	transactionsSlice,
	getExpenseTransactions
} from '~/redux';
import { dateService } from '~/services';

export default function HomeContainer() {
	const { setOnlyShowNewItems } = useActions(budgetSlice);
	const {
		saveTransaction,
		deleteTransaction,
		clearSave: clearTransactionSave
	} = useActions(transactionsSlice);
	const {
		savePendingItem,
		deletePendingItem,
		clearSave: clearPendingItemSave
	} = useActions(pendingItemsSlice);
	const onlyShowNewItems = useAppSelector(
		state => state.budget.onlyShowNewItems
	);
	const isLoadingBudget = useAppSelector(
		state => state.transactions.isRefreshing
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
	const isSavingTransaction = useAppSelector(
		state => state.transactions.isSaving
	);
	const savingTransactionSuccess = useAppSelector(
		state => state.transactions.wasSuccessful
	);
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
				isLoadingBudget,
				incomes,
				expenses,
				pendingItems,
				weeklyTransactions,
				expenseTransactions,
				isSavingTransaction,
				savingTransactionSuccess,
				isSavingPendingItem,
				savingPendingItemSuccess,
				weekOf,
				setWeekOf,
				setOnlyShowNewItems,
				saveTransaction,
				deleteTransaction,
				savePendingItem,
				deletePendingItem,
				clearTransactionSave,
				clearPendingItemSave
			}}
		/>
	);
}
