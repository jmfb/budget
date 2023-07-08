import React, { useState } from 'react';
import { Search } from '~/pages';
import {
	useAppSelector,
	useActions,
	getExpenseTransactions,
	transactionsSlice
} from '~/redux';
import { budgetService } from '~/services';

export default function SearchContainer() {
	const {
		saveTransaction,
		deleteTransaction,
		clearSave: clearTransactionSave
	} = useActions(transactionsSlice);

	const weeks = useAppSelector(state => state.transactions.weeks);
	const incomes = useAppSelector(state => state.incomes.incomes);
	const expenses = useAppSelector(state => state.expenses.expenses);
	const expenseTransactions = useAppSelector(getExpenseTransactions);
	const isSavingTransaction = useAppSelector(
		state => state.transactions.isSaving
	);
	const savingTransactionSuccess = useAppSelector(
		state => state.transactions.wasSuccessful
	);

	const [searchQuery, setSearchQuery] = useState('');

	const weekStates = Object.values(weeks);
	const isLoading = weekStates.some(value => value.isLoading);

	const transactions = !searchQuery
		? []
		: weekStates.flatMap(state =>
				state.transactions.filter(transaction =>
					budgetService.matchesTransaction(searchQuery, transaction)
				)
		  );

	return (
		<Search
			{...{
				searchQuery,
				isLoading,
				incomes,
				expenses,
				expenseTransactions,
				transactions,
				isSavingTransaction,
				savingTransactionSuccess,
				saveTransaction,
				deleteTransaction,
				clearTransactionSave
			}}
			onUpdateSearch={setSearchQuery}
		/>
	);
}
