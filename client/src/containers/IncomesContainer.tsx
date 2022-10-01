import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { Incomes } from '~/pages';
import { useAppSelector, incomesSlice } from '~/redux';

export default function IncomesContainer() {
	const dispatch = useDispatch();
	const { saveIncome, deleteIncome, clearSave } = bindActionCreators(
		incomesSlice.actions,
		dispatch
	);
	const incomes = useAppSelector(state => state.incomes.incomes);
	const isSavingIncome = useAppSelector(state => state.incomes.isSaving);
	const savingIncomeSuccess = useAppSelector(
		state => state.incomes.wasSuccessful
	);

	return (
		<Incomes
			{...{
				incomes,
				isSavingIncome,
				savingIncomeSuccess,
				saveIncome,
				deleteIncome
			}}
			clearIncomeSave={clearSave}
		/>
	);
}
