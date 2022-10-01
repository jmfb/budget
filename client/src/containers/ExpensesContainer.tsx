import React from 'react';
import { Expenses } from '~/pages';
import { useActions, useAppSelector, expensesSlice } from '~/redux';

export default function ExpensesContainer() {
	const { saveExpense, deleteExpense, clearSave } = useActions(expensesSlice);
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
