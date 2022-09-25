import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { Expenses } from '~/pages';
import { useAppSelector, expensesSlice } from '~/redux';

export default function ExpensesContainer() {
	const dispatch = useDispatch();
	const { saveExpense, deleteExpense, clearSave } = bindActionCreators(
		expensesSlice.actions,
		dispatch
	);
	const expenses = useAppSelector(state => state.expenses.expenses);
	const isSavingExpense = useAppSelector(state => state.expenses.isSaving);
	const savingExpenseSuccess = useAppSelector(
		state => state.expenses.wasSuccessful
	);

	return (
		<Expenses
			{...{
				expenses,
				isSavingExpense,
				savingExpenseSuccess,
				saveExpense,
				deleteExpense
			}}
			clearExpenseSave={clearSave}
		/>
	);
}
