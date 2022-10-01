import React from 'react';
import { Incomes } from '~/pages';
import { useActions, useAppSelector, incomesSlice } from '~/redux';

export default function IncomesContainer() {
	const { saveIncome, deleteIncome, clearSave } = useActions(
		incomesSlice.actions
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
