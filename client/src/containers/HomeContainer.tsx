import React, { useEffect, useState } from 'react';
import { Home } from '~/pages';
import {
	useActions,
	useAppSelector,
	budgetSlice,
	pendingItemsSlice
} from '~/redux';
import { dateService } from '~/services';

export default function HomeContainer() {
	const {
		getBudget,
		saveTransaction,
		deleteTransaction,
		setOnlyShowNewItems,
		clearTransactionSave,
		clearTransactionDelete,
		getWeeklyTransactions
	} = useActions(budgetSlice.actions);
	const {
		savePendingItem,
		deletePendingItem,
		clearSave: clearPendingItemSave
	} = useActions(pendingItemsSlice.actions);
	const onlyShowNewItems = useAppSelector(
		state => state.budget.onlyShowNewItems
	);
	const isLoadingBudget = useAppSelector(
		state => state.budget.isLoadingBudget
	);
	const incomes = useAppSelector(state => state.incomes.incomes);
	const expenses = useAppSelector(state => state.expenses.expenses);
	const pendingItems = useAppSelector(
		state => state.pendingItems.pendingItems
	);
	const weeklyTransactions = useAppSelector(
		state => state.budget.weeklyTransactions
	);
	const isSavingTransaction = useAppSelector(
		state => state.budget.isSavingTransaction
	);
	const savingTransactionSuccess = useAppSelector(
		state => state.budget.savingTransactionSuccess
	);
	const isDeletingTransaction = useAppSelector(
		state => state.budget.isDeletingTransaction
	);
	const deletingTransactionSuccess = useAppSelector(
		state => state.budget.deletingTransactionSuccess
	);
	const isSavingPendingItem = useAppSelector(
		state => state.pendingItems.isSaving
	);
	const savingPendingItemSuccess = useAppSelector(
		state => state.pendingItems.wasSuccessful
	);
	const [weekOf, setWeekOf] = useState(dateService.getStartOfCurrentWeek());

	useEffect(() => {
		getBudget(weekOf);
	}, []);

	return (
		<Home
			{...{
				onlyShowNewItems,
				isLoadingBudget,
				incomes,
				expenses,
				pendingItems,
				weeklyTransactions,
				isSavingTransaction,
				savingTransactionSuccess,
				isDeletingTransaction,
				deletingTransactionSuccess,
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
				clearTransactionDelete,
				clearPendingItemSave,
				getWeeklyTransactions
			}}
		/>
	);
}
