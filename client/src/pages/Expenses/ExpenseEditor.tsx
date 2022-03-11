import React, { useState } from 'react';
import { Modal, Button, Input, CurrencyInput, NumberInput } from '~/components';
import { IExpense } from '~/models';
import styles from './ExpenseEditor.css';

export interface IExpenseEditorProps {
	existingExpense: IExpense;
	isSavingExpense: boolean;
	onSave(expense: IExpense): void;
	onCancel(): void;
}

export default function ExpenseEditor({
	existingExpense,
	isSavingExpense,
	onSave,
	onCancel
}: IExpenseEditorProps) {
	const [name, setName] = useState(existingExpense?.name ?? '');
	const [amount, setAmount] = useState(existingExpense?.amount ?? 0);
	const [monthsInterval, setMonthsInterval] = useState(existingExpense?.monthsInterval ?? 1);
	const [category, setCategory] = useState(existingExpense?.category ?? '');

	const handleSaveClicked = () => {
		onSave({ name, amount, monthsInterval, category });
	};

	return (
		<Modal onClose={onCancel}>
			<h3>{existingExpense ? name : 'New Expense'}</h3>
			<div className={styles.inputs}>
				{!existingExpense &&
					<Input name='Name' value={name} onChange={setName} />
				}
				<CurrencyInput name='Amount' value={amount} onChange={setAmount} />
				<NumberInput name='Months Interval' value={monthsInterval} onChange={setMonthsInterval} />
				<Input name='Category' value={category} onChange={setCategory} />
			</div>
			<hr />
			<div className={styles.buttons}>
				<Button
					onClick={handleSaveClicked}
					isDisabled={isSavingExpense}
					isProcessing={isSavingExpense}
					className={styles.saveButton}>
					Save
				</Button>
				<Button onClick={onCancel} isDisabled={isSavingExpense}>Cancel</Button>
			</div>
		</Modal>
	);
}
