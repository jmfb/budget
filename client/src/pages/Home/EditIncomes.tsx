import React, { useState, useEffect } from 'react';
import { Button, Modal } from '~/components';
import Income from './Income';
import IncomeEditor from './IncomeEditor';
import { IIncome } from '~/models';
import styles from './EditIncomes.css';

export interface IEditIncomesProps {
	incomes: IIncome[];
	isSavingIncome: boolean;
	savingIncomeSuccess: boolean;
	saveIncome(income: IIncome): void;
	deleteIncome(income: IIncome): void;
	clearIncomeSave(): void;
	onClose(): void;
}

export default function EditIncomes({
	incomes,
	isSavingIncome,
	savingIncomeSuccess,
	saveIncome,
	deleteIncome,
	clearIncomeSave,
	onClose
}: IEditIncomesProps) {
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

	return (
		<Modal {...{onClose}}>
			<h2>Incomes</h2>
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
			<hr />
			<div className={styles.buttons}>
				<Button className={styles.addButton} onClick={handleAddClicked}>Add</Button>
				<Button onClick={onClose}>Close</Button>
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
		</Modal>
	);
}
