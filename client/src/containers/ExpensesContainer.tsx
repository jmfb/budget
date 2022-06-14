import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { Expenses } from '~/pages';
import { useAppSelector, budgetSlice } from '~/redux';
import { dateService } from '~/services';

export default function ExpensesContainer() {
	const dispatch = useDispatch();
	const { getBudget, saveExpense, deleteExpense, clearExpenseSave } =
		bindActionCreators(budgetSlice.actions, dispatch);
	const expenses = useAppSelector(state => state.budget.expenses);
	const isSavingExpense = useAppSelector(
		state => state.budget.isSavingExpense
	);
	const savingExpenseSuccess = useAppSelector(
		state => state.budget.savingExpenseSuccess
	);

	useEffect(() => {
		getBudget(dateService.getStartOfCurrentWeek());
	}, []);

	return (
		<Expenses
			{...{
				expenses,
				isSavingExpense,
				savingExpenseSuccess,
				saveExpense,
				deleteExpense,
				clearExpenseSave
			}}
		/>
	);
}
