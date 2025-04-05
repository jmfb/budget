import { Incomes } from "~/pages";
import { useActions, useAppSelector, incomesSlice } from "~/redux";

export default function IncomesContainer() {
	const { saveIncome, deleteIncome, clearSave } = useActions(incomesSlice);
	const incomes = useAppSelector((state) => state.incomes.incomes);
	const isSavingIncome = useAppSelector((state) => state.incomes.isSaving);
	const savingIncomeSuccess = useAppSelector(
		(state) => state.incomes.wasSuccessful,
	);

	return (
		<Incomes
			incomes={incomes}
			isSavingIncome={isSavingIncome}
			savingIncomeSuccess={savingIncomeSuccess}
			saveIncome={saveIncome}
			deleteIncome={deleteIncome}
			clearIncomeSave={clearSave}
		/>
	);
}
