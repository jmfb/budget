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
		saveIncome,
		deleteIncome,
		clearIncomeSave,
		saveExpense,
		deleteExpense,
		clearExpenseSave,
		saveTransaction,
		deleteTransaction,
		clearTransactionSave,
		getWeeklyTransactions
	} = bindActionCreators(budgetSlice.actions, dispatch);
	const budget = useAppSelector(state => state.budget);
	const [weekOf, setWeekOf] = useState(dateService.getStartOfCurrentWeek());

	useEffect(() => {
		getBudget(weekOf);
	}, []);

	return (
		<Home
			{...{
				...budget,
				weekOf,
				setWeekOf,
				saveIncome,
				deleteIncome,
				clearIncomeSave,
				saveExpense,
				deleteExpense,
				clearExpenseSave,
				saveTransaction,
				deleteTransaction,
				clearTransactionSave,
				getWeeklyTransactions
			}}
			/>
	);
}
