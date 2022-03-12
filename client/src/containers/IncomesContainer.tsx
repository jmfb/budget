import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { Incomes } from '~/pages';
import { useAppSelector, budgetSlice } from '~/redux';
import { dateService } from '~/services';

export default function IncomesContainer() {
	const dispatch = useDispatch();
	const {
		getBudget,
		saveIncome,
		deleteIncome,
		clearIncomeSave
	} = bindActionCreators(budgetSlice.actions, dispatch);
	const incomes = useAppSelector(state => state.budget.incomes);
	const isSavingIncome = useAppSelector(state => state.budget.isSavingIncome);
	const savingIncomeSuccess = useAppSelector(state => state.budget.savingIncomeSuccess);

	useEffect(() => {
		getBudget(dateService.getStartOfCurrentWeek());
	}, []);

	return (
		<Incomes
			{...{
				incomes,
				isSavingIncome,
				savingIncomeSuccess,
				saveIncome,
				deleteIncome,
				clearIncomeSave
			}}
			/>
	);
}
