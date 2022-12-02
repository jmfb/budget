import React from 'react';
import {
	useAppSelector,
	useActions,
	transactionsSlice,
	pendingItemsSlice,
	expensesSlice,
	incomesSlice
} from '~/redux';
import { About } from '~/pages/About/About';

export default function AboutContainer() {
	const { downloadTransactions } = useActions(transactionsSlice);
	const { downloadPendingItems } = useActions(pendingItemsSlice);
	const { downloadExpenses } = useActions(expensesSlice);
	const { downloadIncomes } = useActions(incomesSlice);
	const isDownloadingTransactions = useAppSelector(
		state => state.transactions.isDownloading
	);
	const isDownloadingPendingItems = useAppSelector(
		state => state.pendingItems.isDownloading
	);
	const isDownloadingExpenses = useAppSelector(
		state => state.expenses.isDownloading
	);
	const isDownloadingIncomes = useAppSelector(
		state => state.incomes.isDownloading
	);
	return (
		<About
			{...{
				isDownloadingTransactions,
				isDownloadingPendingItems,
				isDownloadingExpenses,
				isDownloadingIncomes,
				downloadTransactions,
				downloadPendingItems,
				downloadExpenses,
				downloadIncomes
			}}
		/>
	);
}
