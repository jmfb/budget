import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { Home } from '~/pages';
import { useAppSelector, budgetSlice } from '~/redux';
import { dateService } from '~/services';

export default function HomeContainer() {
	const dispatch = useDispatch();
	const {
		getBudget,
		saveTransaction,
		deleteTransaction,
		clearTransactionSave,
		getWeeklyTransactions
	} = bindActionCreators(budgetSlice.actions, dispatch);
	const isLoadingBudget = useAppSelector(state => state.budget.isLoadingBudget);
	const incomes = useAppSelector(state => state.budget.incomes);
	const expenses = useAppSelector(state => state.budget.expenses);
	const weeklyTransactions = useAppSelector(state => state.budget.weeklyTransactions);
	const isSavingTransaction = useAppSelector(state => state.budget.isSavingTransaction);
	const savingTransactionSuccess = useAppSelector(state => state.budget.savingTransactionSuccess);
	const [weekOf, setWeekOf] = useState(dateService.getStartOfCurrentWeek());

	useEffect(() => {
		getBudget(weekOf);
	}, []);

	return (
		<Home
			{...{
				isLoadingBudget,
				incomes,
				expenses,
				weeklyTransactions,
				isSavingTransaction,
				savingTransactionSuccess,
				weekOf,
				setWeekOf,
				saveTransaction,
				deleteTransaction,
				clearTransactionSave,
				getWeeklyTransactions
			}}
			/>
	);
}
