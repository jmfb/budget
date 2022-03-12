import React, { useEffect, useState } from 'react';
import { PageLoading, Button } from '~/components';
import Income from './Income';
import IncomeEditor from './IncomeEditor';
import { budgetService } from '~/services';
import { IIncome } from '~/models';
import styles from './Incomes.css';

export interface IIncomesProps {
	incomes: IIncome[];
	isSavingIncome: boolean;
	savingIncomeSuccess: boolean;
	saveIncome(income: IIncome): void;
	deleteIncome(income: IIncome): void;
	clearIncomeSave(): void;
}

export default function Incomes({
	incomes,
	isSavingIncome,
	savingIncomeSuccess,
	saveIncome,
	deleteIncome,
	clearIncomeSave
}: IIncomesProps) {
	const [showEditor, setShowEditor] = useState(false);
	const [existingIncome, setExistingIncome] = useState<IIncome>(null);
	const [isSaving, setIsSaving] = useState(false);

	const handleAddClicked = () => {
		setShowEditor(true);
	};

	const createEditClickedHandler = (income: IIncome) => () => {
		setShowEditor(true);
		setExistingIncome(income);
	};

	const handleSaveClicked = (income: IIncome) => {
		setIsSaving(true);
		saveIncome(income);
	};

	const closeEditor = () => {
		setShowEditor(false);
		setExistingIncome(null);
	};

	useEffect(() => {
		if (!isSavingIncome && isSaving) {
			setIsSaving(false);
			if (savingIncomeSuccess) {
				closeEditor();
			}
		}
	}, [isSavingIncome, isSaving, savingIncomeSuccess]);

	if (incomes === null) {
		return <PageLoading message='Loading incomes' />;
	}

	const weeklyIncomes = budgetService.getWeeklyIncomes(incomes);
	return (
		<div>
			<div className={styles.header}>
				<h2 className={styles.heading}>Incomes</h2>
				<h3 className={styles.heading}>{budgetService.format(weeklyIncomes)} every week</h3>
				<Button className={styles.addButton} onClick={handleAddClicked}>Add</Button>
			</div>
			<div>
				{incomes.map(income =>
					<Income
						key={income.name}
						{...{
							income,
							isSavingIncome,
							deleteIncome,
							clearIncomeSave
						}}
						onEdit={createEditClickedHandler(income)}
						/>
				)}
			</div>
			{showEditor &&
				<IncomeEditor
					{...{
						existingIncome,
						isSavingIncome
					}}
					onSave={handleSaveClicked}
					onCancel={closeEditor}
					/>
			}
		</div>
	);
}
